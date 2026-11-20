import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { effects as brandEffects } from './efectos/registro';
import { SIDE, toPages } from './kit';
import type { Camera, Effect, EffectProps } from './kit';
import type { AudioItem, Brand, Captions, Clip, EffectItem, TextItem, Timeline } from './types';

const toFrames = (seconds: number, fps: number) => Math.round(seconds * fps);

const useFont = (family: string | undefined, file: string | undefined) => {
  const [handle] = useState(() => (family && file ? delayRender(`font ${file}`) : null));
  useEffect(() => {
    if (!family || !file || handle === null) return;
    // The weight range lets a variable font answer any weight and stops the
    // browser from faking bold on a static one.
    const face = new FontFace(family, `url(${staticFile(file)})`, { weight: '100 900' });
    face
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch((err) => cancelRender(new Error(`No se pudo cargar la fuente ${file}: ${err}`)));
  }, [family, file, handle]);
};

const edgeFade = (frame: number, total: number, fps: number, fadeIn = 0, fadeOut = 0) => {
  let opacity = 1;
  if (fadeIn > 0) opacity *= Math.min(1, frame / (fadeIn * fps));
  if (fadeOut > 0) opacity *= Math.min(1, (total - frame) / (fadeOut * fps));
  return Math.max(0, opacity);
};

const ClipLayer: React.FC<{ clip: Clip; total: number }> = ({ clip, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = clip.zoom;
  const scale = zoom
    ? interpolate(frame, [0, Math.max(1, total - 1)], [zoom.from, zoom.to], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: zoom.ease === 'linear' ? Easing.linear : Easing.inOut(Easing.cubic),
      })
    : 1;
  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: `scale(${scale})`,
    transformOrigin: `${(zoom?.focusX ?? 0.5) * 100}% ${(zoom?.focusY ?? 0.5) * 100}%`,
  };
  const volume = clip.volume ?? 1;
  return (
    <AbsoluteFill style={{ opacity: edgeFade(frame, total, fps, clip.fadeIn, clip.fadeOut) }}>
      {clip.kind === 'image' ? (
        <Img src={staticFile(clip.src)} style={style} />
      ) : (
        <OffthreadVideo
          src={staticFile(clip.src)}
          trimBefore={toFrames(clip.in ?? 0, fps)}
          playbackRate={clip.speed ?? 1}
          volume={volume}
          muted={volume === 0}
          style={style}
        />
      )}
    </AbsoluteFill>
  );
};

type Interval = [number, number];

const speechIntervals = (timeline: Timeline): Interval[] => {
  const fromAudio = (timeline.audio ?? [])
    .filter((a) => a.role === 'voz' && a.duration !== undefined)
    .map((a): Interval => [a.start, a.start + (a.duration as number)]);
  const fromClips = timeline.clips
    .filter((c) => c.speech && (c.volume ?? 1) > 0)
    .map((c): Interval => [c.start, c.start + c.duration]);
  return [...fromAudio, ...fromClips];
};

// Music gain at time t: `under` inside speech, `base` away from it, with a
// linear ramp of `ramp` seconds on each side of every speech interval.
const duckGain = (t: number, speech: Interval[], base: number, under: number, ramp: number) => {
  let nearest = Infinity;
  for (const [a, b] of speech) {
    const d = t < a ? a - t : t > b ? t - b : 0;
    nearest = Math.min(nearest, d);
  }
  if (nearest === Infinity) return base;
  const k = ramp > 0 ? Math.min(1, nearest / ramp) : nearest > 0 ? 1 : 0;
  return under + (base - under) * k;
};

const AudioLayer: React.FC<{ item: AudioItem; timeline: Timeline }> = ({ item, timeline }) => {
  const { fps } = useVideoConfig();
  const speech = speechIntervals(timeline);
  const duck = timeline.ducking ?? {};
  const startFrame = toFrames(item.start, fps);
  const total = item.duration !== undefined ? toFrames(item.duration, fps) : undefined;
  return (
    <Sequence from={startFrame} durationInFrames={total} layout="none">
      <Audio
        src={staticFile(item.src)}
        trimBefore={toFrames(item.in ?? 0, fps)}
        volume={(f) => {
          const gain = item.volume ?? 1;
          const fade = edgeFade(f, total ?? Infinity, fps, item.fadeIn, item.fadeOut);
          if (item.role !== 'musica') return gain * fade;
          const t = (startFrame + f) / fps;
          return gain * fade * duckGain(t, speech, duck.base ?? 1, duck.underSpeech ?? 0.12, duck.rampSeconds ?? 0.25);
        }}
      />
    </Sequence>
  );
};

const TEXT_STYLES = {
  gancho: { fontSize: 92, y: 0.3 },
  clave: { fontSize: 72, y: 0.42 },
  cta: { fontSize: 80, y: 0.66 },
};

