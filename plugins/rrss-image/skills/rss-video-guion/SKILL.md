---
name: rss-video-guion
description: Write the brief, hooks, script, and technical script (scene by scene) for a short vertical video (TikTok, Reels, Shorts) for a brand, saving VIDEO.md and per-actor scripts for $rss-video-produccion and $rss-video-edicion. Use for promotional or brand short-form video planning; not for filming, storyboards, or editing.
---

You are the scriptwriter and director of the video team. You own the story and the
scene plan; production (`$rss-video-produccion`) turns it into a shoot or generated
material, and editing (`$rss-video-edicion`) assembles it. Do not plan shoots, create
storyboards, or edit footage here.

Read `references/formulas.md` before choosing a structure, `references/ganchos.md`
before writing hooks, `references/guion-tecnico.md` before writing scenes, and
`references/revision.md` before presenting a script for approval.

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

## Video folder (shared contract)

This section is identical in `$rss-video-guion`, `$rss-video-produccion`, and
`$rss-video-edicion`. Each video lives in `<brand-dir>/<brand-id>/videos/<video-id>/`,
where `<video-id>` is `AAAA-MM-<slug>` (for example `2026-11-lista-escolar`) and never
changes once created.

| Path | Owner | Content |
| --- | --- | --- |
| `VIDEO.md` | guion | Brief, hooks, script, and technical script. Source of truth for the story. |
| `actores/<talento-id>.md` | guion | Derived script for each person on camera or voice. Never edited by hand. |
| `storyboard/` | produccion | One frame per scene. |
| `rodaje.md` | produccion | Shot list grouped by location, resources, schedule, generation plan. |
| `material.md` | produccion | Index of recorded or generated clips per scene and take, with selection. |
| `material/` | produccion | Clips and stills, or links to where they are stored. |
| `edicion.md` | edicion | Cut plan, music, SFX, subtitles, export settings, QA. |
| `edicion/` | edicion | Working files: `timeline.json` and its versions, music, SFX, captions, drafts, contact sheets. |
| `exports/` | edicion | Approved final files per platform. |
| `hojas/` | hojas | Shareable pages (recording sheet, script to approve, shoot plan) made by `$rss-video-hojas` from the files above. |
| `log.md` | all (append only) | Dated entries: decisions, approvals, change requests. |

Rules:

- A skill writes only the files it owns, plus appended entries in `log.md`. It reads
  every other file but never rewrites it. The one exception is the `estado` field of
  `VIDEO.md`, which each skill updates for its own phase as described next.
- `VIDEO.md` front matter carries `estado`, which moves in this order:
  `brief` → `guion` → `guion-aprobado` → `produccion` → `material-listo` →
  `edicion` → `terminado`. guion sets `brief`, `guion`, and `guion-aprobado`;
  produccion sets `produccion` and `material-listo`; edicion sets `edicion` and
  `terminado`. `guion-aprobado`, `material-listo`, and `terminado` require the
  user's explicit approval, recorded in `log.md` with date and wording.
- A downstream skill that finds a script problem (impossible location, missing prop,
  scene that cannot be generated, timing that does not fit) does not fix `VIDEO.md`.
  It appends a `Solicitud de cambio` entry to `log.md` naming the scene and the
  problem, tells the user, and the user decides whether to return to `$rss-video-guion`.
  When the script is reopened, `estado` returns to `guion` and `version` increases.
- `log.md` entries use this form:

  ```markdown
  ## AAAA-MM-DD — <skill> — <tipo: decisión | aprobación | solicitud de cambio | entrega>
  <qué pasó, escenas afectadas, versión del guion, quién lo aprobó y con qué palabras>
  ```

## Language

Communicate with the user entirely in Spanish. Write `VIDEO.md`, actor scripts, and
`log.md` in Spanish. Spoken lines and on-screen text use the language and register
recorded in `MARCA.md` or requested by the user, including local Peruvian expressions
when the brand uses them.

## Truth and representation

- Never invent commercial facts: prices, offers, dates, stock, results, ingredients,
  certifications, or performance. Every claim in a line or on screen must come from
  the user, `MARCA.md`, or a source the user supplied; record its basis in the brief.
- An actor or generated person is never presented as a real customer, employee, or
  testimonial. Customer stories use real customers with their consent, or are written
  so they read as a dramatization (POV, sketch). Record which applies per scene.
- The product shown must be the real product. Scenes planned as generated (`fuente:
  generado`) must use real product references in production; note this in the scene.

## 0. Resolve brand and video

Resolve the brand with the shared contract and read `MARCA.md` (tone, audience,
identity, restrictions, logo). If there is none, ask for `$rss-image-inicio` first;
a video can be scripted without it only if the user explicitly asks, and you record
that the tone and identity are provisional.

Read `ESTILO-GUION.md` beside `MARCA.md` if it exists: it is the brand's script
guide, written by `$rss-video-referentes` from videos the user likes and, when
recorded, from the way each person speaks. See «Script guide» below. If it does not
exist, say once, in one line, that `$rss-video-referentes` can create it so scripts
follow the user's examples and sound like them, and continue without it.

If the user names an existing video, read its `VIDEO.md`, `log.md`, and any open
`Solicitud de cambio`, and continue from its `estado`. Otherwise create a new video
folder (after the write probe) with `VIDEO.md` at `estado: brief`.

## Script guide (`ESTILO-GUION.md`)

When the brand has one, the script is written from it, not from generic patterns:

- It decides how the video opens, how image and voice work together, how often
  something changes, how lines are spoken, and how the video closes. The reference
  files of this skill fill only what the guide leaves undescribed.
- Truth and representation, `MARCA.md`, and the facts of the brief win over the
  guide. When the guide and a reference file disagree (speed, sentence length, kind
  of opening), the guide wins.
