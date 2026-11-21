---
name: rss-image-inicio
description: Co-design brand identity with the user through an interactive discovery and visual-choice conversation, then create or update MARCA.md for $rss-image-generar. Use when starting a brand, refining its visual identity, or updating brand assets. After saving, offers the video setup ($rss-video-referentes and $rss-video-estilo) to brands that will make videos. Do not complete identity discovery as a one-shot asset summary.
---

Help the owner discover and choose a design identity through conversation. `MARCA.md`
is the record of shared decisions, not a substitute for that conversation. Inspecting
a profile, reading assets, or collecting facts does not establish the desired identity.
Create or update the file in the brand directory resolved by the shared contract below.
Campaign-specific decisions belong in `direction.md`, later created by `$rss-image-generar`.

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
explicit brand or directory was requested and no registered brand exists. Reuse it
without restarting discovery; migrate it with its relative assets only when requested.

Distinguish missing files from access errors; never treat an inaccessible brand as
nonexistent or silently save it elsewhere.

Before discovery that will save a brand, or any later write to brand storage, check
that the resolved destination is writable. If it does not exist, walk upward to the
nearest existing directory. When creation requires additional access, request write
permission on that existing ancestor, explaining that it is needed only to create
the intended brand-storage subtree. Do not repeatedly request nonexistent child
paths: on Linux, an approved path that does not exist may still fail with a read-only
filesystem error. Reuse applicable permissions already granted in the session.

After permission is granted, create only the intended storage directories and verify
access by creating, reading, and deleting a uniquely named temporary probe there.
An approval response alone is not proof of writable access. Never overwrite an
existing file for this test or create MARCA.md before identity approval. If the
probe still fails, report the actual path and error and stop dependent work; do not
change global configuration or ask the user to run a repair script. Reading an
existing brand does not require a write probe. Recheck access in a new session when
writing; session permission does not imply permanent or cross-chat authorization.
After saving, read back `MARCA.md`, check its local asset references, and report its
absolute path. Campaign outputs remain in the requested output folder; this contract
changes only persistent brand storage.

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

## Language and interaction

Communicate with the user entirely in Spanish, including questions, answer choices,
recommendations, progress updates, and the final response. Write `MARCA.md` in Spanish.
Use accessible descriptions and concrete comparisons rather than requiring knowledge
of fonts, hex codes, or lenses.

- Work in short rounds with one to three related questions. Ask, wait for the user's
  answer, interpret it, and then continue. Do not present all rounds in one questionnaire.
- Use the available question tool for text choices when appropriate; otherwise ask in
  the conversational response. Request files in conversation, not in a text-only tool.
- While waiting, inspect already supplied assets if useful, but do not choose an
  identity, write the final document, or advance dependent rounds without an answer.
  Silence and elapsed time are never a design choice.
- Offer recommendations with reasons and let the user select, combine, or reject them.
  “Start”, “use this profile”, “improve my brand”, and invoking this skill authorize
  discovery, not autonomous choice of the identity. Inspecting a reference does not
  mean adopting its style. Delegating a specific choice does not delegate all choices.
- Reuse explicit answers already given. Do not repeat questions or approvals when the
  conversation has already resolved them. If the user explicitly requests a one-shot
  draft or delegates decisions, honor that scope and label proposals accordingly.

## 1. Orient and understand the desired change

Read existing `MARCA.md` and available assets. If `CAMBIOS-PENDIENTES.md` has open
entries for `MARCA.md`, or the user asks to review, validate, or update the brand from
what they have been doing, follow «Review mode» instead of rediscovery. Otherwise,
briefly say what is known and what is still a hypothesis; do not turn this into a
final report. A document saying “interview
pending” is unfinished discovery, even if it contains many observations.

Start with the most consequential open questions, for example:

- «¿Para quién debería sentirse hecha esta marca y qué debería valorar ese público?»
- «¿Qué debería sentir alguien al ver un anuncio: celebración, confianza, juego,
  cuidado, exclusividad u otra cosa? ¿Qué importa más y por qué?»
