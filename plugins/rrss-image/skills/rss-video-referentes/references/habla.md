# The user's way of speaking

Optional. Run it only when the user accepted it. The goal is a short portrait of how
one person talks, so `$rss-video-guion` writes their lines the way they would say
them. Each person who speaks in the brand's videos records their own sample.

## 1. Give three situations

Build three situations from `MARCA.md` (product or service, audience, the problem it
solves, the tone), so the person talks about what they will really talk about in
their videos. They cover the three moments of a video, because people speak
differently in each:

| Moment | Situation to build | Example (a store that sells by live stream) |
| --- | --- | --- |
| Explain | Tell a specific person from the audience what the product does and why it would help them | «Cuéntale a una amiga que vende ropa por live qué hace tu app y por qué le serviría» |
| Complain | Say what bothers them most about how the problem is handled today | «Di qué es lo que más te molesta de cobrar pedidos por chat después de un live» |
| Ask | Convince that person to try it today | «Convéncela de que lo pruebe esta semana» |

Rules for the situations:

- Give the topic and who they are talking to. Never give sentences to say, an
  outline, or key points: a person who receives text reads it, and reading is not
  how they speak.
- The listener is one concrete person from the brand's audience («una amiga que…»,
  «un cliente que te pregunta…»), not «tu público».
- Use only what `MARCA.md` says about the product. Do not suggest claims, prices, or
  results.

## 2. Ask for the recording

Ask in simple steps, in Spanish:

1. Graba un audio con el celular (una nota de voz sirve), en un lugar sin música ni
   ruido.
2. Responde las tres situaciones en el mismo audio, unos 20 a 30 segundos cada una.
3. No lo escribas antes ni lo repitas: habla como le hablarías a esa persona. Si te
   equivocas, sigue; eso también sirve.
4. Envía el archivo.

A video also works. If the recording sounds read or rehearsed (very even pace, no
restarts, written-style sentences), say so and ask whether they want to try once
more without preparing; do not insist a second time.

## 3. Transcribe and measure

Transcribe the recording with the engine's `transcribir.mjs` (see «Tools» in
SKILL.md), then measure it with the recording itself as the audio, so pauses come
from real silences:

```bash
node <skill>/scripts/medir-habla.mjs <palabras.json> --audio <grabación>
```

Use `--desde` and `--hasta` to measure each situation separately when their times
are clear. Without a transcription with word timings there is no measured portrait:
tell the user, and offer the reduced version (they write three short answers the way
they would send them in a voice chat), recorded in the document as «sin medir, a
partir de texto escrito».

Limits to keep in mind and to tell the user when they matter:

- Whisper often drops fillers («eh», «este», «o sea») and tidies restarts, so the
  transcription is cleaner than the speech. Fillers are confirmed by asking.
- The word a pause is attached to is approximate; where pauses fall (after a
  question, before the key word) is a tendency, not an exact position.
- One and a half minutes is a small sample. Present the portrait as a first version
  the scripts will refine.

## 4. Draw the portrait

From the transcription and the measurements:

- **Speed**: `palabras_por_segundo` (with pauses). This is the number the script uses
  for the timing of this person's lines.
- **Sentences**: typical and longest length in words; whether they finish them,
  chain them with «y», or cut and restart.
- **Starts**: how they begin a sentence or an idea («Mira,», «O sea,», «Lo que pasa
  es que…»). Use `frases.arranques` and read the transcription.
- **Fillers and connectors**: the ones in the transcription, plus the ones the user
  confirms.
- **Their words**: what they call the product, the customer, and the problem; local
  expressions; words they repeat.
- **Pauses**: how many per minute and where they tend to fall.
- **Differences between the three moments**: for example faster and shorter when
  complaining, slower when explaining.
- **Their own sentences**: three to five, quoted exactly, that sound most like them.

Do not describe tone of voice, accent, or energy: they cannot be heard. Ask instead.

## 5. Show it and correct it

Show the portrait in six to ten plain lines and ask:

- «¿Te reconoces? ¿Qué cambiarías?»
- «¿Qué muletillas sabes que usas?» (to recover the ones the transcription dropped)
- «¿Hay palabras o maneras de decir que no usarías nunca en un video?»
- «¿Cómo dirías que suenas cuando hablas de esto: tranquilo, apurado, bromista?»

Then write two sample lines for the brand in their way of speaking, of the kind a
video would have (an opening and a closing), and ask whether they would say them
like that. Their corrections go into the portrait. The sample lines are a check, not
a script; they are not saved.

Write the result in «Cómo habla <persona>» of `ESTILO-GUION.md`, with the person's
name or role as they want it to appear.
