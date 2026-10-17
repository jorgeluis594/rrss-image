---
name: rss-image-generar
description: Produce a product sales image or campaign series (social posts, stories, catalog cards) with AI image models without the generic "AI flyer" look, reading MARCA.md for brand locks and selecting one of six composition types. Use for promo, ad, product, or campaign imagery; not for app UI.
---

Read `references/tells.md` for review criteria and `references/recipe.md` for prompt,
reference-guided generation, and layout guidance before producing the first image.

This file defines the workflow and product-truth requirements. References define production methods and review criteria. Each composition type has its own
reference, `references/tipo-<ID>-<nombre>.md` (listed in §1.1). Read only the selected
type's file; its requirements control that piece's layout. They are operational rules
for this skill, not universal laws or proof of higher conversion. Explicit user direction
takes precedence over aesthetic defaults; record intentional departures in the contract.

## Guardrail: generate the complete advertisement in one operation

For every composition type and every carousel slide, generate the complete finished
piece in a single image-model operation: product, scene, headline, offer, price,
conditions, call to action, graphic elements, and logo when included in the contract.
Supply all exact copy and all product/brand references in that operation.

Never generate a base image and then add, replace, or overlay text, an offer, a logo,
a badge, or another element in a second operation. This prohibition covers image
editors, image-model edits/inpainting, programmatic drawing, and compositing tools.
Do not reserve empty areas for later completion or generate panels separately for assembly.
Design text areas in the prompt and render their content in the same generation.

Before generating, verify that the prompt contains every required block and its exact
wording. If data or assets are missing, obtain them first. If any text, layout, logo,
or product feature fails review, regenerate the entire piece from the original
references and complete corrected prompt; do not patch the generated image. Allow
at most two full regeneration rounds after the initial attempt. If the tool cannot
produce a compliant complete piece, report the limitation and stop; do not fall back
to a base-plus-edit workflow. Saving or copying the generated file is allowed; visual
content must not be modified after generation.

## Guardrail: do not change the reference product

The product in the ad must be the same product supplied in the reference, never a
different or similar one. Its presentation may be enhanced to make it more attractive
and coherent with the scene: lighting, angle, cleanliness, freshness, gloss, styling,
and finish. It must stay recognizable as that product, with the same type, variant,
shape, colors, labels, and contents, and must not show components or quantities the
buyer would not receive. Do not replace it with another product or variant to fit the
composition, copy, or background unless the user explicitly asks; record that request
in `direction.md`. If the piece seems to need a different product, ask the user.

## Language

Communicate with the user entirely in Spanish, including clarification questions,
answer choices, review feedback, and delivery. Write `direction.md` and `log.md` in
Spanish. Image-model prompts may be in English when suitable for the selected tool;
advertising copy stays in the language specified by the brand or user.

## 0. Brand context and product truth

Read `MARCA.md` in the user-named directory (default: current directory). If missing,
ask for `$rss-image-inicio` first. Load approved identity, photographic precedents,
restrictions, pending proposals, and the latest three approved references.
For older documents, preserve approved “Locks visuales”; distinguish binding identity
from precedents without silently changing existing approvals.
If `MARCA.md` embeds a `Logo principal` image, resolve the local Markdown reference
relative to `MARCA.md` and open the saved file in `referencias/`. Include the logo in
finished ads by default unless the user asks to omit it or a recorded restriction
prevents use. Supply the saved image content as a visual reference in the same
image-model operation that generates the ad; preserve its design. If the model cannot
accept the saved format, render a compatible copy from it while retaining the original.
A Markdown link,
source URL, or text description alone does not supply the image to the model. If the
local file is missing or inaccessible, ask the user to supply it again before
producing a logo-bearing image.
For older `MARCA.md` files that list a local logo path without an embedded image,
load that file as the reference when it exists.

- A real product photo is required for a finished sales image. Without one, request
  it or deliver a clearly labeled layout with a placeholder.
- Generate the complete photographic scene with the user's product images supplied
  to the image model as visual references. The product, environment, light, shadows,
  perspective, and contact must form one coherent generated image. Do not generate an
  empty background and paste a cutout or rectangular source photo onto it, including
  as a repair or fallback. Generate advertising text and logo in that same operation.
- Preserve product identity rather than promising identical pixels. Before generation,
  identify the defining shape, proportions, construction, materials, colors, print,
  labels, decoration, and included parts visible in the references. Keep those features;
  do not substitute a similar product, blend different variants, or redesign it.
- Changes in illumination, perspective, and tiny rendering details are acceptable only
  when the product remains recognizably the same and its commercial features do not
  change. Do not demand pixel equality or reject ordinary light/shadow variation.
- If identity drifts, regenerate the entire advertisement using the original references and explicit
  feedback. If the tool cannot use images or retries fail, explain the limitation or
  request a better reference; never fall back to manual product pasting. Avoid new views
  that require inventing unseen defining features. Ask which product/variant to use
  when the supplied images are ambiguous.
