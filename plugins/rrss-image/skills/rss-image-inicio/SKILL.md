---
name: rss-image-inicio
description: Co-design brand identity with the user through an interactive discovery and visual-choice conversation, then create or update MARCA.md for rss-image-generar. Use when starting a brand, refining its visual identity, or updating brand assets. Do not complete identity discovery as a one-shot asset summary.
---

Help the owner discover and choose a design identity through conversation. `MARCA.md`
is the record of shared decisions, not a substitute for that conversation. Inspecting
a profile, reading assets, or collecting facts does not establish the desired identity.
Create or update the file in the user-named directory (default: current directory).
Campaign-specific decisions belong in `direction.md`, later created by `rss-image-generar`.

## Language and interaction

Speak to the user and write `MARCA.md` in Spanish. Use accessible descriptions and
concrete comparisons rather than requiring knowledge of fonts, hex codes, or lenses.

- Work in short rounds with one to three related questions. Ask, wait for the user's
  answer, interpret it, and then continue. Do not present all rounds in one questionnaire.
- Use the available question tool for text choices when appropriate; otherwise ask in
  the conversational response. Request files in conversation, not in a text-only tool.
- While waiting, inspect already supplied assets if useful, but do not choose an
  identity, write the final document, or advance dependent rounds without an answer.
  Silence and elapsed time are never a design choice.
- Offer recommendations with reasons and let the user select, combine, or reject them.
  “Start”, “use this profile”, “improve my brand”, and invoking this skill authorize
  discovery, not autonomous choice of the identity. Inspecting a reference does not
  mean adopting its style. Delegating a specific choice does not delegate all choices.
- Reuse explicit answers already given. Do not repeat questions or approvals when the
  conversation has already resolved them. If the user explicitly requests a one-shot
  draft or delegates decisions, honor that scope and label proposals accordingly.

## 1. Orient and understand the desired change

Read existing `MARCA.md` and available assets. Briefly say what is known and what is
still a hypothesis; do not turn this into a final report. A document saying “interview
pending” is unfinished discovery, even if it contains many observations.

Start with the most consequential open questions, for example:

- Who should feel this brand is for them, and what should they value about it?
- What should someone feel on seeing an ad: celebration, trust, playfulness, care,
  exclusivity, or something else? Ask which matters most and why.
- What should be preserved from the current brand, and what feels wrong or generic?

Confirm missing business facts only as needed: products, sales channels, service area,
formats, and language. Separate facts from preferences. Never invent commercial facts.
Do not skip identity discovery merely because these facts are visible on a profile.

## 2. Explore evidence together

Open supplied assets. Respect exclusions, including posts the user says are AI-generated
or not representative. Explain two or three relevant observations and ask what the
user wants to keep or change. Useful prompts: “Which of these feels more like your
brand, and which detail makes the difference?” or “Do you like its color, its mood,
or how clearly it shows the product?” Do not treat liking one detail as accepting all.

Distinguish:

- Approved identity: explicit user choices or an adopted brand manual, with source.
- Observed precedents: recurring light, surfaces, crop, palette, or type in older work.
  Repetition is evidence of a habit, not approval of a future rule.
- Proposals: possible choices to test in conversation, not measured brand facts.

Record documented hex values or sampled logo colors with source. Label photo samples
as approximate and unknown fonts as unknown. Describe visible depth of field without
claiming to measure the lens. A missing manual or exact font does not block discussion:
offer understandable alternatives and refine implementation details after selection.
Do not impose one product's colors, 60-30-10, minimalism, or an off-center composition
as the brand's identity. Ask about known asset rights only when relevant to intended use.

## 3. Co-design the visual identity

After hearing the user's priorities, propose two or three genuinely different routes
rooted in their answers and available evidence. Use concrete descriptions or available
visual references so the user can judge them. Do not generate assets just to decorate
the interview; if mockups are useful, use the appropriate image workflow and label
them as proposals rather than actual products or approved identity.

For each route explain:

- The personality and audience response it aims for, and why it fits the business.
- Palette roles, typographic character, photographic approach, and layout density.
- How it would look in one relevant ad, what it avoids, and its main tradeoff.

For example, “celebración juguetona” and “pastelería artesanal cercana” should differ
in meaningful design decisions, not merely in color names. Recommend a route, then
ask the user to choose, combine, or reject. Wait for that choice before refining it.

Refine the chosen route in small rounds: what feels right, what feels wrong, and what
needs adjustment. Translate preferences into concrete design decisions. Separate:

- Lasting identity: approved logo use, palette roles, type system, tone, recognizable
  visual elements, and any photographic rules the user actually wants fixed.
