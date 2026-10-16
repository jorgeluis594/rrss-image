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
