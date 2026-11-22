# Page spec (`hojas/<page>.json`)

The spec is the page's content and the brand's look. `scripts/construir.mjs`
turns it into one HTML file with everything embedded. In text fields, `**word**`
makes bold and a line break starts a new line; nothing else is interpreted.

```json
{
  "titulo": "Así desarrollo software",
  "marca": {
    "claro":  { "fondo": "#F1E6CC", "texto": "#123F1F", "bloque": "#0F4A3F", "acento": "#3DFF8B" },
    "oscuro": { "fondo": "#0B332C", "texto": "#F1E6CC", "bloque": "#F1E6CC", "sobre_bloque": "#123F1F", "acento": "#3DFF8B" },
    "fuentes": { "titulo": "Young Serif", "texto": "Recursive", "mano": "Caveat" },
    "google_fonts": "https://fonts.googleapis.com/css2?family=Young+Serif&family=Recursive&family=Caveat:wght@600&display=swap"
  },
  "bloques": [ ... ],
  "pie": "Hecha desde VIDEO.md v1 y rodaje.md el 20 nov 2026."
}
```

- `titulo`: the browser tab and gallery name, 2 to 4 words.
- `marca.claro` (required): from `MARCA.md`. `fondo` is the page background,
  `texto` the main text color, `bloque` a dark brand color for strong boxes,
  `acento` one highlight color. Optional `sobre_bloque` (text on `bloque`,
  defaults to `fondo`).
- `marca.oscuro` (optional): the same keys for dark mode. Use the brand's dark
  variant if `MARCA.md` has one; otherwise omit it and the script derives one.
  Check both modes in the screenshot.
- `marca.fuentes`: Google Fonts names from `MARCA.md` for titles and body text;
  `mano` is an optional handwritten font for direction notes («cómo decirlo»).
  If the brand has no fonts, omit them. `google_fonts` is needed only when a font
  needs special settings (axes, weights).
- `pie`: always state the source files, their version, and the date.

## Blocks

Blocks are drawn in order. Use only these types.

| `tipo` | Fields | Use |
| --- | --- | --- |
| `portada` | `antetitulo`, `titulo`, `resaltado` (words of the title to highlight), `bajada`, `datos: [{valor, texto}]` | First block of every page. |
| `texto` | `titulo`, `texto` (string or list of paragraphs) | A short explanation. |
| `figuras` | `titulo`, `figuras: [{dibujo \| archivo, etiquetas, pie}]` | Drawings and photos side by side. |
| `pasos` | `titulo`, `bajada`, `items: [{texto, nivel}]` | Numbered steps; `nivel` is `obligatorio`, `recomendado`, or `opcional`. |
| `lista` | `titulo`, `items: [texto]` | A short list without order (things to bring). |
| `lectura` | `titulo`, `frases: [texto]` | The script read straight through, numbered, in a strong box. |
| `escenas` | `titulo`, `bajada`, `escenas: [...]` | Scene by scene with frames (below). |
| `opciones` | `titulo`, `bajada`, `opciones: [{nombre, texto, detalle, elegida}]` | Hooks or alternatives; the chosen one is marked. |
| `tabla` | `titulo`, `bajada`, `columnas`, `filas` | Short tables; on phones each row becomes a card. |
| `fichas` | `titulo`, `fichas: [{titulo, filas: [[etiqueta, valor]]}]` | One card per person or place (call times). |
| `aviso` | `titulo`, `texto` | One highlighted box: what you need from the reader. |

### Drawings (`figuras`)

- `{"dibujo": "camara-lateral"}`: side view of a seated person, phone on a tripod.
  `etiquetas` may override `pared`, `altura`, `celular` (list of two lines),
  `distancia`. Use it only when the setup is a person seated facing the phone.
- `{"dibujo": "encuadre"}`: how the person should look on the phone's screen.
  `etiquetas` may override `aire`, `aire2`, `ojos`, `pecho`, `pecho2`.
- `{"archivo": "../storyboard/referencia.png"}`: a real photo or reference image.

Labels must match the shoot plan: if the phone is at 1.5 m, say 1.5 m.

### Scenes (`escenas`)

```json
{ "titulo": "Apertura", "tiempo": "0–10 s", "decir": "exacto",
  "linea": "¿Te dijeron que ahora la IA hace el software sola?",
  "como": "Empieza sin saludar. Niega con la mano en «sola».",
  "filas": [["Se ve", "Tú a cámara y luego el panel"], ["Texto", "La IA sola no hace buen software"]],
  "cuadros": [ ... ] }
```

`decir`: `exacto`, `propias`, `sin-voz`, or omitted. `filas` is optional
label–value lines (useful on the approval page). `n` overrides the number.

Frames (`cuadros`), each 9:16 unless `ancho`:

| `tipo` | Fields | Shows |
| --- | --- | --- |
| `persona` | `texto_pantalla`, `cerca`, `pie` | A neutral silhouette of the person speaking, with the on-screen title. `cerca: true` for a closer cut. Use it when there is no frame or clip of the person. |
| `imagen` | `archivo`, `recorte`, `texto_pantalla`, `ancho`, `pie` | A storyboard frame or a still. `recorte: "captura"` frames a screenshot on the brand color instead of filling. |
| `video` | `archivo`, `recorte`, `desde`, `segundos`, `ancho`, `pie` | A short looping clip, silent. Default 4 s from second 0. `ancho: true` for horizontal or split-screen clips. |
| `nota` | `texto`, `pie` | A dashed placeholder for something not made yet. |

`pie` says in a few plain words what is seen and when («2 s: el panel con los
agentes»).

## Weight

Clips are embedded at small size, but they add up. Keep each clip at 2–5 s and
show only the clips that explain the scene. The script stops above 12 MB; aim for
well under 5 MB so the page opens fast on a phone.