- «¿Qué debería mantenerse de la marca actual y qué se siente incorrecto o genérico?»

Confirm missing business facts only as needed: products, sales channels, service area,
formats, and language. Separate facts from preferences. Never invent commercial facts.
Do not skip identity discovery merely because these facts are visible on a profile.
Ask whether the user has a brand logo: «¿Tienes un logo de la marca? Puedes adjuntar
o pegar la imagen, darme la ruta del archivo o compartir una URL para que lo guarde
y lo use en las imágenes». If not, continue the identity conversation without
requiring one. Do not ask again if a usable logo was already supplied.

## 2. Explore evidence together

Open supplied assets. Respect exclusions, including posts the user says are AI-generated
or not representative. Explain two or three relevant observations and ask what the
user wants to keep or change. Useful prompts: «¿Cuál de estas referencias se parece
más a tu marca y qué detalle marca la diferencia?» or «¿Te gusta su color, su ambiente
o la claridad con que muestra el producto?» Do not treat liking one detail as accepting all.

When the user supplies a logo by attachment, pasted image, local path, or URL, save
the image content as a local file in `referencias/` beside `MARCA.md`.
For an attachment or pasted image, save its image data; for a path, copy the file; for
a direct image URL, download the image. If the URL points to a webpage, find its logo
image and download that; ask which one to use if the page has ambiguous variants.
Keep the supplied image format and content when possible. Never substitute a written
description, remote link, or browser screenshot for an available image file. Reuse an
identical existing copy and never overwrite a different
file. Confirm the primary variant if several are supplied and ask about known usage
restrictions. Verify that the saved image opens. If its content cannot be accessed or
saved, request another attachment, path, or URL; do not claim the logo was preserved.
When writing `MARCA.md`, add a local Markdown image reference under
`Assets y referencias`, for example `![Logo principal](referencias/logo.png)`, pointing
to the saved file. Verify that this relative reference resolves. This local copy is
the asset `$rss-image-generar` must use; a source URL or original external path alone
is insufficient.

Distinguish:

- Approved identity: explicit user choices or an adopted brand manual, with source.
- Observed precedents: recurring light, surfaces, crop, palette, or type in older work.
  Repetition is evidence of a habit, not approval of a future rule.
- Proposals: possible choices to test in conversation, not measured brand facts.

Record documented hex values or sampled logo colors with source. Label photo samples
as approximate and unknown fonts as unknown. Describe visible depth of field without
claiming to measure the lens. A missing manual or exact font does not block discussion:
offer understandable alternatives and refine implementation details after selection.
Do not impose one product's colors, 60-30-10, minimalism, or an off-center composition
as the brand's identity. Ask about known asset rights only when relevant to intended use.

## 3. Co-design the visual identity

After hearing the user's priorities, propose two or three genuinely different routes
rooted in their answers and available evidence. Use concrete descriptions or available
visual references so the user can judge them. Do not generate assets just to decorate
the interview; if mockups are useful, use the appropriate image workflow and label
them as proposals rather than actual products or approved identity.

For each route explain:

- The personality and audience response it aims for, and why it fits the business.
- Palette roles, typographic character, photographic approach, and layout density.
- How it would look in one relevant ad, what it avoids, and its main tradeoff.

For example, “celebración juguetona” and “pastelería artesanal cercana” should differ
in meaningful design decisions, not merely in color names. Recommend a route, then
ask the user to choose, combine, or reject. Wait for that choice before refining it.

Refine the chosen route in small rounds: what feels right, what feels wrong, and what
needs adjustment. Translate preferences into concrete design decisions. Separate:

- Lasting identity: approved logo use, palette roles, type system, tone, recognizable
  visual elements, and any photographic rules the user actually wants fixed.
- Campaign freedom: lighting, surfaces, props, crops, layouts, and seasonal variations
  that may change while preserving identity.