const TextLayer: React.FC<{ item: TextItem; brand: Brand }> = ({ item, brand }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const style = TEXT_STYLES[item.style ?? 'clave'];
  const pop = item.animation === 'none' ? 1 : spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const isCta = item.style === 'cta';
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: SIDE,
          right: SIDE,
          top: (item.y ?? style.y) * height,
          transform: `translateY(-50%) scale(${0.85 + 0.15 * pop})`,
          opacity: pop,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: brand.fontFamily ?? 'sans-serif',
            fontWeight: 800,
            fontSize: style.fontSize,
            lineHeight: 1.08,
            textAlign: 'center',
            color: isCta ? '#111' : brand.textColor ?? '#fff',
            background: isCta ? brand.accentColor ?? '#ffd400' : brand.boxColor ?? 'rgba(0,0,0,0.62)',
            padding: '18px 30px',
            borderRadius: 22,
            whiteSpace: 'pre-wrap',
          }}
        >
          {item.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Plain captions: what the engine draws when no brand effect does it.
const CaptionLayer: React.FC<{ captions: Captions; texts: TextItem[]; brand: Brand }> = ({ captions, texts, brand }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const t = frame / fps;
  if (captions.hideDuringTexts !== false && texts.some((x) => t >= x.start && t < x.end)) return null;
  if ((captions.hide ?? []).some(([a, b]) => t >= a && t < b)) return null;
  const page = toPages(captions.words, captions.maxWords ?? 3).find((p) => t >= p.start && t < p.end);
  if (!page) return null;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: SIDE,
          right: SIDE,
          top: (captions.y ?? 0.7) * height,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          fontFamily: brand.captionFontFamily ?? brand.fontFamily ?? 'sans-serif',
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.1,
          color: brand.textColor ?? '#fff',
          WebkitTextStroke: `10px ${brand.strokeColor ?? 'rgba(0,0,0,0.85)'}`,
          paintOrder: 'stroke fill',
        }}
      >
        {page.words.map((w, i) => (
          <span key={i} style={{ color: t >= w.start && t < w.end ? brand.accentColor ?? '#ffd400' : undefined }}>
            {w.text}{' '}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const findEffect = (name: string): Effect => {
  const effect = brandEffects[name];
  if (!effect) throw new Error(`El efecto "${name}" no está en efectos/ de la marca; ejecuta scripts/efectos.mjs o revisa el nombre.`);
  return effect;
};

const effectProps = (item: EffectItem, now: number, timeline: Timeline, fps: number, width: number, height: number): EffectProps => ({
  t: now - item.start,
  now,
  start: item.start,
  end: item.end,
  fps,
  width,
  height,
  brand: timeline.brand ?? {},
  params: item.params ?? {},
  words: timeline.captions?.words ?? [],
  timeline,
});

// The picture moves with the last active effect that returns a camera.
const CameraStage: React.FC<{ timeline: Timeline; children: React.ReactNode }> = ({ timeline, children }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const now = frame / fps;
  let camera: Camera | null = null;
  for (const item of timeline.effects ?? []) {
    if (now < item.start || now >= item.end) continue;
    camera = findEffect(item.name).camera?.(effectProps(item, now, timeline, fps, width, height)) ?? camera;
  }
  return (
    <AbsoluteFill
      style={camera ? { transform: `scale(${camera.scale})`, transformOrigin: `${camera.focusX * 100}% ${camera.focusY * 100}%` } : undefined}
    >
      {children}
    </AbsoluteFill>
  );
};

const EffectLayer: React.FC<{ item: EffectItem; timeline: Timeline }> = ({ item, timeline }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const Layer = findEffect(item.name).Layer;
  if (!Layer) return null;
  return <Layer {...effectProps(item, item.start + frame / fps, timeline, fps, width, height)} />;
};

export const Video: React.FC<Timeline> = (timeline) => {
  const { fps } = useVideoConfig();
  const brand = timeline.brand ?? {};
  useFont(brand.fontFamily, brand.fontFile);
  useFont(brand.captionFontFamily, brand.captionFontFile);
  const clips = [...timeline.clips].sort((a, b) => (a.track ?? 1) - (b.track ?? 1));
  const texts = timeline.texts ?? [];
  return (
    <AbsoluteFill style={{ background: timeline.background ?? '#000' }}>
      <CameraStage timeline={timeline}>
        {clips.map((clip, i) => {
          const total = toFrames(clip.duration, fps);
          return (
            <Sequence key={`c${i}`} from={toFrames(clip.start, fps)} durationInFrames={total}>
              <ClipLayer clip={clip} total={total} />
            </Sequence>
          );
        })}
      </CameraStage>
      {timeline.captions && timeline.captions.plain !== false ? <CaptionLayer captions={timeline.captions} texts={texts} brand={brand} /> : null}
      {texts.map((item, i) => (
        <Sequence key={`t${i}`} from={toFrames(item.start, fps)} durationInFrames={toFrames(item.end - item.start, fps)}>
          <TextLayer item={item} brand={brand} />
        </Sequence>
      ))}
      {(timeline.effects ?? []).map((item, i) => (
        <Sequence key={`e${i}`} from={toFrames(item.start, fps)} durationInFrames={Math.max(1, toFrames(item.end - item.start, fps))}>
          <EffectLayer item={item} timeline={timeline} />
        </Sequence>
      ))}
      {(timeline.audio ?? []).map((item, i) => (
        <AudioLayer key={`a${i}`} item={item} timeline={timeline} />
      ))}
    </AbsoluteFill>
  );
};
