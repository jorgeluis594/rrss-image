# rrss-image

Codex skills for defining a brand's visual identity (`rss-image-inicio`), creating product ads (`rss-image-generar`), and making short vertical videos (`rss-video-guion`, `rss-video-produccion`, `rss-video-estilo`, `rss-video-edicion`). Image and video skills use decisions saved in `MARCA.md` and real product photos.

## Short-video skills

Each video skill is a team specialty that owns specific files in `videos/<video-id>/` inside the brand directory and hands off through the `estado` field of `VIDEO.md`:

- `rss-video-guion` writes the brief, hooks, and technical script (`VIDEO.md`) and one script per actor (`actores/`).
- `rss-video-produccion` turns an approved script into a storyboard, a shoot and generation plan (`rodaje.md`), and a reviewed index of filmed or generated clips (`material.md`).
- `rss-video-estilo` defines with the user how the brand's videos are edited (four dials and a set of effects described in words) and saves `ESTILO-VIDEO.md` beside `MARCA.md`.
- `rss-memoria` (optional, needs the `happy-memory` CLI) recalls and records the brand's content history: topics already covered, resources used, editing decisions and effects with their reasons, and what the user rejected.
- `rss-video-edicion` writes the cut plan (`edicion.md`) and a `timeline.json`, renders drafts with its bundled Remotion engine, checks them with measurements and with an evaluator subagent (strange frames, strange starts, unreadable text) on the selected takes and each draft, and exports the final files to `exports/`. It follows `ESTILO-VIDEO.md` and writes the brand's effect scripts from its descriptions, indexed in `efectos/INDICE.md`.

The script, material, and final video each require the user's explicit approval, recorded in `log.md`. Editing requires Node 20+, `ffmpeg`, and `ffprobe`; word-level captions build whisper.cpp locally on first use (`make` and a C++ compiler). The engine installs into the user-data directory (`rrss-image/motor-video/`). Remotion is free for individuals and companies of up to 3 people; larger companies need a [Remotion company license](https://www.remotion.dev/docs/license).

## Brand rules that evolve with the work

`MARCA.md` has one owner, `rss-image-inicio`, and `ESTILO-VIDEO.md` has one owner, `rss-video-estilo`; the other skills read them but never rewrite them (except the «Referencias aprobadas» list, which `rss-image-generar` maintains). When the user corrects something during a piece that sounds like a lasting rule, or approves a final video or image that departs from those documents, the working skill appends an entry to `CAMBIOS-PENDIENTES.md` beside `MARCA.md`: the user's words, the piece, the line it touches, and the proposed rule. Every skill mentions open entries once when it starts and never applies them on its own.

Each owner has a review mode, run when there are open entries or when the user asks to review or update the brand or the style. It fixes mechanical issues (broken asset paths, effects missing fields or scripts), reports contradictions between `MARCA.md` and `ESTILO-VIDEO.md`, lists concrete differences that approved videos repeated outside the style, and lets the user apply, discard, or keep each change for one piece only. Only applied changes reach the documents.

## Install in Codex

```sh
codex plugin marketplace add jorgeluis594/rrss-image
codex plugin add rrss-image@rrss-image
```

Start a new chat to use the skills. Both skills communicate with users and ask questions in Spanish.

## Requirements

`rss-image-generar` requires image generation that accepts reference photos. Each user supplies their own product photos. If they have a logo, they can attach or paste the image, provide a local path, or share an image URL. `rss-image-inicio` saves a local copy in `referencias/` beside `MARCA.md`; `rss-image-generar` loads that copy as a visual reference when creating ads.

## Brand storage

Both skills reuse a persistent per-user brand directory across local chats: `~/Library/Application Support/rrss-image/marcas/` on macOS, `%LOCALAPPDATA%\rrss-image\marcas\` on Windows, and `${XDG_DATA_HOME:-~/.local/share}/rrss-image/marcas/` on Linux. An explicit brand directory overrides the default. Existing local `MARCA.md` files remain a legacy fallback when no registered brand exists.

When initial creation requires permission, the skill requests access to the nearest existing ancestor and verifies writing before starting brand discovery. Permission to a nonexistent directory may not enable its creation in the Linux sandbox. Permissions remain controlled by the host application and may need to be granted in a new chat; a shared storage location does not itself grant access.
