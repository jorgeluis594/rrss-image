# Guion para aprobar

For the owner, the client, or whoever has to say yes to the script. They should
understand in two minutes what the video says, what is seen, and what is claimed,
and know how to approve or ask for changes.

## Sources

- `VIDEO.md`: brief, hooks, scenes, `texto_pantalla`, CTA, facts and sources.
- `storyboard/` and `material/`: frames and clips, when they exist.

## Blocks, in order

1. `portada`: antetítulo with version, `estado` in plain words («Borrador para
   aprobar» while `estado: guion`, «Aprobado el <fecha>» after), and duration;
   title of the video; `bajada` with the brief written for the reader
   («Para quién es, qué muestra y qué le pide al que lo ve»); `datos` with
   duration, platforms, and the call to action.
2. `opciones` «Cómo empieza»: the chosen hook, marked, and the alternatives in one
   line each. Omit the alternatives once the script is approved.
3. `escenas` «Escena por escena»: per scene, the time, the line (exact or not),
   and `filas` with «Se ve» and «Texto en pantalla»; frames when they exist,
   silhouettes or `nota` placeholders when they do not.
4. `tabla` «Lo que el video afirma»: each claim, price, offer, or fact said or
   shown, with where it comes from («Hechos y fuentes» of the brief). This is what
   the approver is really signing.
5. `aviso` «Para aprobar»: what you need from them, for example «Responde
   "aprobado" o dime qué cambiar, escena por escena.» Add anything still open
   (a fact to confirm, a person to schedule).

The page does not record approval. Approval happens in the conversation with
`$rss-video-guion`, which records it in `log.md`; if the reader's answer arrives
here, pass it on to that step.

Leave out: shots, angles, coverage, production notes, prompts, and the
alternatives' full detail.
