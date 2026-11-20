// What every effect script can rely on: the contract it must fulfil and a few
// helpers, so generated scripts stay short and move in a consistent way.
import type React from 'react';
import type { Brand, CaptionWord, Timeline } from './types';

// Platform controls cover these margins of a 1080×1920 frame; text stays out.
export const SAFE = { top: 200, bottom: 250, left: 80, right: 170 };
// Text is centered on the frame, so both sides keep the wider of the two margins.
export const SIDE = Math.max(SAFE.left, SAFE.right);

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
// Fast start, gentle stop.
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
// Overshoots a little and settles at 1.
export const bounce = (x: number) => {
  const k = clamp01(x);
  return 1 - Math.exp(-7 * k) * Math.cos(9 * k);
};

export type Page = { start: number; end: number; words: CaptionWord[] };

// Groups words into short pages: at most `maxWords`, and a new page after
// sentence punctuation or a pause longer than half a second. Each page stays
// until the next one starts (at most 0.6 s), so captions do not flicker.
export const toPages = (words: CaptionWord[], maxWords = 3): Page[] => {
  const pages: Page[] = [];
  let current: CaptionWord[] = [];
  const flush = () => {
    if (current.length === 0) return;
    pages.push({ start: current[0].start, end: current[current.length - 1].end, words: current });
    current = [];
  };
  words.forEach((w, i) => {
    const prev = words[i - 1];
    if (prev && (w.start - prev.end > 0.5 || /[.!?¿¡…]$/.test(prev.text))) flush();
    current.push(w);
    if (current.length >= maxWords) flush();
  });
  flush();
  return pages.map((p, i) => ({ ...p, end: Math.max(p.end, Math.min(pages[i + 1]?.start ?? p.end, p.end + 0.6)) }));
};

export type EffectProps = {
  // Seconds since the effect started, and the current output-timeline second.
  t: number;
  now: number;
  // The effect's own interval on the output timeline, in seconds.
  start: number;
  end: number;
  fps: number;
  width: number;
  height: number;
  brand: Brand;
  // Everything specific to one video (texts, positions, files) arrives here.
  params: Record<string, any>;
  // Word timings of the whole video, on the output timeline.
  words: CaptionWord[];
  timeline: Timeline;
};

export type Camera = { scale: number; focusX: number; focusY: number };

// An effect script default-exports one of these. `Layer` draws over the
// picture; `camera` moves the picture itself (return null to leave it alone).
// Both must be pure functions of their props: same props, same frame.
export type Effect = {
  Layer?: React.FC<EffectProps>;
  camera?: (props: EffectProps) => Camera | null;
};
