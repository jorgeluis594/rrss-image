# Export and quality review

## Export settings

One master serves TikTok, Reels, and Shorts:

| Setting | Value |
| --- | --- |
| Container | MP4 with `+faststart` |
| Video | H.264, `yuv420p`, 1080×1920, constant 30 fps (the engine's render defaults) |
| Audio | AAC, 48 kHz, stereo, 192–320 kbps, mixed to the targets in `audio.md` |

The engine renders these video settings; `finalizar.mjs` normalizes loudness, writes
the audio settings, and adds `+faststart` without re-encoding the picture.

Name files `exports/<video-id>_<plataforma | master>_v<N>.mp4`. Make a separate file
per platform only when something differs (duration limit, text position after a UI
check). Platform duration limits change; verify the current limit when the video is
longer than 60 s.

Cover: export `exports/<video-id>_portada.png` (1080×1920) from a frame where the hook
text is readable, for platforms that let you choose the cover:
`ffmpeg -v error -ss <t> -i <final.mp4> -frames:v 1 exports/<video-id>_portada.png`.

## Verification without watching

You cannot watch or listen to the video. Turn every check into a number or an image
you open and look at:

```bash
# streams, resolution, fps, duration
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration -of compact borrador.mp4

# contact sheet: two frames per second
ffmpeg -v error -i borrador.mp4 -vf "fps=2,scale=180:-1,tile=8x8" -frames:v 1 edicion/contacto.png

# one frame at a given moment (spelling, framing, punch-in, product)
ffmpeg -v error -ss 2.2 -i borrador.mp4 -frames:v 1 -vf scale=540:-1 edicion/frame_2.2.png

# unintended black or frozen sections
ffmpeg -hide_banner -i borrador.mp4 -vf "blackdetect=d=0.2,freezedetect=d=1" -an -f null -
```

Look at a frame inside every scene and at every text appearance. Audio measurements
are in `audio.md`. Record what was checked, how, and the result in `edicion.md`;
label anything not verified.

## Safe-area check

Extract the frames where text appears and the final CTA frame, draw the unsafe areas,
and look at them:

```bash
ffmpeg -v error -ss <t> -i borrador.mp4 -frames:v 1 \
  -vf "drawbox=x=0:y=ih-250:w=iw:h=250:color=red@0.35:t=fill,drawbox=x=0:y=0:w=iw:h=200:color=red@0.35:t=fill,drawbox=x=iw-150:y=0:w=150:h=ih:color=red@0.35:t=fill" \
  edicion/zona_<t>.png
```

No text, face, or product detail that matters may sit in the red areas.

## Quality checklist

Run on every draft shown to the user and on the final exports. A failed blocking item
is fixed before delivery.

Blocking:

- [ ] Every on-screen text, price, offer, and CTA matches `VIDEO.md` exactly; no typos.
- [ ] The product matches the real product in every shot; no hidden generated defects.
- [ ] Music and sound effects have a recorded commercial license.
- [ ] Voice is intelligible in every section; loudness and peak within targets.
- [ ] 1080×1920, constant frame rate, correct duration; no black or frozen sections.
- [ ] Text and key action outside the unsafe areas.
- [ ] Nothing in the draft breaks a «No puede» or «Nunca» line of `ESTILO-VIDEO.md`.

Retention:

- [ ] Frame 0 has movement or a face plus the hook text; no logo or intro.
- [ ] The hook's premise is clear by second 3.
- [ ] No shot longer than the brand's style allows (4 s without `ESTILO-VIDEO.md`);
      no silences or filler left.
- [ ] B-roll shows each claim while it is said.
- [ ] Subtitles synchronized, short, not duplicating on-screen text.
- [ ] One CTA, readable for at least 1.5 s; loop to the opening when planned.
- [ ] Effects serve specific moments; not on every cut.

Record the result of each item in the «Verificación» section of `edicion.md`.

## Delivery notes

- Realistic generated clips (`fuente: generado` in `material.md`) need the platform's
  AI-generated content label when publishing; state it in the delivery.
- Mention anything not verified (for example, how a font renders in the app's own
  editor) instead of implying it was checked.