If the user rejects the routes, revisit their reasons rather than choosing for them.
Do not lock a new visual decision solely because it seems professional or avoids slop.

## 4. Review the concrete agreement before saving

Present a compact identity proposal in Spanish: the intended personality, selected
palette and type direction, photo/layout principles, elements to preserve or avoid,
and what remains flexible. Identify unresolved implementation details honestly.
Ask whether this specific proposal represents the brand and what should change.
Wait for acceptance or incorporate revisions. Do not ask again if the user has already
explicitly accepted this exact set of decisions in the conversation.

Do not save an initial/final `MARCA.md` merely to finish the turn while core identity
choices are unanswered. If the user asks to save progress, save it clearly as
`borrador — descubrimiento en curso`, containing only the useful decisions reached.
Keep interview questions and alternative proposals in the conversation. A draft is not
completion and must not promote proposals into approved identity.

## 5. Save a focused brand brief

`MARCA.md` is a compact design brief for future ads, not an interview transcript,
research report, approval ledger, or agent activity log. Include an item only if it
helps a future designer make a concrete brand-specific decision. Aim for one readable
page (roughly 40–70 lines); omit empty sections rather than filling them with pending
items. Useful accepted detail matters more than meeting a line count.

Use only the relevant sections from this structure:

```markdown
# MARCA: <negocio>
## Negocio y público
## Personalidad y tono
## Identidad aprobada
## Dirección visual
## Assets y referencias
## Formatos y canales
## Restricciones de marca
```

- Negocio y público: what the business sells, to whom, and the relevant differentiator.
  Include location only if it changes the message or sales scope.
- Personalidad y tono: agreed personality, register, and useful copy examples or words
  to avoid. Translate abstract adjectives into usable choices.
- Identidad aprobada: accepted logo, palette roles/hex when known, typography, and
  other binding elements. An accepted type direction can appear without a chosen font;
  mention that gap once only if necessary to prevent inventing an approved typeface.
- Dirección visual: agreed photography, composition, and graphic principles, plus
  what can vary by campaign. Include meaningful brand-specific aesthetic exclusions.
- Assets y referencias: usable paths/links with a short role, such as “logo principal”
  or “referencia de composición”. Prefer selected assets over a broad profile requiring
  a repeated investigation. Include the saved primary logo as a local Markdown image
  reference; limit other approved image references to three.
- Formatos y canales: actual agreed destinations and formats needed for design.
- Restricciones de marca: only specific, durable constraints that affect future ads,
  such as a prohibited claim or a known usage restriction on an asset.

Do not include:

- The history of what the user said, corrected, authorized, or asked the agent to analyze.
- Instructions for this research session, discarded sources, or explanations of how
  the agent inspected a profile. For example, “no uses las publicaciones de ropa hechas
  con IA para este análisis” guides source selection; it is not a brand-design rule.
  Apply it during the analysis and omit it from MARCA.md. Do not reinterpret it as
  “the brand must never use AI imagery”. If the user actually establishes a lasting
  asset-use restriction, record only that concise operative rule.
- Observations that never became accepted design choices, rejected routes, interview
  questions, exhaustive pending lists, or commentary about missing evidence.
- Repeated `aprobado`, `inferido`, source, or consent labels on every line. Establish
  acceptance in the conversation; use links in Assets when they help locate a resource.
- Generic agent rules already covered by the skills: do not invent prices, check safe
  zones, obtain approvals, avoid misleading claims, or keep campaign logs. Retain only
  brand-specific information, not boilerplate.
- Current campaign prices, promotions, or dates; these belong in that campaign's brief.

Before saving, review each line: “What future design decision does this change?” Delete
anything without a clear answer. Merge repetition, remove process narrative, and omit
unsupported facts. Never turn an inference into approved identity to fill a section.
Keep unresolved questions and approval context in the conversation, not a new companion
file unless the user requests one. Report remaining actionable gaps in the response.

