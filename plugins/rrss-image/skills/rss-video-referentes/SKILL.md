---
name: rss-video-referentes
description: Learn how a brand's short-video scripts should be written by studying example videos the user likes (how they hook, how image and voice work together, how they hold attention, how they speak) and, optionally, how the user themselves speaks, and save ESTILO-GUION.md, the script guide that $rss-video-guion follows. Use when a brand starts making videos, when scripts come out generic or do not sound like the user, or when the user pastes TikToks or reels as script references or wants their way of speaking analyzed. Not for writing a specific script, defining the editing style, or editing.
---

You study videos the user likes and, if they want, the way they speak, and you write
down what you learn so every later script is built like those videos and sounds like
the person who will say it. The result is `ESTILO-GUION.md`, saved beside `MARCA.md`.
`$rss-video-guion` reads it before writing hooks and lines.

A script exists to make the viewer stop and stay. Two things do that: a hook, and a
voice that sounds like a person talking, not like a text being read. This skill
captures both from real examples instead of generic formulas.

`ESTILO-GUION.md` is self-contained. Whoever reads it needs nothing else: no links,
no names of example videos, no other file.

Read `references/analista.md` before launching the analysis of an example and
`references/habla.md` before asking for or analyzing a speech sample.

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

This skill owns `ESTILO-GUION.md` in the brand folder and writes nothing else there.
It reads `MARCA.md` and never rewrites it. Example videos, the user's recordings,
transcriptions, frames, and analysis sheets are working material: keep them in a
temporary folder, never in brand storage, and never name or link them in the output.

## Language and interaction

Communicate with the user entirely in Spanish and write `ESTILO-GUION.md` in Spanish,
in simple words: the user must be able to read it and correct it. Say «cómo abre el
video», not «hook pattern»; «cada cuánto cambia la imagen», not «pattern interrupt».

- Work in short rounds of one to three related questions. Ask, wait, interpret, continue.
- Offer recommendations with reasons and let the user choose, combine, or reject.
  Invoking this skill authorizes the conversation, not an autonomous choice of style.
- Reuse answers already given.

## What can and cannot be observed

You cannot watch or listen. Everything comes from frames you extract and look at, a
transcription with timings, and measurements.

- **Seen** (frames at every cut and close together in the first seconds), **said**
  (transcription), **on-screen text** (read from frames), and **how image and voice
  relate** (crossing their times): observable.
- **Rhythm of speech** (words per second, sentence length, pauses): measurable.
  Pauses are reliable only on a voice without music.
- **Tone of voice** (energy, irony, warmth, intention) and **music**: not observable.
  Ask the user; never infer tone from the text and present it as heard.

## Tools

- `ffmpeg` and `ffprobe` for frames and measurements. Without them, stop and say so.
- **Transcription.** Use the first that works and tell the user which one was used:
  1. The video engine of `$rss-video-edicion` (`scripts/transcribir.mjs`, local
     Whisper, free, word timings). If the engine is not installed, install it as
     `references/motor.md` of `$rss-video-edicion` describes, telling the user about
     the one-time download first. Transcribe one file at a time, before launching
     any subagent: parallel runs collide installing Whisper.
  2. The video's own subtitles, when the link offers them
     (`yt-dlp --skip-download --write-subs --write-auto-subs`). They give timings
     per phrase, not per word: speed is approximate and pauses are not measured.
  3. Ask the user to paste what is said. Image and voice are then matched by the
     on-screen text and the order of the frames, and rhythm is `no medido`.
- **Getting the video.** Download a link (for example with `yt-dlp`) only when it
  allows it without logging in or evading a block; otherwise ask the user for the
  file or a screen recording with sound.

## 0. Resolve the brand

Resolve the brand and read `MARCA.md` (product, audience, tone, restrictions). If
there is none, tell the user that the identity comes first (`$rss-image-inicio`) and
stop. `MARCA.md` limits this skill: a pattern that needs something `MARCA.md` forbids
(a kind of humor, a claim, a word) is not adopted; say which rule it contradicts.

If `ESTILO-GUION.md` already exists, read it, summarize it in three or four lines,
and follow «Update mode».

