# Take selection (subagent)

Production already judged every take on technical quality (focus, exposure, clean
audio, product fidelity) and marked one `mejor`. Selection is a different question:
among the takes that are technically fine, which material makes the best cut of this
scene? The answer may be a different take than `mejor`, or a combination of several.

This file is the brief of the selection subagent; the editor passes it, plus the
context package below, to one subagent per scene.

## How the editor launches it

Use the host's subagent tool (a general-purpose subagent in Claude Code or Codex),
one per scene, all in parallel, on the same model as the session. Each prompt must:

1. Tell the subagent to read this file (absolute path) and act as the selector it
   describes, communicating and writing in Spanish.
2. Give the context package for its scene.

## Context package

- Absolute path of the video folder.
- The scene number `<NN>` and name.
- Constraints already known from neighboring scenes (only when relaunching a scene
  after a continuity clash).

The subagent reads the rest itself: the scene and its neighbors in `VIDEO.md`, the
scene's rows in `material.md` and `rodaje.md`, and `edicion/transcripciones/`.

## Limits

- Write only `edicion/seleccion/E<NN>.md` and images under `edicion/seleccion/`
  named with the scene's takes. Never edit `VIDEO.md`, `material.md`, `edicion.md`,
  `timeline.json`, or `log.md`, and do not render.
- If a transcription you need is missing, report it instead of transcribing (parallel
  runs would collide installing Whisper).
- Never re-cut a real customer's words into a different statement, and never choose
  a framing that hides a product defect.

## Reply to the editor

Short, no images or transcripts: the chosen takes with in/out, the backup, the reason
in one line, continuity constraints for the neighbors, and any problem.

## Candidates

- Consider every take marked `usable` or `mejor` in `material.md` for the scene,
  including coverage (`E<NN>-B`, `E<NN>-C`…) and B-roll.
- Never consider a take marked `descartar`, and never use a segment outside the
  usable in/out recorded for it.
- Choosing a take other than `mejor` is allowed; state the reason.

## Evidence (never by assumption)

For each candidate, gather what you will compare:

```bash
# duration, resolution, fps
ffprobe -v error -show_entries stream=width,height,r_frame_rate:format=duration -of compact <clip>

# contact sheet, four frames per second
ffmpeg -v error -i <clip> -vf "fps=4,scale=160:-1,tile=8x6" -frames:v 1 edicion/seleccion/<toma>_contacto.png

# a single frame at a moment you want to inspect
ffmpeg -v error -ss <t> -i <clip> -frames:v 1 -vf scale=540:-1 edicion/seleccion/<toma>_<t>.png

# silences inside the take (candidate jump cuts)
ffmpeg -hide_banner -i <clip> -af silencedetect=n=-35dB:d=0.25 -f null - 2>&1 | grep silence_
```

Open and look at every contact sheet and frame you extract. For takes with voice,
read the word-level transcription in `edicion/transcripciones/<toma>.json` (made by
the editor before selection) and compare it with the line in `VIDEO.md`.

## Criteria, in order

1. **Story.** The take delivers what the scene must say or show in `VIDEO.md`: the
   complete line (exact when `literal: sí`, same meaning when `literal: no`), the
   product visible when the scene shows it, the action complete.
2. **Delivery.** Energy, clarity, natural intonation, eyes to camera when planned.
   Fewer false starts and fillers. For a hook, how fast the take reaches the premise
   matters more than anything else.
3. **Time.** Useful duration after trimming warm-up, pauses, and fillers, against
   the scene's target time. Prefer the take that fits without forcing.
4. **Cut points.** Clean places to enter and leave: a breath, a finished movement, a
   gesture to cut on action. Note the in/out in seconds of the source file.
5. **Coverage.** Whether B takes or B-roll can cover the jump cuts and keep the
   change interval at 2–4 s without a talking head uncovered for more than 3–4 s.
6. **Continuity.** Wardrobe, product state, hand, eyeline, and screen direction that
   will match the neighboring scenes. Record what the next and previous scene must
   match.

## Combining

A scene may take its voice from one take and its picture from others: voice from
t2, a punch-in from t3, B-roll from E01-B t1 over the middle. Combine only when the
audio of the voice take stays continuous, or the cuts fall on breaths; and when lip
sync is never broken (a face that speaks is always shown with its own audio).

## Result per scene

Write `edicion/seleccion/E<NN>.md`:

```markdown
# Selección: escena <NN> — <nombre>

## Elección
| Uso | Toma | Entrada–salida (s) | Duración | Nota |
| --- | --- | --- | --- | --- |
| voz + imagen | E01-A t3 | 0,40–3,10 | 2,70 s | llega a «10 minutos» en 0,9 s |
| cobertura | E01-B t1 | 1,20–2,00 | 0,80 s | sobre la pausa de 1,6 s |

## Respaldo
- E01-A t2 (0,60–3,40): entrega correcta, 0,6 s más lenta en llegar a la premisa.

## Motivo
<una o dos líneas: por qué esta y no las demás; si difiere de la `mejor` de producción, por qué>

## Continuidad
<qué deben respetar la escena anterior y la siguiente: mano, estado del producto, vestuario, dirección>

## Evidencia
- <archivos de edicion/seleccion/ revisados y mediciones usadas>

## Problemas
<ninguno | qué falta y por qué ninguna toma lo cubre>
```

If no candidate can deliver the scene within its usable in/out, write it under
`Problemas` and do not pick a compromise that changes the story; the editor raises
the change request for production.
