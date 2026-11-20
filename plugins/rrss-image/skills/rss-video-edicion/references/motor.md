# Video engine

The skill ships a Remotion project in `motor/` (`rrss-video-engine`). It renders any
video from one data file, `edicion/timeline.json`; you never write React code per
video. The engine also has scripts to transcribe speech, validate a timeline, and
produce the publishable file.

Requirements: Node 20+, `ffmpeg` and `ffprobe` in the PATH, and `make` and a C++
compiler for the first transcription (whisper.cpp is built locally). Remotion is free
for individuals and companies of up to 3 people; larger companies need a company
license (remotion.dev/docs/license). Tell the user if their situation may require one.

## Install

The engine lives in the user-data directory, never inside the plugin installation:

- macOS: `~/Library/Application Support/rrss-image/motor-video/`
- Windows: `%LOCALAPPDATA%\rrss-image\motor-video\`
- Linux: `${XDG_DATA_HOME:-~/.local/share}/rrss-image/motor-video/`

If that folder is missing, or its `package.json` `version` differs from the bundled
`motor/package.json`, copy the bundled `motor/` contents there (keep any existing
`node_modules/` and `whisper/`; `src/efectos/` is refilled by `efectos.mjs`), then run `npm ci` in it. Use the same write-access
checks as brand storage. npm may warn that it skipped esbuild's install script; the
render still works. The first render downloads a headless browser; the first
transcription builds whisper.cpp and downloads the model (about 500 MB for `small`).
Tell the user before these downloads.

Run every command below from the engine folder.

## Workflow

```bash
# 1. word timings of a voice file or a take, placed at its timeline position
node scripts/transcribir.mjs <video>/material/voz/E02_ana.wav <video>/edicion/palabras-E02.json --desplazamiento 3.2

# 2. check the timeline against the files
node scripts/validar.mjs <video>

# 3. load the brand's effect scripts (before every check or render that uses them)
node scripts/efectos.mjs <brand-dir>

# 4. render a draft
npx remotion render src/index.ts Video <video>/edicion/borrador-v1.mp4 \
  --props=<video>/edicion/timeline.json --public-dir=<video>

