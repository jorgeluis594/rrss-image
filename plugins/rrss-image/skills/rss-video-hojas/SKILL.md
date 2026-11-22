---
name: rss-video-hojas
description: Turn a short video's working files (VIDEO.md, actores/, rodaje.md, storyboard/, material/) into visual pages for people who do not read Markdown — a recording sheet for each person on camera, a script page for the owner or client to approve, and a shoot plan — published as an Artifact when the host has one, otherwise as a single self-contained HTML file. Use when the user asks for a page, sheet, «hoja», export, or something visual to share or send about a video; when $rss-video-guion or $rss-video-produccion offer it at delivery. Not for writing or changing scripts, plans, or footage.
---

You make the pages a video team shares with people who are not technical: the
person who records, the owner or client who approves, the people at the shoot.
The Markdown files stay the source of truth; a page is a copy made for reading,
and it is rebuilt whenever its source changes. You never change the story, the
plan, or the material here.

Read the reference for the page you are making before writing it:
`references/hoja-grabacion.md`, `references/guion-aprobar.md`, or
`references/plan-rodaje.md`. Read `references/formato.md` before writing any page
spec.

## Brand and video

Resolve the brand and the video exactly as the shared contracts in
`$rss-video-guion` describe (brand storage and video folder); do not repeat that
logic here differently. Read `MARCA.md` for colors, fonts, and tone, then the
video's files. If `CAMBIOS-PENDIENTES.md` has `abierto` entries, do not mention
them: this skill makes no brand decisions.

This skill owns one path in the video folder:

| Path | Owner | Content |
| --- | --- | --- |
| `hojas/` | hojas | Page specs (`*.json`), built pages (`*.html`), and `enlaces.md` with each page's published link. |

It reads every other file and never rewrites them, not even `estado`. It appends a
`log.md` entry of type `entrega` when a page is published or updated.

## Which page

| Page | For | Needs at least | File |
| --- | --- | --- | --- |
| Hoja de grabación | Each person on camera or voice | `actores/<talento-id>.md` | `hojas/grabacion-<talento-id>` |
| Guion para aprobar | The owner, the client, whoever says yes | `VIDEO.md` at `estado: guion` or later | `hojas/guion` |
| Plan de rodaje | Everyone at the shoot | `rodaje.md` | `hojas/rodaje` |

If the user does not say which, offer the ones the video's `estado` allows, in
one line. If a needed file is missing, say which skill makes it and stop.

Pages get richer as the video advances: a recording sheet made at
`guion-aprobado` has silhouettes for the frames; after production it shows the
storyboard and the real clips. Use what exists; never invent a frame, a time, or a
step that is not in the source files.

## Writing the content

- Speak to the reader in their own terms: «tú» for the person recording, plain
  words for the client. No shot IDs, no jargon («setup», «cobertura», «plano
  medio-corto», «literal»): say what to do, where the phone goes, what to say, how
  many times. Mark what is obligatorio, recomendado, or opcional.
- Copy spoken lines exactly from the source. Lines marked exact in `VIDEO.md`
  (`literal: sí`) are labeled «Decir exactamente»; the others «Con tus palabras».
- Leave out everything the reader does not need: prompts, model names, internal
  notes, coverage lists, the technical table of `rodaje.md`, other people's private
  notes, and costs.
- Truth rules of the video skills apply: no commercial fact that is not in the
  source files.

## Building

1. Write the spec to `hojas/<page>.json` following `references/formato.md`, after
   the write checks of the brand storage contract. Paths to images and clips are
   relative to that JSON (for example `../material/E03-C_esquema.mp4`).
2. Build it with the bundled script, which needs `node` and `ffmpeg`:

   ```text
   node <skill-dir>/scripts/construir.mjs <video-dir>/hojas/<page>.json
   ```

   It shrinks the images and clips, embeds them, and writes `hojas/<page>.html`.
   It prints JSON; continue only when `"ok":true`. If the page is too heavy, use
   shorter or fewer clips (`segundos`) and build again.
3. Look at the result before delivering when the host can render HTML (a
   headless browser screenshot at phone width and at desktop width, or the host's
   own viewer). Check that nothing is cut, that the text is readable in light and
   dark, and that frames are in scene order.

## Delivering

- **Host with Artifacts (Claude):** publish `hojas/<page>.html` as an Artifact. If
  the tool only accepts files in its working or scratch folder, copy the HTML
  there first and publish the copy. When `hojas/enlaces.md` already has a link for
  this page, update that same Artifact (pass its URL) so the link people have
  keeps working. Record the link in `enlaces.md` (`<page>: <url> · <date> · from
  <source file> v<N>`). Tell the user the page starts private and that to send it
  they use the page's Share menu.
- **Host without Artifacts (Codex and others):** the HTML file is the page. Give
  its absolute path and say it opens in any browser and can be sent as a file.
- Append to `log.md`: `## AAAA-MM-DD — hojas — entrega` with the page, its link or
  path, and the version of the source files it was made from.

## Keeping pages current

A page shows, in its footer, the source file and version it was made from. When
the user asks for a page and one already exists, compare that with the current
`version` of `VIDEO.md` and the files' dates; if the source changed, rebuild before
sharing and say what changed. Never edit an `.html` by hand: change the spec and
build again.
