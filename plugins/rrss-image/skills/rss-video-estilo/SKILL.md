---
name: rss-video-estilo
description: Define with the user how a brand's short vertical videos are edited (movement, rhythm, text, decoration) through a conversation based on videos they like, and save ESTILO-VIDEO.md, a self-contained editing guide with dial settings that $rss-video-edicion follows. Use when a brand starts making videos, when the user wants to change how their videos look or feel, or pastes reels or TikToks they like as style references. Not for writing scripts, producing footage, or editing a specific video.
---

You help the owner decide how the brand's videos are edited, and you write that
decision down so every later video looks like the same brand. The result is
`ESTILO-VIDEO.md`, saved beside `MARCA.md`. `$rss-video-edicion` reads it before
editing and stays inside it.

Every editing effect has one purpose: win the viewer's attention or keep it, so they
do not swipe away. The style decides how loudly the brand does that, never whether.

`ESTILO-VIDEO.md` is self-contained. Whoever reads it needs nothing else to
understand the style: no links, no reference videos, no other file. Everything
learned in this conversation is written there in plain words.

Read `references/perillas.md` before proposing dial levels and
`references/biblioteca.md` before choosing effects or writing the file.

## Brand storage (shared contract)

Resolve the persistent brand directory independently of the current chat, working
folder, and plugin installation. Use the user's explicit brand directory when given;
otherwise use the platform's user-data directory:

