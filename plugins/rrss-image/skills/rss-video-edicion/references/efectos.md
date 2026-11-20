# Effect scripts

The engine ships no effects. Each brand has its own, written by you from the
descriptions in its `ESTILO-VIDEO.md` the first time a video needs them, and reused
afterwards. They live in the brand folder, beside `MARCA.md`:

- `efectos/<nombre>.tsx`: one script per effect.
- `efectos/INDICE.md`: the index of what exists.

## Choosing or writing an effect

1. Decide what the moment needs from the «Efectos» section of `ESTILO-VIDEO.md`.
2. Look in `efectos/INDICE.md`. If a script for that description exists and is
   `aprobado` or `probado`, use it with this video's parameters.
3. If none exists, write it from the description, test it, and add it to the index.
4. Write a second script for a description that already has one only when the user
   asks for a different look or the existing one cannot do what this video needs;
   name it with a suffix (`titular-de-apertura-2`) and say why in the index.

The description's «Puede variar» is yours to decide when writing; everything in
«Medidas» and «Nunca cambia» is fixed. Do not write an effect that `ESTILO-VIDEO.md`
does not describe; if the user asks for one, it is a style change (see `SKILL.md`).

## Contract

A script is a `.tsx` file that default-exports an `Effect` (types and helpers in the
engine's `src/kit.ts`; read that file before writing the first script):

- `Layer`: a React component drawn over the picture, for text, cards, stickers,
  transitions.
- `camera`: a function that returns `{ scale, focusX, focusY }` to move the picture
  itself, or `null` to leave it alone.

Both receive the same props: `t` (seconds since the effect started), `now` (output
second), `start`, `end`, `fps`, `width`, `height`, `brand`, `params`, `words` (word
timings of the whole video), and `timeline`.

Rules:

- Pure function of its props: the same frame always renders the same. No
  `Math.random()`, dates, network, or state. For variation use a value derived from
  `params` or from an index.
- Nothing about one video inside the script: texts, times, positions, and file names
  arrive in `params`. Colors and typography come from `brand`.
- Import only `react`, `remotion`, and `../kit`. Use `SAFE`, `SIDE`, `easeOut`,
  `bounce`, and `toPages` from the kit instead of rewriting them.
- Files referenced by a param are paths relative to the video folder, loaded with
  `staticFile`. Copy brand assets a video needs into its `edicion/` folder.
- Start the file with a comment: the effect's name, one sentence on what the viewer
  sees, and every param with its default.
- File names use lowercase letters, digits, and hyphens only.

A minimal camera effect:

```tsx
// Acercamiento suave: the picture glides closer and holds until the effect ends.
// params: scale (default 1.12), rise (seconds, default 0.5), focusX, focusY.
import { easeOut } from '../kit';
import type { Effect } from '../kit';

const effect: Effect = {
  camera: ({ t, params }) => ({
    scale: 1 + ((params.scale ?? 1.12) - 1) * easeOut(t / (params.rise ?? 0.5)),
    focusX: params.focusX ?? 0.5,
    focusY: params.focusY ?? 0.3,
  }),
};

export default effect;
```

## Using effects in `timeline.json`

```json
"captions": { "words": [ ... ], "plain": false },
"effects": [
  { "name": "subtitulos-que-saltan", "start": 0, "end": 30, "params": { "y": 0.68 } },
  { "name": "acercamiento-suave", "start": 11.35, "end": 13.8, "params": { "focusY": 0.22 } }
]
```

`name` is the file name without extension. Effects with a `Layer` draw in list order,
over clips, plain captions, and texts. When several camera effects overlap, the last
one in the list wins. Set `captions.plain` to `false` when an effect draws the
captions; otherwise the engine draws its own plain ones as well.

## Testing a new or changed script

Run from the engine folder:

```bash
node scripts/efectos.mjs <brand-dir>      # load the brand's scripts into the engine
npx tsc --noEmit -p .                      # the script compiles against the contract
npx remotion still src/index.ts Video <video>/edicion/prueba-<nombre>.jpg \
  --props=<video>/edicion/timeline.json --public-dir=<video> --frame=<n>
```

Run `efectos.mjs` again after every change to a script and before every render.
Render the frames named in the description's «Cómo se comprueba» and open them. A
script enters the index only when it compiles and those frames show what the
description says, with nothing outside the safe area. Delete the test frames after.

## `efectos/INDICE.md`

One row per script. `estado` is `probado` once it passes the test above and `aprobado`
once the user has approved a draft that uses it. Keep rows short; the description
lives in `ESTILO-VIDEO.md`.

```markdown
# Efectos de <marca>

| Efecto (ESTILO-VIDEO.md) | Script | Qué hace esta versión | Parámetros | Estado | Usado en |
| --- | --- | --- | --- | --- | --- |
| Subtítulos que saltan | subtitulos-que-saltan.tsx | Grupos de 3 palabras, rebote e inclinación alterna, palabra activa en naranja | y, maxWords, fontSize, hide | aprobado | 2026-11-lista-escolar |
```