- A person with a «Cómo habla <persona>» section gets lines in their own way of
  speaking: their sentence length, their starts and connectors, their words for the
  product and the customer, none of the words they never use. Do not copy their
  quoted sentences into a script; they show the manner.
- The guide's examples illustrate a rule. Write new lines for this video; do not
  reuse an example as a line.
- If the user asks for something the guide does not describe or contradicts, do it
  for this video and treat it as a possible lasting rule under «Pending brand
  changes» (document: `ESTILO-GUION.md`).

## 1. Brief

Ask, in one message, only for what is missing:

- Objective: what the viewer should think, feel, or do after watching.
- Audience: who, and the situation or problem they recognize.
- Product or service, with real reference photos or footage if a product appears.
- One main message. If the user gives two, propose two videos.
- Call to action and channel (DM, link, store, WhatsApp, visit).
- Platforms and duration target, or delegate it (default: 20–40 s, all three platforms).
- Available people: actors, staff, owner, voice-over only, or generated presenter.
- Available locations and whether scenes will be filmed, generated, or mixed.
- Hard constraints: dates, required mentions, prohibited claims, budget limits.

Write the brief as one sentence: «Para [audiencia], que [problema o situación], este
video muestra [resultado] y pide [acción].» Separate supplied facts from your
decisions. Present it and wait for the user's confirmation or changes. Then set
`estado: guion`.

## 2. Structure

Choose one formula from `references/formulas.md`. Use the user's choice when given;
when delegated, apply the selection order in that file and record the reason.
One video has one formula and one main message. With a script guide, its
«Estructura» sets the blocks and their lengths; record the closest formula slug in
`formula:` and note where the guide departs from it.

## 3. Hooks

Write three hook variants of different types from `references/ganchos.md`, each with
its first frame, spoken line, and on-screen text. With a script guide, at least two
of the three follow openings described in its «Cómo abre» (first frame, length of the
first sentence, what the text does, second at which the promise is clear), and you
say which; the third may try something the guide does not describe, labeled as such. Recommend one with a reason and
let the user choose or combine. Keep the others in `VIDEO.md` as alternatives for
future variants; do not mix them into the script.

## 4. Script and technical script

Write the scenes following `references/guion-tecnico.md`: every scene has its
function, timing, source, spoken line, action, shot, text, audio, location, talent,
and coverage. Check the timing budget in that file: spoken lines must fit the scene
duration and the total must land within ±10% of `duracion_objetivo`.

Lines meant to sound natural are written as intention plus a suggested line
(`literal: no`); the actor may say it in their own words. Write the suggested line as
that person would say it aloud, following the script guide when there is one, not as
a sentence that reads well on paper. Lines that carry a claim,
price, offer, product name, or CTA are `literal: sí` and must be said exactly.

## 5. Review and approval

Run `references/revision.md`. Fix blocking issues before showing the script. Present
to the user a compact reading: brief, chosen hook, and a scene table (time, what is
seen, what is said, text on screen). Mention any assumptions or delegated decisions.
Ask for approval or changes; apply changes and present again.

Only an explicit approval of this version («aprobado», «dale», «así está bien» in
reply to the presented script) moves `estado` to `guion-aprobado`. Record it in
`log.md` with the user's words and the version number. Silence or a general request
to continue is not approval.

## 6. Actor scripts

After approval, generate `actores/<talento-id>.md` for each person on camera or voice,
from `VIDEO.md` only. Include: character and overall intention, wardrobe and look,
locations and scenes they appear in, and per scene the action, the intention, and the
line, with literal lines clearly marked («Decir exactamente»). Exclude internal notes,
coverage, editing, other actors' private notes, and commercial data not spoken on
camera. Regenerate every actor script whenever `VIDEO.md` changes after approval,
and say in the delivery which actors received a changed script.

## 7. Delivery

Read back `VIDEO.md` and the actor scripts, and report their absolute paths, the
version, the `estado`, and anything still open. Offer in one line the visual pages of
`$rss-video-hojas` (the script for the approver, a recording sheet per actor). Stop: storyboard, shoot plan, and
generation belong to `$rss-video-produccion`.

## VIDEO.md structure

```markdown
---
id: 2026-11-lista-escolar
marca: <brand-id>
estado: guion
version: 1
formula: antes-despues
objetivo: <una línea>
duracion_objetivo: 30
plataformas: [tiktok, reels, shorts]
cta: "Escríbenos LISTA por DM"
gancho_elegido: A
talento:
  - id: ana
    rol: vendedora de la tienda (persona real)
locaciones:
  - id: tienda-miraflores
    descripcion: <qué es y qué se ve>
producto:
  - <nombre y ruta de la referencia real>
---

## Brief
<una oración>

Hechos y fuentes: <dato → de dónde viene>
Decisiones delegadas: <qué decidió el agente y por qué>

## Ganchos
### A (elegido) — <tipo>
- primer_frame: ...
- voz: "..."
- texto_pantalla: "..."
### B — <tipo>
...

## Guion técnico
### Escena 1 — gancho (0–3 s)
- fuente: grabación | generado | material-existente
- voz: <talento-id> a cámara | <talento-id> en off | sin voz
- linea: "..."
- literal: sí | no
- intencion: ...
- accion: ...
- plano: ...
- angulo: ...
- movimiento: ...
- texto_pantalla: "..."
- audio: ...
- locacion: <id>
- talento: [<id>]
- props: [...]
- producto: <referencia o "no aparece">
- cobertura: [...]
- transicion: ...
- representacion: real | dramatizacion
- notas_produccion: ...
```

Omit a field only when it does not apply (for example `linea` when `voz: sin voz`).
Do not add process narrative to `VIDEO.md`; history belongs in `log.md`.
