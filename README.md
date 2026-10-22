# rrss-image

Two Codex skills for defining a brand's visual identity (`rss-image-inicio`) and creating product ads (`rss-image-generar`). The second skill uses decisions saved in `MARCA.md` and real product photos.

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