- Include all advertising copy in the initial generation, using the exact wording
  from the contract. Proofread every word in the generated result. Existing text
  and marks on the real product are also part of its fidelity check.
- Record known rights restrictions. Do not add unrelated third-party marks or silently
  erase actual product marks. If a known restriction conflicts with faithful depiction,
  identify the conflict and request a usable asset or clarification.
- Never invent commercial facts or present generated subjects as customers, staff,
  or testimonials. Generated scenes must not imply unverified product performance.

## 1. Brief

Collect missing product photo paths, audience, placement, one main message, verified
commercial data, purchase channel, and requested identity departures in one question.
Separate supplied facts, verified facts, and design decisions. Omit unused commercial
fields; request missing facts required by the selected composition before production.

### Advertising text: resolve before generation

Apply this check to all six composition types, single images, series, and each carousel
slide. If the user supplied copy, use it. If exact wording can be derived unambiguously
from the brief, record it and its basis in `direction.md`; never infer missing prices,
conditions, attributes, testimonials, or other commercial facts.

If no copy is defined and the brief does not provide enough information to derive it,
ask: «¿Quieres incluir algún texto en la imagen? Si sí, ¿cuál o qué mensaje debe comunicar?»
Wait for the answer before generating the affected piece. Do not assume that missing
copy means a text-free image, invent filler, or generate a base while awaiting the answer.
General creative delegation does not bypass this check when the brief lacks a message.

If the user wants text, obtain the wording or a sufficient message to write it, then
record the exact final copy before generation. If the user explicitly wants no text,
do not ask again: record `sin texto publicitario por indicación del usuario` and omit
advertising text blocks. Preserve real text and marks on the referenced product.
If omitting text prevents the chosen composition from communicating its defining
message (such as an offer or comparison), resolve that conflict with the user before
production; do not silently change the type. A confirmed text-free piece is a complete
final image, never a base for later text overlays.

### 1.1. Composition type

The mandatory field `Tipo de composición` has exactly six values:

| ID | Type | Reading focus | Reference |
| --- | --- | --- | --- |
| 1 | Producto destacado | One product and its appearance or main quality. | `tipo-1-producto-destacado.md` |
| 2 | Producto en contexto | Product in a relevant action, use, or occasion. | `tipo-2-producto-en-contexto.md` |
| 3 | Comparación | Two options or states and a verifiable difference. | `tipo-3-comparacion.md` |
| 4 | Producto con argumentos | Product and supported arguments or authentic testimony. | `tipo-4-producto-con-argumentos.md` |
| 5 | Oferta protagonista | A dominant price or commercial offer. | `tipo-5-oferta-protagonista.md` |
| 6 | Conjunto de productos | Contents of a pack or options in an assortment. | `tipo-6-conjunto-de-productos.md` |

1. Use the user's selected number or name and check its inputs in
   that type's reference file.
2. If the user delegates selection, classify the main message in this order:
   offer/price → 5; difference between two options/states → 3; pack contents or
   assortment → 6; reasons to buy or evidence → 4; use or occasion → 2;
   product presentation → 1. Record the applied criterion. The mere presence of
   a price or multiple objects does not determine the type.
3. If neither selected nor delegated, show the six options and request one selection.
   Stop dependent production until answered.
4. Request any missing evidence or commercial facts required by the selected type.
   Do not silently switch types to bypass requirements.

If the type is 1, ask «¿Lo quieres como destacado clásico o como anatomía del producto
(producto con etiquetas que señalan sus partes visibles)?» unless the user already chose;
wait for the answer and apply that variant's requirements in `references/tipo-1-producto-destacado.md`.

Assign one type per piece. Record occasion, launch, gift, and testimony as modifiers,
not additional types. An offer-led pack belongs to type 5; an inventory-led pack to 6.

For `Producto destacado`, read `references/fondos.md` before defining the background.
When the user supplies a case or situation (such as a person buying a hamburger),
ask for the background, its intended feeling/message, and missing visual characteristics
using that reference's workflow. Wait for the answer before setting the direction or
generating. A described action does not establish the setting and does not authorize
switching to `Producto en contexto`. Record supplied details and explicitly delegated
background decisions in `direction.md`.

### 1.2. Publication format

After fixing the type, establish `imagen única` or `carrusel`. Reuse an already supplied
format; otherwise ask. For a series of independent posts, record each post separately.

- Single image: one piece, one main message, one type.
- Carousel: establish slide count and order. Use the requested count; when structure
  is delegated, assign one slide to each necessary message in the brief. Record each
  slide's function, message, type, references, and copy. The first uses the selected
  type; classify subsequent slides by their function using the selector above.
  If the requested count needs content absent from the brief, request that content;
  do not add invented claims to fill slides.

## 2. Direction and contract

Use the direction already established by the user. When design is delegated or part
of the brief, define one executable direction consistent with composition requirements
and brand locks. Record the decisions; do not present unsolicited creative suggestions.

