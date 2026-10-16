# rrss-image

Dos skills para definir la identidad visual de una marca (`rss-image-inicio`) y crear anuncios de producto (`rss-image-generar`). El segundo usa las decisiones guardadas en `MARCA.md` y fotos reales del producto.

## Instalación

### Codex

```sh
codex plugin marketplace add jorgeluis594/rrss-image
codex plugin add rrss-image@rrss-image
```

Inicia una conversación nueva para usar los skills.

### Claude Code

```sh
claude plugin marketplace add jorgeluis594/rrss-image
claude plugin install rrss-image@rrss-image
```

Los skills se pueden invocar como `/rrss-image:rss-image-inicio` y `/rrss-image:rss-image-generar`.

### Pi

```sh
pi install git:github.com/jorgeluis594/rrss-image
```

### OpenCode

Clona el repositorio y copia las carpetas `plugins/rrss-image/skills/rss-image-inicio` y `plugins/rrss-image/skills/rss-image-generar` a `.agents/skills/` del proyecto o a `~/.agents/skills/` para usarlas en todos los proyectos. Conserva la carpeta `references/` junto a `rss-image-generar/SKILL.md`.

## Requisitos de uso

`rss-image-generar` requiere una herramienta de generación de imágenes que admita fotos de referencia. El paquete contiene las instrucciones y referencias, pero no instala una herramienta de imágenes. Cada usuario aporta sus fotos y su propio `MARCA.md`.