- Campaign freedom: lighting, surfaces, props, crops, layouts, and seasonal variations
  that may change while preserving identity.

If the user rejects the routes, revisit their reasons rather than choosing for them.
Do not lock a new visual decision solely because it seems professional or avoids slop.

## 4. Review the concrete agreement before saving

Present a compact identity proposal in Spanish: the intended personality, selected
palette and type direction, photo/layout principles, elements to preserve or avoid,
and what remains flexible. Identify unresolved implementation details honestly.
Ask whether this specific proposal represents the brand and what should change.
Wait for acceptance or incorporate revisions. Do not ask again if the user has already
explicitly accepted this exact set of decisions in the conversation.

Do not save an initial/final `MARCA.md` merely to finish the turn while core identity
choices are unanswered. If the user asks to save progress, save it clearly as
`borrador — descubrimiento en curso`, containing only the useful decisions reached.
Keep interview questions and alternative proposals in the conversation. A draft is not
completion and must not promote proposals into approved identity.

## 5. Save a focused brand brief

`MARCA.md` is a compact design brief for future ads, not an interview transcript,
research report, approval ledger, or agent activity log. Include an item only if it
helps a future designer make a concrete brand-specific decision. Aim for one readable
page (roughly 40–70 lines); omit empty sections rather than filling them with pending
items. Useful accepted detail matters more than meeting a line count.

Use only the relevant sections from this structure:

```markdown
# MARCA: <negocio>
## Negocio y público
## Personalidad y tono
## Identidad aprobada
## Dirección visual
## Assets y referencias
## Formatos y canales
## Restricciones de marca
```

- Negocio y público: what the business sells, to whom, and the relevant differentiator.
  Include location only if it changes the message or sales scope.
- Personalidad y tono: agreed personality, register, and useful copy examples or words
  to avoid. Translate abstract adjectives into usable choices.
- Identidad aprobada: accepted logo, palette roles/hex when known, typography, and
  other binding elements. An accepted type direction can appear without a chosen font;
  mention that gap once only if necessary to prevent inventing an approved typeface.
- Dirección visual: agreed photography, composition, and graphic principles, plus
  what can vary by campaign. Include meaningful brand-specific aesthetic exclusions.
- Assets y referencias: usable paths/links with a short role, such as “logo principal”
  or “referencia de composición”. Prefer selected assets over a broad profile requiring
  a repeated investigation. Include only useful approved references, up to three images.
- Formatos y canales: actual agreed destinations and formats needed for design.
- Restricciones de marca: only specific, durable constraints that affect future ads,
  such as a prohibited claim or a known usage restriction on an asset.

Do not include:

- The history of what the user said, corrected, authorized, or asked the agent to analyze.
- Instructions for this research session, discarded sources, or explanations of how
  the agent inspected a profile. For example, “no uses las publicaciones de ropa hechas
  con IA para este análisis” guides source selection; it is not a brand-design rule.
  Apply it during the analysis and omit it from MARCA.md. Do not reinterpret it as
  “the brand must never use AI imagery”. If the user actually establishes a lasting
  asset-use restriction, record only that concise operative rule.
- Observations that never became accepted design choices, rejected routes, interview
  questions, exhaustive pending lists, or commentary about missing evidence.
- Repeated `aprobado`, `inferido`, source, or consent labels on every line. Establish
  acceptance in the conversation; use links in Assets when they help locate a resource.
- Generic agent rules already covered by the skills: do not invent prices, check safe
  zones, obtain approvals, avoid misleading claims, or keep campaign logs. Retain only
  brand-specific information, not boilerplate.
- Current campaign prices, promotions, or dates; these belong in that campaign's brief.

Before saving, review each line: “What future design decision does this change?” Delete
anything without a clear answer. Merge repetition, remove process narrative, and omit
unsupported facts. Never turn an inference into approved identity to fill a section.
Keep unresolved questions and approval context in the conversation, not a new companion
file unless the user requests one. Report remaining actionable gaps in the response.

When updating an older MARCA.md, preserve actual accepted choices and useful asset
paths while pruning process clutter. Read legacy sections (“Negocio”, “Cliente y tono”,
“Locks visuales”, “Precedentes fotográficos”, etc.) by meaning; the document need not
retain an empty schema. An `aprobado` label is not evidence when the user disputes it.
Do not invent prior consent. New brand choices still require the interaction above.

Report what was agreed and saved briefly. Stop: image production belongs to
`rss-image-generar`. If resuming later, use the conversation's open questions and the
brief's accepted choices instead of restarting the interview.