- macOS: `~/Library/Application Support/rrss-image/marcas/`
- Windows: `%LOCALAPPDATA%\rrss-image\marcas\`
- Linux: `${XDG_DATA_HOME:-~/.local/share}/rrss-image/marcas/`

Expand paths using the actual user's home and environment. Store each brand in a
stable `<brand-id>/` folder containing `MARCA.md` and `referencias/`; reuse that ID
when updating the brand. Never store user brand data inside the plugin installation.

Resolve an explicitly named brand among these folders. If none is named, reuse the
only registered brand, or ask which to use if several exist. Do not select by last
use. A local `MARCA.md` in the current folder is a legacy fallback only when no
explicit brand or directory was requested and no registered brand exists.

Distinguish missing files from access errors; never treat an inaccessible brand as
nonexistent or silently save it elsewhere.

Before any write to brand storage, check that the resolved destination is writable.
If it does not exist, walk upward to the nearest existing directory and request write
permission on that ancestor, explaining that it is needed only to create the intended
subtree. Do not repeatedly request nonexistent child paths. After permission is
granted, create only the intended directories and verify access by creating, reading,
and deleting a uniquely named temporary probe there. An approval response alone is
not proof of writable access. If the probe fails, report the actual path and error
and stop dependent work. Reading existing files does not require a probe.

## Pending brand changes (shared contract)

`MARCA.md` is owned by `$rss-image-inicio`, `ESTILO-VIDEO.md` by
`$rss-video-estilo`, and `ESTILO-GUION.md` by `$rss-video-referentes`; no other skill rewrites them, except the «Referencias aprobadas»
list of `MARCA.md`, which `$rss-image-generar` maintains. Corrections the user makes while
working that may belong in those lasting rules go to `CAMBIOS-PENDIENTES.md`, beside
`MARCA.md`. Any skill may append entries there; only the owner of the affected
document closes them, after the user approves the change in conversation. Never
delete entries. `$rss-memoria`, when available, keeps history and lessons; this file
is the queue of proposed rule changes, and the documents change only through it.

- **On start.** After reading `MARCA.md` (and `ESTILO-VIDEO.md` and `ESTILO-GUION.md` for video), read
  `CAMBIOS-PENDIENTES.md` if it exists. If it has `abierto` entries, tell the user
  once, in one or two lines, how many there are, which document they affect, and
  which skill closes them. Do not apply them and do not treat them as rules: the
  documents rule until their owner records the change. Never repair a document as
  a side effect of another task.
- **While working.** When the user corrects something or asks for something new,
  decide where it belongs:
  - Only this piece (a crop, a word, a take, one timing): handle it in the piece's
    own files.
  - A lasting rule: the user says so («siempre», «en todos», «la marca es así»), the
    same request already appears in another piece's `log.md` or in an open entry, or
    it contradicts, extends, or narrows a line of `MARCA.md`, `ESTILO-VIDEO.md`, or `ESTILO-GUION.md`.
    Apply it to this piece once the user confirms, record that in the piece's
    `log.md`, and append an entry.
  - Unsure: ask once, «¿Esto es solo para esta pieza o para todas las de la marca?»,
    when the answer changes what you record.
- **At final approval** of a piece (a video reaching `terminado`, an image or series
  the user accepts), compare what was approved with `MARCA.md` and, for video,
  `ESTILO-VIDEO.md`: anything they forbid, elements or effects they do not describe,
  measures outside their ranges. Show each difference in plain words and ask which
  should become a brand rule. Append those as entries; record the others in the
  piece's `log.md` as exceptions for that piece, with who decided and their words.
  If there are no differences, say so in one line.
- Before writing `CAMBIOS-PENDIENTES.md`, apply the write checks of the brand
  storage contract. Write entries in Spanish, in this form:

  ```markdown
  ## AAAA-MM-DD — <skill> — <MARCA.md | ESTILO-VIDEO.md | ESTILO-GUION.md> — abierto
  - **Pedido:** <palabras del usuario, textuales>
  - **Dónde:** <pieza o video-id y versión>
  - **Toca:** <sección y línea actual del documento, citada, o «no está descrito»>
  - **Tipo:** contradice | amplía | precisa
  - **Propuesta:** <cómo quedaría la regla, en palabras simples>
  ```

  The owner closes an entry by changing `abierto` in its heading to
  `aplicado AAAA-MM-DD`, `descartado AAAA-MM-DD: <motivo>`, or
  `solo esa pieza AAAA-MM-DD`.

## Files

This skill owns `ESTILO-VIDEO.md` in the brand folder. It writes effect scripts in
the brand's `efectos/` only for the sample in step 4. It reads
`MARCA.md` and never rewrites it. Videos the user shares as references are working
material: keep them in a temporary folder, never in brand storage, and never name or
link them in the output.

## Language and interaction

Communicate with the user entirely in Spanish and write `ESTILO-VIDEO.md` in Spanish,
in simple words: the user must be able to read it and correct it. Describe effects by
what the viewer sees («el texto entra con un rebote»), not by technical names.

- Work in short rounds of one to three related questions. Ask, wait, interpret, continue.
- Offer recommendations with reasons and let the user choose, combine, or reject.
  Invoking this skill authorizes the conversation, not an autonomous choice of style.
- Reuse answers already given. If the user delegates a specific choice, honor that
  scope and label the result as your proposal.

## 0. Resolve the brand

Resolve the brand and read `MARCA.md`. If the brand has none, tell the user that the
identity comes first (`$rss-image-inicio`) and stop.

`MARCA.md` rules apply to video. Colors, typography, tone, logo use, and every
restriction there limit what this skill may allow: if `MARCA.md` says the logo is not
a character, no dial level makes it one. When the user asks for something `MARCA.md`
forbids, say which rule it contradicts and let them decide; changing that rule is a
`$rss-image-inicio` decision, not something this file overrides.

If `ESTILO-VIDEO.md` already exists, read it, summarize it in three or four lines,
and ask what should change. Change only that. If `CAMBIOS-PENDIENTES.md` has open
entries for `ESTILO-VIDEO.md`, or the user asks to review, validate, or bring the style
up to date, follow «Review mode» first.

## 1. Collect the user's taste

When `$rss-image-inicio` hands over as part of starting a brand, or the user already
gave videos and comments in this conversation (for example to `$rss-video-referentes`),
reuse those videos and ask only what they like in how each one looks.

Ask for one to five videos they like (links or files) and what they like in each:
«Pega enlaces de reels o TikToks que te gusten y dime qué te gusta de cada uno: los
subtítulos, el ritmo, cómo muestran el producto, la energía». Ask also for anything
they dislike in videos of their sector.

References are optional. Without them, ask with concrete comparisons instead of
abstract scales, for example «¿letras grandes que saltan palabra por palabra, o
subtítulos tranquilos que acompañan?».

## 2. Study the references

For each reference, get the video file. Download it only when the link allows it
without logging in or evading a block; otherwise ask the user to send the file or a
screen recording. Then observe, with measurements where possible:

- **Rhythm**: cuts per minute and typical shot length (scene detection with
  `ffmpeg`), and how often something else changes on screen.
- **Text**: caption type (phrase, pop, word by word), size, case, highlight, boxes.
- **Movement**: how elements enter and stay, from frames extracted close together
  around each appearance. This is the least reliable observation; say so when unsure.
- **Decoration**: stickers, mascots, transitions, sound effects.

Tell the user two to four observations per video in plain words and ask which they
want for their brand. Liking one detail is not accepting the whole video; when
references contradict each other, ask which aspect of each they mean instead of
averaging.

Take the style, never the content: no wording, music, people, or branding from a
reference. Match what you see to a description in `references/biblioteca.md`. When a
reference uses an effect the library does not describe, write a new description for
it in the same fields, only if it serves attention and fits the dials, and tell the
user it is new and untested.

## 3. Propose the dials

Propose a level from 1 to 3 for each dial in `references/perillas.md` (movimiento,
ritmo, texto, adornos), each with a one-line reason tied to what the user said, the
references, and `MARCA.md` (sector, tone, audience). The dials are independent: quiet
movement with loud text is a valid style.

Then choose the brand's effects from `references/biblioteca.md`: for each function
(hook, following the voice, emphasis, product or app, figure, change of act, closing,
decoration) the descriptions whose level fits the dials, usually one or two per
function and none where the brand does not need it. Describe each to the user by
what the viewer sees and let them keep, drop, or swap. Where a description leaves
something open («May vary») and the user has a preference, fix it; leave the rest
open so the editor can decide.

## 4. Show it

Render a 6–8 s sample with the engine of `$rss-video-edicion`, with the chosen effects
and in the brand's colors and typography, over a clip the brand already has (a take
from one of its videos, or one the user sends). The effects need scripts: write and
test them as `references/efectos.md` of `$rss-video-edicion` describes, saving them in
the brand's `efectos/` with their rows in `efectos/INDICE.md`, so the editor reuses
what the user saw. If the brand has no clip yet, skip the sample, describe the style in words,
and say that it has not been seen on screen. When the user hesitates between two levels, render both.
The sample is a proposal, not a brand video: label it so and keep it out of `exports/`.
Do not use paid generation for samples.

## 5. Adjust

The user corrects in their own words. Map each correction to a dial level or to a
single line: «menos rebote» lowers movimiento; «sin mascota» removes that line while
adornos stays at its level. A specific request from the user overrides the default
lines of the chosen level. Render the sample again after changes the user needs to see.

## 6. Review and save

Present the complete style in Spanish: the four levels with what each allows and
forbids, and how a video opens, shows the product, and closes. Ask whether it
represents how they want their videos to look. Save only after explicit approval; if
the user asks to save earlier, mark the file `borrador — estilo en curso`.

After saving, read the file back, check it against `MARCA.md` once more, and report
its absolute path, the levels, and any effect the user wanted that the engine lacks.

## Review mode

Maintenance of an existing `ESTILO-VIDEO.md`, not a new style: keep what was approved
and change only what the user approves here.

1. **Mechanical checks.** Fix without asking what has a single obvious repair and
   report it in one line; report the rest without guessing:
   - every effect in «Efectos» has all eight fields;
   - every effect named in «Guía por momentos» is described in «Efectos»;
   - every row of `efectos/INDICE.md` names a script that exists in `efectos/`, and
     every script there has a row;
   - every file the document names exists.
2. **Contradictions with `MARCA.md`.** Quote both lines and ask which should win. If
   the brand rule should change, append an entry for `MARCA.md` for
   `$rss-image-inicio`; this skill never edits `MARCA.md`.
3. **What approved videos did.** Read `edicion.md` and `log.md` of the brand's videos
   that reached `terminado` after the document's last date (`Aprobado` or
   `Actualizado`). List concrete differences from the document that repeat or that
   the user called lasting: an effect it does not describe, a measure always outside
   its range, something its «No puede» forbids. The number of videos is not evidence
   by itself; only a concrete difference is. Skip what the logs record as an
   exception for one piece.
4. **Decide.** Present the open entries for `ESTILO-VIDEO.md` and the differences from
   step 3 in small groups, in plain words, each with your recommendation. For each,
   the user chooses: apply, discard, or only that piece. Write the applied ones in
   the document's structure (the dial text, or every field of the effect), render a
   sample as in step 4 when the change is visual and the user wants to see it, and
   close each entry as the shared contract describes.
5. **Save.** Update the `Actualizado` line under the title with the date and what
   changed, read the file back, check it against `MARCA.md`, and report its absolute
   path, what changed, and what remains open.

## ESTILO-VIDEO.md structure

For each dial, start from the text of the chosen level in `references/perillas.md`
and rewrite it for this brand: its colors, its words, the user's specific requests,
and one example taken from the brand's own kind of video. For each chosen effect,
copy its description from `references/biblioteca.md` in Spanish with every field,
adapted the same way; the editor writes the effect's script from that text alone, so
do not shorten it. Never include links, names of reference videos, or «como en el
video de…». The file runs long (200–300 lines) because it must be complete.

```markdown
# Estilo de video: <marca>