Directions may vary campaign light, surface, crop, and composition while respecting
approved identity. If photographic style is explicitly locked, vary only permitted
axes; do not demand three different families. If the brief requires breaking a binding
lock and authorization is absent, resolve that conflict before dependent production.

Before defining the light in `direction.md` or the image prompt, read
`references/luz.md`. Propose a lighting setup for this specific scene using concrete,
visible effects on the product, setting, shadows, and reflections. Follow any light
direction already supplied by the user or locked by the brand.

Save `direction.md` next to the outputs:

- Intended audience, message, placement, publication format, piece count and order.
- Per piece: composition ID and exact name (with variant for type 1), modifiers, selection basis, required
  blocks, reading hierarchy, exact copy, commercial facts and their sources.
- Approved identity locks and their sources.
- Campaign constants: light and direction, surface/location, color treatment,
  typography/layout, and source product references and defining features to preserve.
- Variables: crop, subject/pose where feasible, surface variants, and purposeful props.
- Composition and copy space, palette roles for scene versus graphic elements,
  useful camera/optics cues, output dimensions, and verified safe zones or assumptions.
- Campaign design decisions and authorized departures, with their authorization basis.

Choose colors around approved identity and the real product. Keep product colors intact.
Record campaign-specific design decisions without promoting them to identity locks.

## 3. Prompt and production

Use the recipe to build a concise prompt containing applicable contract fields,
composition type, reading hierarchy, placement and exact content of every required
block. Request a complete finished advertisement, never a text-free base for later editing.
Before sending, check for conflicting light, surface, palette, or camera instructions;
name the elements to preserve and provide the actual references. State physical scale
and contact/shadow relationships where relevant. Replace vague quality adjectives
with useful specifics; do not reject a prompt solely because it contains a listed word.

Produce one version per piece. Produce alternatives only when requested; establish
their count before generation within the available tool and budget. For each alternative, return to the original product source
and contract rather than progressively reinterpreting a generated product. An approved
campaign image may serve as a separate style reference. Preserve chosen direction
while varying only intended axes.

## 4. Inspect the image

Use the catalog's three review levels:

1. Blocking defects: changed product identity or commercial features, anatomy/physics errors, invented facts,
   or misleading representation. Compare with the original at full size. Fix before
   delivery as a finished ad; changing style cannot excuse these defects.
2. Communication: requirements and hierarchy of the selected type in
   its reference file, product visibility, message space, crop, and placement suitability.
3. Specificity: identify concrete connections to this product and brand, and any
   unjustified defaults. Familiar composition alone is not a failure.

Verdict: `validada` or `regenerar`, with reasons. Any failed text, offer, layout,
scene, logo, or product check requires full-piece regeneration under the guardrail.
Check coherent light, contact, perspective, and edges: the product must not look
pasted on. Do not hide defects with crops, stickers, cutouts, or later overlays.
Allow up to two full regeneration rounds after initial review. If still blocked,
report the defect and required input; label any delivered draft as not validated.
A visual judgment is not a pixel-level verification; record checks honestly.

## 5. Check the complete generated piece

Follow the recipe for typography, contrast, and placement. Use the blocks and reading
order required by the selected composition; a universal three-copy-block template
does not override type requirements. Logo is a separate identity element.
Use only copy supplied or supported by the brief.

Inspect the exported final piece at full size and at expected viewing size: product
identity and scene integration, every word/number, legibility, text contrast, logo, crop,
safe zones, and export dimensions. Check that layout has not obscured important product
details or introduced clutter. Repeat this final gate after every full regeneration.
Check carousel order and each slide against its contract. Do not silently reclassify
an output to excuse a hierarchy mismatch. Only mark the finished piece `validada`
when all applicable product, composition, communication, and export checks pass.

## 6. Memory and delivery

Append to `log.md`: composition ID/name, variant, and modifiers per piece, publication format,
output and source paths, prompt, tool/model, seed if exposed,
contract, product features checked against references, verdict, defects/repairs, performed checks, and assumptions.
Use `no disponible` for unavailable metadata; never invent a seed or measurement.
Distinguish `propuesta`, `validada` (technical review), and `aprobada` (user acceptance
or explicit delegated authority). Record the approval basis when applicable.

Do not update approved brand identity merely because an image was delivered. Keep
unaccepted decisions under “Propuestas pendientes”; promote them and add the image to
“Referencias aprobadas” only when approval is established. Keep the latest three there
and retain earlier history in logs. Vary series images when it serves the message;
consistency and recognizable campaign repetition are allowed.

Deliver final assets, contract/log links, material limitations and unperformed checks.
Disclose generated scenes when the user or destination requires it. Publishing or
messaging is a separate action and is not implied by image creation.

Out of scope: data charts, UI screenshots, and invented products without real references.
Food and packaging follow the same identity rule: preserve the supplied item’s shape,
decoration, portions, and packaging; do not invent a more elaborate or different item
or claim the generated scene is an unedited photograph.
