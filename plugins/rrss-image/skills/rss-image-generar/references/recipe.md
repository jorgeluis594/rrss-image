# Reference-guided complete advertisement generation

The main SKILL.md defines requirements and exceptions; this file supplies methods.
Use only instructions relevant to the chosen production method and placement.

Before preparing the prompt, complete the advertising-text check in SKILL.md.
If copy is neither defined nor inferable from the brief, ask whether the user wants
text and wait. When the user explicitly selects no advertising text, omit copy and
typography fields; preserve existing product markings and generate the complete image.

## Prompt structure

Write a concise scene description using the applicable contract fields. State concrete
visual decisions. Include exclusions only when supported by the selected tool.

```text
<Composition ID/name and purpose>, for <placement and aspect ratio>.
Hierarchy: <reading order and required blocks from composiciones.md>.
Source: <actual reference and role: product or style>.
Product identity: <shape, proportions, materials, print, trim, labels, colors, parts to preserve>.
Scene: <surface, location, and purposeful props if any>.
Light: <source, direction, quality, consistent shadows>.
Framing: <view, crop, product scale, useful lens/depth-of-field cues>.
Palette: <scene colors compatible with the real product and brand>.
Advertising copy: <every exact headline, offer, price, condition, label and CTA>.
Typography and layout: <position, hierarchy, size and treatment for each text block>.
Brand: <supplied logo reference and its position, when included>.
Output: complete finished advertisement with all text and graphics rendered now;
no empty placeholders, no later text/logo overlay, no separate assembly.
```

## Generate an integrated scene

Supply the user's actual product images to the image tool, not only a textual summary.
Inspect them first and assign each a role: target product, detail/alternate view of that
same product, or style reference. Multiple different products are not interchangeable
views. Assign each to its comparison panel or set position according to the contract;
clarify ambiguous assignments instead of averaging their features.

Generate the complete finished advertisement with the referenced product naturally
present and every required text and graphic element already rendered. Reconcile
illumination, shadows, perspective, contact, typography and hierarchy in that operation.
Never generate only a backdrop or photographic base for later completion. Do not
paste source photos, cutouts, copy, logos or badges onto the result. For comparisons,
generate both panels, labels and conclusion together in the same finished image.

Before calling the image model, check the prompt against the contract: every required
block has exact wording and placement; every product and logo reference is attached.
Missing commercial data must be resolved before generation, not added afterward.

## Review product identity

Compare the result side by side with the original references. Check defining geometry,
proportions, materials, color relationships, print content/placement, labels, decoration,
and included parts. For food, check shape, layers, topping arrangement and apparent
portion; for packaging, check structure and visible design. Do not beautify the item
by inventing features the buyer will not receive.

Accept small rendering differences and lighting/perspective changes that leave those
features intact. Reject a different cut, altered print, added decoration, missing part,
changed product color, or another product that merely belongs to the same category.
Do not promise exact pixels or fail an image simply because its pixels differ.

For corrections, regenerate the entire advertisement from the original references
and complete prompt, naming the discrepancy and retaining all required copy and blocks.
Do not use the generated result as an edit target, inpaint it, or patch its text.
Apply the main skill's limit of two regeneration rounds. If still unsuccessful,
report the limitation or request a clearer source; do not switch to compositing.

Verify supported references, sizes and metadata against the actual tool/model.
Use the image tool's required invocation workflow. If it cannot generate the complete
piece, report the limitation instead of splitting production into stages.

## Palette and photographic direction

- Preserve product colors and approved brand colors. Assign scene and graphic roles
  separately: background, product, supporting objects, headline, price/action, logo.
- An accent can appear in a prop or graphic element when the contract calls for it;
  it is not reserved universally for either one.
- Keep product colors unchanged. Record any measured area ratios with their method;
  do not claim unmeasured ratios.
- Judge saturation in relation to the source and brand. Avoid undefined “chroma percent”
  thresholds; if measuring color, record the color space and method.
- Name a physically consistent light source. Use camera or lens cues only when useful;
  grain, aberration, blown highlights, and brand-name cameras are optional, not proof
  that a photograph looks authentic.
- Keep campaign color treatment consistent where intended, with justified variations.

## Typography inside the single generation

Specify all advertising copy and typography in the initial prompt. Use approved fonts or
record the campaign choice without changing brand locks.
Use the selected composition’s required blocks and hierarchy from `composiciones.md`,
plus the logo. Do not force arguments, conditions, or panel labels into three copy roles.
Establish hierarchy by size, weight, spacing, and placement; extra copy must earn its
space through the brief and remain legible at expected viewing size.

Request copy on a quiet region. If contrast fails, specify a controlled backing in
the corrected prompt and regenerate the entire piece. Outlines, shadows,
mascots, and decorative treatments are allowed when justified by brand or message and
legible in the export. Do not apply them as automatic filler.

Use exact supplied or approved wording and inspect every letter in the result.
A spelling or commercial-fact error requires full-piece regeneration, never replacement
in a layout tool. Apply the same fidelity checks to existing text on the product.

For this workflow, use a conservative target of at least 4.5:1 for all advertising copy.
Measure against the actual background under the text when tools permit. For variable
backgrounds, use the least contrasting region or a controlled backing. Record the
measurement method; if only visually inspected, say so and do not claim a measured
ratio or accessibility certification. Evaluate logo visibility separately.

## Format, safe zones, and final review

Use brief-specified dimensions. Common working canvases include 1080×1350 for 4:5
and 1080×1920 for 9:16; these are examples, not universal platform requirements.
Verify current official placement guidance when platform compliance matters. Record
the placement, source/date, and margins in `direction.md`. Do not reuse story margins
for every interface or assume that every profile grid crops to square.

When placement guidance is unavailable, state the assumption and use a conservative
working margin with a destination preview where available. Do not claim it is verified.
Typography, margin, and copy-area ratios are design choices, not measured quality gates.

After exporting, inspect full size and expected viewing size. Verify product details,
spelling and commercial facts, hierarchy, contrast, logo, crop/overlays, and dimensions.
Every full regeneration requires repeating all checks. No post-generation visual edits are allowed.
