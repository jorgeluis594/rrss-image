# Hoja de grabación

One page per person on camera or voice, for that person to read on their phone
before and during the recording. It answers: where do I put the phone, how do I
look, what do I say, how, and how many times.

## Sources

- `actores/<talento-id>.md`: lines, intention, look, place. Required.
- `rodaje.md`: that person's step-by-step guide and «Citación». Optional; without
  it, skip «Cómo grabarte» and say so on the page.
- `VIDEO.md`: scene times, `literal`, and `texto_pantalla`.
- `storyboard/` and `material/`: frames and clips, when they exist.

## Blocks, in order

1. `portada`: antetítulo with guion version, approval date, and duration; title of
   the video; `bajada` with what this person does in one or two sentences (one
   take or several, what others will add later so they do not have to show it);
   `datos` with number of lines, which lines are exact, and the estimated time.
2. `figuras` «Cómo grabarte»: the setup drawings that apply (`camara-lateral` and
   `encuadre` for a seated person facing the phone; a real reference photo when the
   plan has one). Skip drawings that do not match the plan.
3. `pasos`: that person's steps from `rodaje.md`, in order, with their level, in
   plain words. Include how many times to say each exact line and what to do at
   the end (silence, where to send the file).
4. `lectura` «Tu guion, de corrido»: every line this person says, in order, so
   they can rehearse it straight through.
5. `escenas` «Escena por escena»: per scene, the line with «Decir exactamente» or
   «Con tus palabras», the direction note in `como`, and the frames of what is seen
   at that moment: the person (silhouette or storyboard) with the on-screen title,
   then the captures or clips laid over, each with a short `pie`.
6. Optionally an `aviso` with what to do when they finish.

Leave out: scenes this person is not in (unless their voice is used), other
people's notes, the technical table, prompts, and anything about editing.
