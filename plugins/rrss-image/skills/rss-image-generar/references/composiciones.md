# Composition types: operational requirements

This classification comes from `tipos-composicion-publicidad-redes.md`, supplied by the
user on October 14, 2026. This reference is self-contained; the original file is not
required. The hierarchies are operational rules for this skill, not universal laws or
proof of higher conversion. Do not reuse fictional facts from the source examples.

## 1. Producto destacado

- Input: a real photo and an introductory message or product quality supported by the brief.
- Structure: one recognizable main product, visually separated from the background,
  with room for a headline and brand. Text and secondary objects do not cover identifying features.
- Background: apply [Background treatment](fondos.md) before defining it. If the user
  describes a situation or action, ask about the background, its intent, and missing
  characteristics, then wait for the answer before producing. An action does not define
  the setting. Respect supplied details and complete only delegated decisions, keeping
  the product as the first focal point. Do not automatically reclassify it as Producto en contexto.
- Hierarchy: product → headline → brand and action, if the action is part of the brief.
- Framing: show shape and packaging for an introduction; show the actual detail when
  the message concerns texture or finish. Do not invent features absent from references.
- Validation: the product is the first focal point and recognizable at viewing size.
  If a price appears, it has secondary prominence.

## 2. Producto en contexto

- Input: a real photo and a defined use or occasion.
- Structure: a setting related to the use, a visible or inferable action, and an
  identifiable product. Every secondary object has a purpose in the scene. Any hands
  or people have coherent anatomy, scale, and contact.
- Hierarchy: product in use and action → occasion message → brand and purchase action.
  Omit the purchase action if it is not in the brief.
- Text: place it in a readable area without obscuring the product or action.
- Validation: viewers can tell what is being sold and how it relates to the occasion.
  Do not claim unverified performance or present generated subjects as real customers.

## 3. Comparación

- Input: two identified options or states, references for both, and one main criterion
  supported by verifiable data. Before/after requires real evidence of the result;
  a generated recreation is not that evidence.
- Structure: two labeled panels with comparable framing, scale, and conditions.
  Explain differences with text, rather than color alone. Align additional attribute
  rows by criterion.
- Hierarchy: options or states → main difference → conclusion and action if defined.
- Production: generate both panels, labels, and conclusion in one operation, assigning
  original references to each variant. Do not generate panels separately for assembly
  or paste product cutouts onto generated backgrounds. Do not alter visual evidence of
  documented results.
- Validation: correct labels, supported differences, scale that does not exaggerate
  advantages, and a conclusion limited to verified criteria. If asked to fabricate
  evidence of a result, stop that part and request usable evidence.

## 4. Producto con argumentos

- Input: a real photo and two or three supported arguments, or an authentic review
  with text, attribution, and the corresponding product. Ask for missing arguments;
  do not invent claims to complete the list.
- Structure: visible product and an argument or annotation block. For a testimonial,
  the review replaces the list. Connect an attribute to a benefit only when both are
  supported. Arrows end on the relevant detail; close-ups require real references of it.
- Hierarchy: product and main reason → arguments or evidence → action if defined.
- Validation: arguments are readable at the intended size and match their sources.
  Do not invent seals, certifications, or reviews; preserve the meaning and attribution
  of a testimonial.

## 5. Oferta protagonista

- Input: a specific offer, included product and presentation, quantities and applicable
  conditions; currency when a price is shown. Use an earlier price, percentage, dates,
  and availability only when supplied or verified. A limited-time promotion needs real
  validity dates. Ask for the purchase channel if missing.
- Structure: one dominant commercial fact, recognizable product, legible conditions
  close to the offer, and an action tied to the purchase channel.
- Hierarchy: offer → included product → conditions and action.
- Data: show final price and currency where applicable; earlier price has secondary
  prominence. If displaying an earlier price, final price, and percentage, check their
  arithmetic consistency and resolve discrepancies before producing.
- Validation: buyers can tell what they receive and under what conditions. Do not
  invent urgency. Other benefits must not compete with the main offer. Showing a pack
  does not change the type when price or commercial benefit dominates.

## 6. Conjunto de productos

- Input: a list and real photos of the items or variants, quantities, and commercial
  relationship: a complete pack or units sold separately.
- Structure: items arranged by content, sequence, or variant; a title expressing their
  relationship; enough separation to count and identify products. Distinguish included
  contents from decorative props.
- Hierarchy: set and relationship between items → contents or options → price and
  action when they are in the brief.
- Scale: preserve relative proportions. If a grid normalizes apparent sizes, state
  real dimensions when needed for comparison. Do not show different views of one item
  as additional units.
- Validation: visible inventory matches the text; no duplicates, omissions, or mixed
  variants; the pack is distinguishable from individually sold items. Price is secondary.

## Production guardrail for all six types

Generate the entire piece in one operation, including all text and graphic elements.
For Oferta protagonista, price, promotion, conditions, and action appear with the
product in the initial generation. Generating a base and adding the offer later with
any tool is prohibited. If an element fails, regenerate the entire piece; do not edit
or overlay elements on the result.

## Common check

Before generating, apply the brief's text check in SKILL.md to every piece. If no text
is defined and there is not enough information to infer it, ask the user in Spanish
whether to include text and wait for the answer. Record an explicit choice to omit
text; if it conflicts with the message defining the type, resolve the conflict before
producing. Do not add filler copy merely to satisfy a structure.

Record type, modifiers, inputs and sources, blocks, hierarchy, and validation for each
piece. In a carousel, apply the requirements to each slide. Correct failures against
the contract; do not silently reclassify after generation.