When updating an older MARCA.md, preserve actual accepted choices and useful asset
paths while pruning process clutter. Read legacy sections (“Negocio”, “Cliente y tono”,
“Locks visuales”, “Precedentes fotográficos”, etc.) by meaning; the document need not
retain an empty schema. An `aprobado` label is not evidence when the user disputes it.
Do not invent prior consent. New brand choices still require the interaction above.

Report what was agreed and saved briefly, then continue with step 6. Image
production belongs to `$rss-image-generar`. If resuming later, use the conversation's
open questions and the brief's accepted choices instead of restarting the interview.

## 6. Video setup

Starting a brand includes preparing it for video when the brand will make videos.
Run this step once `MARCA.md` is saved with the identity accepted, never on a
`borrador`. Two documents beside `MARCA.md` complete the setup, each owned by another
skill:

- `ESTILO-GUION.md`, by `$rss-video-referentes`: how the brand's scripts are told and
  how the person speaks, learned from videos the user likes.
- `ESTILO-VIDEO.md`, by `$rss-video-estilo`: how the videos are edited (movement,
  rhythm, text, effects).

1. **Ask whether the brand will make videos**, unless «Formatos y canales» of
   `MARCA.md` already answers it: «¿Vas a hacer videos cortos (TikTok, Reels, Shorts)
   con esta marca?». Record the answer in «Formatos y canales» as a design fact. If
   the answer is no, stop here and do not ask again in later runs.
2. **Offer what is missing.** Check which of the two documents exist. Offer only the
   missing ones, in plain words, as a choice the user can take whole, in part, or
   later: «Para que tus videos salgan bien desde el primero puedo dejar listas dos
   cosas: cómo se cuentan (ganchos, guion y, si quieres, tu forma de hablar) y cómo
   se editan (ritmo, textos, efectos). ¿Preparamos las dos ahora, solo una, o lo
   dejamos para después?». If both exist, say so in one line and stop.
3. **Ask for the example videos once.** Both skills start from videos the user
   likes. When the user chose both, ask a single time for three to five links or
   files and what they like in each, both in how it is told and in how it looks, and
   use the same videos and comments in both skills.
4. **Run the chosen skills in this conversation**, script guide first and editing
   style second: invoke `$rss-video-referentes`, follow it until its document is
   approved and saved or the user stops, then invoke `$rss-video-estilo` the same
   way. Pass on what is already known (brand, the videos, the user's comments) so
   neither repeats a question. Each skill keeps its own rounds and its own approval;
   this skill does not shorten them, does not write their documents, and does not
   treat the acceptance of `MARCA.md` as approval of anything in them.
5. **Close.** Report which documents exist now, with their absolute paths, and what
   was left for later with the skill that does it. If a skill is not available in
   this installation, say which one and continue with the other.

When this skill runs to update an existing brand, run this step only if the brand
makes videos, or has not answered the question, and one of the two documents is
missing; otherwise skip it silently.

## Review mode

Maintenance of an existing `MARCA.md`, not a new discovery: keep the accepted
identity and change only what the user approves here.

1. **Mechanical checks.** Every local reference in `MARCA.md` resolves to a file in
   `referencias/`. Report a missing file; never invent a replacement.
2. **Contradictions with `ESTILO-VIDEO.md`.** If the brand has one, quote both lines
   and ask which should win. If the style should change, append an entry for
   `ESTILO-VIDEO.md` for `$rss-video-estilo`; this skill never edits that file.
3. **Decide.** Present the open entries for `MARCA.md` in small groups, in plain
   words, each with your recommendation and the line it would change. For each, the
   user chooses: apply, discard, or only that piece. Write the applied ones as rules
   under the rules of step 5 (compact, no process history), and close each entry as
   the shared contract describes.
4. **Save.** Read `MARCA.md` back, check its local references, and report its
   absolute path, what changed, and what remains open.
