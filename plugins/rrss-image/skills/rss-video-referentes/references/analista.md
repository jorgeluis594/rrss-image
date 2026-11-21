# Example analyst (subagent)

One subagent studies one example video and writes an analysis sheet. This file is
the analyst's brief; the main agent passes it, plus the context package below, to
the subagent.

## How to launch it

Use the host's subagent tool (a general-purpose subagent in Claude Code or Codex),
one per example, all in parallel. The prompt must:

1. Tell the subagent to read this file (absolute path) and act as the analyst it
   describes.
2. Give the context package.
3. Leave out what you expect it to find. Give paths and the user's own words.

## Context package

- Absolute path of the video file.
- Absolute path of the transcription and its kind: `palabras` (JSON with
  `{ "words": [{ "text", "start", "end" }] }` from `transcribir.mjs`), `subtitulos`
  (a subtitle file with phrase timings), `texto` (plain text pasted by the user, no
  timings), or `sin voz`.
- Absolute path of the output folder for this example (already created).
- Absolute path of `scripts/medir-habla.mjs` of this skill.
- What the user said they like in this example and how they say the person sounds,
  in their words. May be empty.

## What the analyst does

The analyst cannot watch or listen. Every statement comes from a frame it extracted
and looked at, the transcription, or a measurement.

### 1. Frames

```bash
# duration and size
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of default=nw=1 <video>

# times of the cuts
ffmpeg -hide_banner -i <video> -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2>&1 | grep -o "pts_time:[0-9.]*"

# the opening: first 3 s, 4 frames per second, one image each
ffmpeg -v error -t 3 -i <video> -vf "fps=4,scale=360:-1" <out>/apertura_%02d.png

# the exact first frame, larger
ffmpeg -v error -i <video> -frames:v 1 -vf scale=540:-1 <out>/cuadro0.png

# one frame just after each cut (t = cut time + 0.15)
ffmpeg -v error -ss <t> -i <video> -frames:v 1 -vf scale=360:-1 <out>/corte_<t>.png

# the whole video, one frame per second, in sheets of 12 read left to right
# (sheet N covers seconds 12·(N−1) to 12·N)
ffmpeg -v error -i <video> -vf "fps=1,scale=270:-1,tile=6x2" <out>/hoja_%02d.png
```

Open every image and look at it. If scene detection finds fewer than one cut every
10 s, lower the threshold to 0.2; if the video is a single take, say so and rely on
the per-second sheets. Changes that are not cuts also count as something changing:
a text that appears, a zoom, an object entering, a new gesture or place.

### 2. Speech

With `palabras`: group the words into sentences with start and end times, and run

```bash
node <medir-habla.mjs> <palabras.json>
```

Do not pass `--audio`: example videos usually have music, so silences are not
pauses. Report pauses as `no medido`. With `subtitulos`, use the phrase timings and
compute words per second per phrase. With `texto`, there are no timings: match
sentences to frames by the on-screen text and their order, and mark every time as
approximate.

### 3. Cross image and voice

Build the timeline: one row per sentence or per cut, whichever is shorter (rows of
about 1–4 s). For each row: what is seen, what is said, the on-screen text exactly
as written, and how image and voice relate, with one of these words:

| Relation | Meaning |
| --- | --- |
| `cara` | Someone talks to camera; the image adds nothing beyond the person |
| `muestra` | The image shows what is being said at that moment |
| `adelanta` | The image shows it before the voice names it |
| `completa` | The image gives information the voice does not say |
| `contrasta` | The image contradicts or mocks what is said |
| `texto` | The on-screen text carries the message; the image is background |

### 4. Read the script behind it

- **Opening (0–3 s).** First frame (who or what, shot size, action in progress,
  text). First sentence, quoted, with its word count. What the on-screen text does
  relative to the voice. The second at which a viewer knows what the video promises.
  What is held back. The kind of opening, in a few plain words (starts with the
  result, names a mistake, a bold statement, opens a question, starts mid-action,
  puts the viewer in a situation, announces a list, or another you describe).
- **Holding attention.** The times at which something changes on screen and the
  typical interval between changes. Open questions: where each is opened and where
  it is closed. Turns («pero», «hasta que», a reveal) and their times. Moments that
  re-hook the viewer in the middle.
- **Structure.** Blocks in order with times and function (`gancho`, `contexto`,
  `giro`, `prueba`, `resultado`, `cta`).
- **How it is spoken.** Who it addresses (tú, ustedes), sentence length, speed,
  whether sentences are complete or clipped, questions to the viewer, slang and
  local words, repeated words, how sentences start. Tone only as the user described
  it; never as something you heard.
- **Closing.** What happens in the last seconds, how the action is asked for, and
  whether the end connects to the beginning.

## Rules

- Read only. Write nothing outside the output folder.
- Every finding cites its evidence: the time in seconds and the frame path or the
  quoted words. No evidence, no finding.
- Quote the example's sentences only as evidence in the sheet; they are working
  material and never reach the brand's documents.
- Describe what the video does, not whether it is good. Do not recommend anything
  for the brand; the main agent and the user decide.
- If something cannot be checked, write `no verificado` or `no medido` and why.

## Output

Write `<out>/ficha.md` in Spanish with this structure:

```markdown
# Ficha: <nombre del archivo>
Duración: <s>. Transcripción: <palabras | subtitulos | texto | sin voz>.
Lo que le gusta al usuario: <sus palabras o «no dijo»>.

## Línea de tiempo
| Tiempo | Se ve | Se dice | Texto en pantalla | Relación |
| --- | --- | --- | --- | --- |

## Apertura
- Primer cuadro: ... (evidencia: <ruta>)
- Primera frase: "..." (<n> palabras, <inicio>–<fin> s)
- Texto en pantalla: "..." — respecto de la voz: ...
- La promesa queda clara en: <s>
- Se guarda para después: ...
- Tipo de apertura: ...

## Cómo sostiene la atención
- Cambios en pantalla: <tiempos>; intervalo típico: <s>
- Preguntas abiertas: <se abre en … / se cierra en …>
- Giros: ...

## Estructura
| Bloque | Tiempo | Función |
| --- | --- | --- |

## Cómo se habla
- Velocidad: <palabras por segundo> · Frases: <mediana y máximo de palabras>
- Pausas: <medidas | no medido>
- A quién le habla, palabras, arranques de frase: ...
- Tono según el usuario: ...

## Cierre
- ...

## No verificado
- <qué y por qué>
```

Reply to the main agent in Spanish with the path of the sheet and at most ten lines:
the opening in one line, the dominant image–voice relation, the interval between
changes, the speed and sentence length, how it closes, and anything not verified.