## 1. Ask what to study

When `$rss-image-inicio` hands over as part of starting a brand, or the user already
gave videos and comments in this conversation, reuse them and ask only for what is
missing below. The question about the user's way of speaking is always asked here.

In one message:

- Ask for three to five videos they like for **how they are told** (links or files),
  of the kind the brand would make and preferably in the brand's language, and what
  they like in each: «Pega enlaces de TikToks o reels que te enganchen y dime qué te
  gusta de cada uno: cómo empieza, cómo habla la persona, cómo te mantiene mirando».
  One or two are enough to start; say then that the patterns rest on few examples.
- Ask about the voice, which you cannot hear: «¿Cómo suena la persona en cada uno:
  tranquila, acelerada, irónica, como contándole algo a un amigo?».
- Ask the optional part exactly as a choice: «¿Quieres que también analice tu forma
  de hablar, para que los guiones suenen a ti? Te doy tres temas cortos de tu marca,
  grabas un audio de un minuto y medio, y listo. Es opcional.»

Examples and the speech sample are independent: the user may give only one of them.
If the user gives neither, there is nothing to study; say so and stop.

## 2. Get and transcribe the examples

For each example, get the file into the temporary folder and transcribe it (see
«Tools»), sequentially. Use the example's language for the transcription. If an
example has no voice (only music and text), keep it: its hook, text, and structure
still count, and its speech sections are `no aplica`.

## 3. Analyze each example

Launch one subagent per example, all in parallel, as `references/analista.md`
describes. Each writes an analysis sheet (`ficha.md`) in its own folder and replies
with a short summary. Give paths and the user's words about that example, not your
own expectations of what it will find.

When the host has no subagents, do the same analysis yourself, one example at a time.

## 4. Find what repeats

Read every sheet and compare them section by section: how it opens, image and voice,
how it holds attention, structure, how it is spoken, how it closes. For each section
separate:

- **What repeats**: present in most examples. Say in how many.
- **What only one does**: a single example. Keep it only if the user named it as
  something they like.
- **What contradicts**: examples that do opposite things. Ask which the user means;
  do not average.

Show the user the findings in plain words, two to four per round, starting with the
opening, each with the measure behind it («en 4 de 5 la promesa queda clara antes
del segundo 2; la primera frase tiene entre 5 y 8 palabras»). For each, the user
chooses: adopt, adapt, or leave out. Liking a video is not adopting everything it
does.

Take the way of telling, never the content: no sentences, jokes, characters, music,
or branding from an example reach the document. Every pattern is rewritten as a rule
with an example invented for this brand, using only facts from `MARCA.md`.

## 5. The user's way of speaking (optional)

Only if the user said yes in step 1, or asks later. Follow `references/habla.md`:
give three situations built from `MARCA.md`, receive one recording, transcribe and
measure it, and show the user a short portrait of how they speak for them to correct.
One portrait per person who speaks in the brand's videos; each person records their
own sample.

When the examples and the person disagree (the examples speak fast in short
sentences, the person speaks slowly in long ones), do not decide alone. Show both and
ask; the default recommendation is the structure and hook of the examples said in
the person's own words and speed, because a borrowed voice sounds acted.

## 6. Review and save

Present the complete guide in Spanish: how a video of this brand opens, how image
and voice work together, how it holds attention, how it is spoken, how it closes,
and, if analyzed, how each person speaks. Ask whether it describes the videos they
want to make. Save only after explicit approval; if the user asks to save earlier,
mark the file `borrador — estilo de guion en curso`.

After saving, read the file back, check it against `MARCA.md`, delete the temporary
working folder, and report the absolute path, how many examples and which people it
rests on, and anything that stayed `no medido` or `no verificado`. Tell the user
that `$rss-video-guion` will use it from the next script.

## Update mode

Maintenance of an existing `ESTILO-GUION.md`: keep what was approved and change only
what the user approves here.

- **More examples.** Analyze the new ones (steps 2–3) and compare their sheets with
  the document, not with the old examples (they are gone). Show what they confirm,
  what they add, and what they contradict; the user decides each.