# 5. after approval: loudness-normalized, publishable file
node scripts/finalizar.mjs <video>/edicion/borrador-v2.mp4 <video>/exports/<video-id>_master_v2.mp4
```

Use absolute paths for `<video>`. `--public-dir` makes every path in the timeline
relative to the video folder. File names must be ASCII without spaces; the validator
rejects others. A 30 s video renders in roughly one to three minutes on a laptop.

`transcribir.mjs` defaults to Spanish and the `small` model (`--idioma`, `--modelo`).
Transcribe each selected take or voice file separately with its timeline start as
`--desplazamiento`, then merge the word lists in time order into `captions.words`.
If a take is trimmed (`in` > 0), subtract `in` from the offset, and drop words that
fall outside the part of the take that is used.

## timeline.json

Times are seconds on the output timeline; `in` is seconds in the source file. Paths
are relative to the video folder.

```json
{
  "fps": 30,
  "brand": {
    "fontFamily": "Marca",
    "fontFile": "edicion/fuentes/marca-bold.ttf",
    "textColor": "#ffffff",
    "accentColor": "#ffd400",
    "boxColor": "rgba(0,0,0,0.62)"
  },
  "clips": [
    { "src": "material/E01-A_t2.mp4", "start": 0, "duration": 1.6, "in": 0.6, "speech": true },
    { "src": "material/E01-A_t2.mp4", "start": 1.6, "duration": 1.4, "in": 2.2, "speech": true,
      "zoom": { "from": 1.2, "to": 1.2, "focusX": 0.5, "focusY": 0.35 } },
    { "src": "material/E03-B_t1.mp4", "start": 3, "duration": 2.5, "in": 1, "volume": 0,
      "zoom": { "from": 1.03, "to": 1.1 } },
    { "src": "material/E04-A_t1.mp4", "start": 5.5, "duration": 2, "in": 0, "speed": 2, "volume": 0 }
  ],
  "texts": [
    { "text": "10 MINUTOS.\nTODA LA LISTA.", "start": 0, "end": 3, "style": "gancho" },
    { "text": "Escríbenos LISTA por DM", "start": 27.5, "end": 30, "style": "cta" }
  ],
  "captions": { "words": [ { "text": "Me", "start": 0.62, "end": 0.75 } ], "maxWords": 3 },
  "audio": [
    { "src": "material/voz/E03_ana.wav", "start": 3, "duration": 4.1, "role": "voz" },
    { "src": "edicion/musica.mp3", "start": 0, "in": 12, "duration": 30, "role": "musica", "fadeOut": 1 },
    { "src": "edicion/sfx/pop.wav", "start": 0.05, "role": "sfx", "volume": 0.6 }
  ],
  "ducking": { "base": 0.8, "underSpeech": 0.12, "rampSeconds": 0.25 }
}
```

Clips:

- `track` (default 1): higher tracks draw on top. Track 1 must cover the whole
  timeline without gaps; B-roll can go on track 1 as a cut or on track 2 over it.
- `speed`: constant playback rate (2 = twice as fast). The clip consumes
  `duration × speed` seconds of source from `in`.
- `zoom`: scale from `from` to `to` over the clip, around `focusX`/`focusY`
  (fractions of the frame). Punch-in: equal `from` and `to` (1.15–1.35) on a cut.
  Slow push: 1.03 → 1.12. Put the focus on the eyes or the product.
- `volume` of the clip's own sound (0 mutes it); `speech: true` when that sound is
  dialogue, so music ducks under it.
- A jump cut is two consecutive entries from the same take, the second with a later
  `in`, skipping the pause or filler between them.
- An L-cut or J-cut: mute the clips (`volume: 0`) and add the take's sound as an
  `audio` item (`src` can be the video file, `role: "voz"`) that starts earlier or
  ends later than the picture cut.
- `kind: "image"` for stills; `fadeIn`/`fadeOut` in seconds, only when a hard cut
  is wrong (default is a hard cut).

Texts: `style` is `gancho` (large, upper area), `clave` (middle), or `cta`
(accent box, lower-middle). `y` overrides the vertical center as a fraction of the
height and must stay between 0.11 and 0.87. Text enters with a short pop; use
`"animation": "none"` to disable it. Use `\n` for deliberate line breaks.

Captions: word list from `transcribir.mjs`. Pages hold up to `maxWords` words, break
after sentence punctuation or pauses over 0.5 s, highlight the word being spoken in
`accentColor`, and hide while an on-screen text is visible (`hideDuringTexts`,
default true) and inside every `[start, end]` interval listed in `hide`. `y` default
0.70. These plain captions are the fallback; set `"plain": false` when a brand effect
draws the captions.

Texts and captions are centered on the frame, with equal side margins that keep them
clear of the platform buttons on the right.

Effects: `effects` lists the brand's effect scripts used in this video, each with
`name`, `start`, `end`, and `params`. The engine has none of its own: see
`references/efectos.md` for how they are written, loaded, and tested.

Audio: `role` is `voz`, `musica`, `sfx`, or `ambiente`. Every `voz` item needs
`duration` (the measured length) so music can duck under it. `musica` follows
`ducking`: `base` gain without speech, `underSpeech` gain during speech, with a ramp
of `rampSeconds` on each side. `volume` is a linear gain; `fadeIn`/`fadeOut` in seconds.

Brand: `fontFile` is a font copied into the video folder (for example from the brand's
`referencias/`); without it, `fontFamily` must be a font installed on the system, or
the text falls back to a generic sans serif. Record which font was used.

Transitions are hard cuts, with optional fades. Whips, match cuts, and covered-lens
transitions are built from the footage itself (cut on the movement), not from effects.

## Validator

`validar.mjs` reports errors (missing or non-ASCII files, source too short for
`in + duration × speed`, gaps on track 1, an effect whose script is missing, text in the platform-control areas, voice
without `duration`, captions out of order) and warnings (shots longer than 4 s on
track 1, more than 10 words per second of on-screen text). Render only with zero
errors; treat each warning as a decision to confirm against the plan.

## Troubleshooting

- A clip shows black: its `in` or `speed` asks for more source than exists; the
  validator reports it.
- Text renders in a default font: the font file failed to load or the family is not
  installed; check `brand.fontFile` and the render log.
- Music does not duck: the voice item lacks `duration`, or the dialogue clip lacks
  `speech: true`.
- Render fails to find a file: `--public-dir` is not the video folder, or the path has
  non-ASCII characters.
