# Dials

Four dials describe how a brand's videos are edited. Each has three levels. This file
is the starting text for `ESTILO-VIDEO.md`: copy the chosen level of each dial,
translate it into the brand's own words in Spanish, and adjust it with what the user
asked for. Numbers are starting values; keep them unless the user or a sample says
otherwise.

`ESTILO-VIDEO.md` decides the style of the edit, and `$rss-video-edicion` follows it
over its own defaults (shot length, words per caption, sound effects). The dials set
the limits; the effects that work inside them are described in `biblioteca.md`.

Rules that hold at every level:

- An effect points at what is being said. One accent at a time; two effects never
  compete for the eye in the same second.
- Effects land on the spoken word, using word times measured on the final voice.
- Every movement ends still and legible. Text is centered on the frame, inside the
  safe area, and never covers the speaker's face or the product.
- Within one video, everything uses the same curve, accent color, and typography.
- Never, at any level: glitch, distortion, light leaks, color filters, 3D flips.

## Movimiento

**Controls** how elements enter, stay, and leave. Movement pulls the eye to what is
new, so the viewer looks at what is being said and a still picture does not bore them.

| | 1 · suave | 2 · vivo | 3 · marcado |
| --- | --- | --- | --- |
| Feels | Calm and careful, like a well-made presentation | Agile and friendly | Lively and playful, like someone telling it with energy; never abrupt or dizzying |
| Entries | Fade and short slide (0.25–0.4 s), no overshoot | Light bounce (about 0.4 s), no tilt | Bounce that overshoots and settles (0.4–0.75 s), slight tilt |
| On hold | Still | Floats a few pixels when on screen over 2 s | Floats and tilts half a degree |
| Camera | Slow push of 3–5 % per shot | Slow push plus a soft scale to 110–115 % on the key moment | Slow push plus hit scales to 115–120 % on keywords, up to 140 % in the hook |
| May | Fade, slide, slow push | Bounce, float, soft scale | Bounce, tilt up to 5°, float, hit scale |
| May not | Bounce, tilt, hit scale | Tilt, hit scale, two elements entering together | Shake, full spins, two elements entering together |

## Ritmo

**Controls** how often something changes on screen. Change resets attention; too
little and the viewer drifts, too much and nothing stands out.

| | 1 · pausado | 2 · medio | 3 · rápido |
| --- | --- | --- | --- |
| Feels | Unhurried; each idea gets its time | Steady, something new before the viewer gets bored | Fast and dense |
| Shots | Up to 6 s when the speaker holds attention | 2–4 s | 1–2.5 s |
| Accents | Only on the price or main figure and on the CTA | About one every 5 s | One on every keyword, never two within 1.5 s |
| Hook | Readable text from frame 0 | Text from frame 0 plus one camera accent in the first second | Text, camera accent, and a cut within the first 2 s |
| May | Long shots, cuts on changes of idea | Cuts on changes of idea, B-roll over voice | Jump cuts, speed changes on silent actions |
| May not | Jump cuts, accents on ordinary words | Accents on every word, runs of cuts under 1 s | Cuts that break a sentence mid-word, shots under 0.7 s |

## Texto

**Controls** how captions and headlines look. Text holds viewers who watch muted and
gives the eye something to follow.

| | 1 · discreto | 2 · llamativo | 3 · protagonista |
| --- | --- | --- | --- |
| Feels | Accompanies without calling attention | Clear and energetic | The text is part of the show |
| Captions | Phrases of up to 5 words, sentence case, medium size, no highlight or a subtle one | Up to 3 words, capitals, enter with a pop, the spoken word in the accent color | 1–2 words at a time, large capitals, the spoken word scales up |
| Headlines | Plain text or a solid box, one size | A key word in the accent color or with a highlighter that wipes in when spoken | Large, with highlighter and per-line entry timed to the voice |
| May | One text style, one weight | One accent color, highlighter on one word per line | Highlighter, per-word scale, alternate tilt per caption page |
| May not | Capitals for full captions, highlighter, per-word effects | More than one accent color, a single huge word per screen | More than two type styles, text that fills the frame over the speaker |

## Adornos

**Controls** what accompanies the message without being it: transitions, sounds,
mascot, stickers. Decoration gives personality and marks turning points; in excess it
competes with the message.

| | 1 · ninguno | 2 · sutiles | 3 · con personalidad |
| --- | --- | --- | --- |
| Feels | Clean; the content does all the work | Polished, with small touches | Recognizable and fun |
| Transitions | Hard cuts and fades only | One wipe or slide at the change of act, in brand colors | Same, with a matching sound |
| Sound | Voice and music only | A short soft sound on taps and on the main figure | Marked sounds on taps, figures, and the transition |
| Mascot and stickers | None | None | The brand's own mascot or stickers, at most three times per video, each tied to a beat (problem, result, CTA); only if `MARCA.md` allows it |
| Backgrounds | Flat brand color | Soft gradient | Gradient with slow-moving shapes |
| May | Fades | One act transition, soft sounds | Mascot, marked sounds, moving backgrounds |
| May not | Wipes, sound effects, stickers | Mascot, a sound on every cut, more than one transition | Stickers foreign to the brand, emojis the brand forbids, a sound on every cut |