- **A person's way of speaking** (new person, or redo one): step 5 for that person
  only.
- **Open entries** in `CAMBIOS-PENDIENTES.md` for `ESTILO-GUION.md`: present each
  with your recommendation; the user chooses apply, discard, or only that piece;
  close each as the shared contract describes.
- **What approved scripts did.** When the user asks to review or bring the guide up
  to date, read `VIDEO.md` and `log.md` of the brand's videos approved after the
  document's last date. List concrete differences that repeat (hooks of a kind the
  guide does not describe, lines the user rewrote the same way more than once) and
  let the user decide each.

Update the `Actualizado` line with the date and what changed, read the file back,
and report what changed and what remains open.

## ESTILO-GUION.md structure

Write rules a scriptwriter can follow without having seen the examples, each with
its measure and one example invented for this brand. Never include links, names of
example videos or their authors, sentences taken from them, or «como en el video
de…». Sentences quoted in «Cómo habla» are the person's own words from their sample.
Omit a section only when nothing was learned for it, and say so in one line.

```markdown
# Estilo de guion: <marca>

Aprobado: <AAAA-MM-DD>. Actualizado: <AAAA-MM-DD — qué cambió, si hubo revisiones>.
Basado en <N> videos de ejemplo<y en la forma de hablar de <persona>>.
Un guion de esta marca existe para que quien mira se detenga y se quede; todo lo
que no ayuda a eso se quita.

## Cómo abre
- **Primer cuadro:** <qué se ve en el instante 0: quién, qué está pasando, qué texto>
- **Primera frase:** <cómo es: largo en palabras, a quién le habla, qué hace (pregunta, acusa, promete, muestra)>
- **Texto en pantalla:** <cuántas palabras, qué dice respecto de la voz: lo mismo, lo completa, lo contradice>
- **La promesa queda clara en:** <segundo>
- **Qué se guarda para después:** <lo que no se revela en la apertura>
- **Aperturas que usa esta marca:** <dos a cuatro maneras, cada una en una línea>
- **Ejemplo para esta marca:** <primer cuadro + frase + texto>

## Imagen y voz
- **Cuando alguien habla a cámara:** <cuánto dura antes de que cambie la imagen>
- **Qué se muestra mientras se habla:** <la imagen muestra lo que se dice, lo adelanta, lo completa o lo contradice; cuál domina>
- **Qué lleva el texto en pantalla:** <...>
- **Ejemplo para esta marca:** <una frase y lo que se ve mientras se dice>

## Cómo sostiene la atención
- **Cada cuánto cambia algo:** <segundos, y qué cambia>
- **Preguntas abiertas:** <cómo se abren y cuándo se cierran>
- **Giros:** <dónde cae el giro y cómo se anuncia>
- **Ejemplo para esta marca:** <...>

## Estructura
- **Duración:** <rango>
- **Bloques:** <función y duración de cada uno, en orden>

## Cómo se habla
- **A quién:** <tú, ustedes, usted>
- **Frases:** <largo típico en palabras; completas o cortadas>
- **Velocidad:** <palabras por segundo>
- **Palabras:** <coloquiales, técnicas, locales; las que sí y las que no>
- **Tono:** <en palabras del usuario>

## Cómo cierra
- <qué pasa en los últimos segundos, cómo se pide la acción, si vuelve al inicio>

## Cómo habla <persona>
- **Velocidad:** <palabras por segundo, medida; es la que usa el guion para calcular tiempos de sus líneas>
- **Frases:** <largo típico; si las deja abiertas, si se corrige>
- **Cómo arranca:** <las entradas que usa>
- **Muletillas y conectores:** <confirmadas por la persona>
- **Sus palabras para el producto, el cliente y el problema:** <...>
- **Pausas:** <dónde las hace>
- **Lo que no dice nunca:** <palabras o maneras que le suenan ajenas>
- **Frases suyas, textuales:** <tres a cinco, de su muestra>

## Nunca
- <lo que los guiones de esta marca no hacen, incluidas las restricciones de MARCA.md que afectan a lo que se dice>
```
