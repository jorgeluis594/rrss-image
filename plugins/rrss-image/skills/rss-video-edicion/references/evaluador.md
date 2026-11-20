# Video evaluator (subagent)

The editor launches a separate subagent to check its work at two checkpoints. The
evaluator has not seen the editor's reasoning and does not trust it: it pulls its own
evidence from the files and judges only what it sees and measures. This file is the
evaluator's brief; the editor passes it, plus the context package below, to the
subagent.

## How the editor launches it

Use the host's subagent tool (a general-purpose subagent in Claude Code or Codex).
The prompt must:

1. Tell the subagent to read this file (absolute path) and act as the evaluator it
   describes.
2. Give the checkpoint (`tomas` or `borrador`) and the context package.
3. Leave out the editor's reasons, opinions, or expected verdict. Give paths and
   data, not conclusions, so the review is not anchored on the editor's view.

One subagent per checkpoint covers every scene and returns a verdict per scene. On a
re-evaluation, send only the scenes that failed, with the new paths.

## Context package

Always:

- Absolute path of the video folder and of the evaluation output folder:
  `edicion/evaluacion/tomas-r<R>/` or `edicion/evaluacion/borrador-v<N>-r<R>/`
  (`R` = evaluation round).
- Absolute path of the engine folder (for `scripts/transcribir.mjs`).
- Per scene, copied from `VIDEO.md`: scene number and name, the spoken line and its
  `literal` value, `texto_pantalla` exactly as written, and whether it is the hook
  (scene 1) or holds the CTA.

Checkpoint `tomas` (after the edit plan selects takes, before `timeline.json`):

- Per selected take: shot and take ID, absolute path, the in/out points chosen in
  the plan, and from `material.md` its `fuente` (`grabado`, `generado`, `existente`)
  and its recorded usable in/out points.

Checkpoint `borrador` (after each draft render, before showing it to the user):

- Absolute path of `edicion/borrador-v<N>.mp4`.
- Per scene: its start–end on the output timeline, the cut times inside it, and the
  `clips`, `texts`, and `captions` entries of `timeline.json` that fall in that range.

## What the evaluator checks

The evaluator cannot watch or listen. Every check becomes a frame it extracts and
looks at, an automatic detection, or a transcription it compares. It checks only
three things; story, product fidelity, rhythm, and audio levels belong to the
editor's own checklist in `exportacion.md`.

### 1. Strange frames (blocking)

- Stray or flash frames at cuts, black or frozen sections, sudden jumps.
- In `generado` clips: deformations (hands, faces, product label that changes or
  warps, objects that appear, disappear, or melt).

How:

```bash
# frames around each cut: 2 before and 2 after (t = cut time, f = 1/30 s)
ffmpeg -v error -ss <t-2f> -i <file> -frames:v 4 -vf scale=540:-1 <out>/corte_<t>_%d.png

# black or frozen sections in the range
ffmpeg -hide_banner -ss <inicio> -t <dur> -i <file> -vf "blackdetect=d=0.1,freezedetect=d=0.5" -an -f null -

# generated clips: one frame every 0.5 s across the used range, as a sheet
ffmpeg -v error -ss <in> -t <dur> -i <file> -vf "fps=2,scale=270:-1,tile=4x4" -frames:v 1 <out>/hoja_<toma>.png
```

Open every image and look at it. A freeze is acceptable only when the timeline
intends a still (`kind: "image"`).

### 2. Strange starts (blocking)

- A take or scene that starts mid-action: eyes closed, half gesture, a person entering
  the frame, camera still settling, a junk first frame.
- A start or end that cuts a word in half.
- Scene 1 only: frame 0 shows movement or a face plus the hook text; no logo, intro,
  or fade from black.

How: extract and look at the first 4 frames and the last frame of each take (at its
chosen in/out) or each scene (at its start/end on the draft). For cut words,
transcribe the take or the scene and compare the word timings with the in/out points:
a word whose `start` is before the in point or whose `end` is after the out point is
cut.

```bash
ffmpeg -v error -ss <in> -i <file> -frames:v 4 -vf scale=540:-1 <out>/inicio_<id>_%d.png
node <motor>/scripts/transcribir.mjs <file> <out>/palabras_<id>.json
```

### 3. Text that cannot be understood

On-screen text (blocking, checkpoint `borrador`):

- Exactly as in `VIDEO.md`, letter by letter, including accents, numbers, and prices.
- Readable: enough contrast with the footage behind it, large enough, not covered or
  clipped, line breaks that do not split a phrase badly.
- Outside the unsafe areas.
- On screen long enough: at most 5–10 words per second of display; the CTA at least
  1.5 s.

How: extract a frame in the middle of each text's display and one with the unsafe
areas drawn, then read them.

```bash
ffmpeg -v error -ss <t> -i borrador.mp4 -frames:v 1 -vf scale=540:-1 <out>/texto_<t>.png
ffmpeg -v error -ss <t> -i borrador.mp4 -frames:v 1 \
  -vf "drawbox=x=0:y=ih-250:w=iw:h=250:color=red@0.35:t=fill,drawbox=x=0:y=0:w=iw:h=200:color=red@0.35:t=fill,drawbox=x=iw-150:y=0:w=150:h=ih:color=red@0.35:t=fill,scale=540:-1" \
  <out>/zona_<t>.png
```

Subtitles and speech (warning only, never blocking):

- Transcribe the scene and compare it with the subtitle words and with the line in
  `VIDEO.md` (word for word when `literal: sí`, same meaning when `literal: no`).
- Flag subtitles visibly out of sync with the transcription (more than about 0.3 s),
  missing or extra words, a `literal: sí` line that was said differently, or a
  transcription so garbled that the speech may be unclear.
- Look at one frame per subtitle page to check it is readable and not covering a face
  or the product.

Transcription is a hint, not proof: the user confirms by listening. If transcription
is unavailable (whisper not installed), report the subtitle checks as `no verificado`
instead of installing it.

## Rules

- Read only. Write nothing outside the evaluation output folder; never edit
  `timeline.json`, `edicion.md`, `material.md`, `VIDEO.md`, or `log.md`.
- Every finding cites evidence: the time in seconds and the path of the frame or
  output that shows it. No evidence, no finding.
- Judge only the three areas above. Do not comment on story, taste, music, or rhythm.
- If something cannot be checked, say `no verificado` and why; never assume it passed.

## Response format

Reply in Spanish, with this structure and nothing else:

```markdown
# Evaluación: <tomas | borrador-v<N>> · ronda <R>

## Escena <n> — <nombre>: aprobado | rechazado
- [bloqueante | aviso] <qué está mal> · <segundo o fotograma> · evidencia: <ruta>
  arreglo: <concreto: otra toma, mover la entrada a 1,20 s, subir el texto a y=0.40, ...>

## No verificado
- <qué y por qué>
```

A scene is `rechazado` if it has at least one `bloqueante`. Scenes with only `aviso`
items are `aprobado`.
