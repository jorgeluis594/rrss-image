# Generating scenes, clips, and voice-over

Use the image, video, and voice tools available in the session. Do not assume a
specific model; record the tool and model actually used in `rodaje.md` and `log.md`.
If no suitable tool is available for a scene, say so and propose a change request or
a filmed alternative.

## Consistency anchors (create once per video)

Before generating any clip, create and store in `material/referencias/`:

- **Product**: the real product photos supplied by the user, with their defining
  features listed (shape, colors, labels, parts). These are always supplied as
  references; never describe the product only in words.
- **Character sheet** per generated character: one image with front, three-quarter,
  and profile views, wardrobe, and hair, approved by the user before clip generation.
- **Location sheet** per generated location: one wide frame and its light description.

Reuse the same anchors and the same light description in every prompt of the video.

## Method per shot

1. **Image-to-video from the approved storyboard frame** (preferred). The keyframe
   fixes the product, character, and composition; the prompt describes only motion.
2. **Reference-guided video** with product and character references when the tool
   supports it and no keyframe exists.
3. **Text-to-video** only for shots without the product and without a recurring
   character (textures, ambience, abstract transitions).

## Prompt structure

```text
Shot <ID>, scene <N> (<function>), vertical 9:16, <duration> s.
Start frame: <the supplied keyframe> | <subject, placement, setting>.
Action: <one main action, physically plausible, with timing>.
Camera: <one movement from the script vocabulary: fixed, slow push-in, pan, handheld>.
Product: <keep identical to the references: shape, colors, label, contents>.
Character: <keep identical to the character sheet>.
Light: <location light description>.
No on-screen text, subtitles, logos, or watermarks.
```

## Rules

- One shot per clip and one camera movement per clip. Clips of 3–6 s keep motion and
  identity more stable; longer actions are split into shots and joined in editing.
- Generate natively in 9:16 at the highest resolution the tool allows.
- Generate the scene's coverage as separate clips (another angle or shot size), so
  editing can cut as in a filmed scene.
- Prefer actions models handle well (pour, turn, walk, reveal, steam) over complex
  hand manipulation or text on moving objects.
- A generated character speaking on camera needs a tool with lip sync. Without it,
  write the line as voice-over and raise a change request if the script requires
  speech to camera.
- Never add advertising text inside the clip; editing adds it.

## Review of each clip

| Check | Remedy |
| --- | --- |
| Product changes shape, color, label, or parts during the clip | Regenerate from the keyframe with the product references; shorten the clip |
| Anatomy (hands, faces), physics (liquids, contact, shadows) | Regenerate; simplify the action |
| Character or location differs from the anchors | Regenerate with the anchors |
| Flicker, morphing, warped text on real product labels | Regenerate; if only the last frames fail, record the usable in/out points for editing |
| Motion does not match the script or the neighboring shots | Regenerate with a clearer action and timing |

Regenerate the whole clip rather than patching it, at most two times after the first
attempt. Recording usable in/out points so editing trims a clean segment is allowed;
hiding a product defect is not. Mark generated clips with `fuente: generado` in
`material.md` so editing can apply the platform's AI-generated content label.

## Voice-over

Scenes with `voz: <talento> en off` need a voice file per line:

- Recorded voice: the person records each line in a quiet place, two takes, with the
  scene's intention; a phone close to the mouth or a lavalier is enough.
- Synthetic voice (TTS): use the available text-to-speech tool with a voice that fits
  `MARCA.md` and keep the same voice for the whole video. Literal lines are generated
  exactly; natural lines may be lightly adapted for rhythm without changing meaning.
- Name files `material/voz/E<NN>_<talento>.<ext>` and index them in `material.md`
  with duration. If a line runs longer than its scene, report it; do not speed the
  voice beyond natural pace.
