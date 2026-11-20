# Storyboard

The storyboard lets the user see the video before anything is filmed or generated,
and gives generated scenes their first-frame reference. One frame per scene, in
script order, 9:16.

## What each frame shows

- The scene's main shot: `plano`, `angulo`, subject placement, and the moment of the
  action that best represents the scene (for a movement, its start or its peak).
- The real product when it appears, recognizable and with its defining features.
- Space for the on-screen text inside the central safe area, without rendering the
  text. Text, scene number, time, and line go in the presentation to the user, not
  inside the image.

## Methods

Use the first method that fits the scene and the available tools:

1. **Generated frame** with an image model that accepts references. Supply the real
   product photos, the character reference, and the location reference (see
   `generacion.md`). Apply the same product-identity rules as `$rss-image-generar`:
   same product and variant, no invented parts, no pasted cutouts.
2. **Photo of the real location or product**, framed as the shot and annotated in
   the presentation.
3. **Written frame** (shot, subject, action, placement) when no image tool is
   available. Say so to the user.

## Real people

Do not generate the likeness of an identifiable real person (actor, owner, staff)
unless the user supplied their photo for this purpose and confirms consent. Otherwise
use a neutral stand-in figure with the same wardrobe and position, and note it.

## Consistency

Frames of the same character, location, and product must look like the same
character, place, and product across scenes: reuse the same references and the same
light description per location. Inconsistency in the storyboard becomes inconsistency
in generated clips.

## For generated scenes

When the scene's `fuente` is `generado`, the approved storyboard frame is the first
frame (keyframe) for image-to-video generation. Generate it at the final resolution
or the highest the tool allows, without text, and keep it in `storyboard/`.

## Review

Before presenting: product fidelity, anatomy and physics, shot matches the script,
safe area free for text, consistency with neighboring frames. Regenerate a frame
completely rather than patching it; at most two regenerations per frame.