Aprobado: <AAAA-MM-DD>. Actualizado: <AAAA-MM-DD — qué cambió, si hubo revisiones>.
Los efectos existen para atraer la atención y evitar que
quien mira deslice; todo lo que no ayuda a eso se quita.

## Perillas

### Movimiento: <N> de 3 (<nombre del nivel>)
**Qué controla.** <qué es y cómo ayuda a retener la atención>
**Cómo debe sentirse.** <sensación en esta marca>
**Cómo se aplica.**
- <efecto concreto, cuándo, con qué medida>
**Puede.** <lo permitido>
**No puede.** <lo prohibido>
**Ejemplo.** <un momento bien resuelto en un video de esta marca>

### Ritmo: <N> de 3 (<nombre>)
### Texto: <N> de 3 (<nombre>)
### Adornos: <N> de 3 (<nombre>)

## Efectos

### <nombre del efecto>
- **Función:** <cómo gana o mantiene la atención>
- **Perilla y nivel:** <a qué perilla responde>
- **Qué ve el espectador:** <descripción de principio a fin>
- **Medidas:** <duraciones, tamaños, cantidades>
- **Qué puede variar:** <lo que el editor decide al escribir el script>
- **Qué no cambia nunca:** <lo fijo>
- **Recibe:** <lo que cambia de un video a otro>
- **Cómo se comprueba:** <qué cuadros mirar y qué deben mostrar>

## Guía por momentos
- **Apertura (0–3 s):** <cómo empieza y con qué efectos>
- **Cuerpo:** <cómo se sostiene la atención>
- **Producto o app:** <cómo se muestra>
- **Dato o precio:** <cómo se destaca>
- **Cierre:** <cómo termina>

## Nunca
- <lo que esta marca no hace, incluidas las restricciones de MARCA.md que afectan al video>
```
