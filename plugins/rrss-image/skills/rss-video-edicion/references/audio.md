# Voice, music, and sound

Sound carries the story on TikTok: in TikTok's research with Kantar, 88% of users said
sound is essential to the experience. The video must also work muted, so audio
supports what the picture and text already say.

## Order of work

1. **Voice**: select takes, clean, and measure each line's duration. These durations
   fix the timeline.
2. **Music**: choose the track and the section whose energy fits the arc.
3. **Cuts** on the beat where there is no voice.
4. **Sound effects** at accents, last.

## Voice

- Intelligibility over everything: a viewer leaves bad audio faster than bad picture.
- Clean gently when needed: write a cleaned copy to `edicion/voz/` (for example
  `ffmpeg -i in.wav -af "highpass=f=80,afftdn=nr=10" out.wav`) and use that copy;
  never modify files in `material/`. Do not process until the voice sounds artificial.
- Voice-over files should already be normalized (about −16 LUFS each) so lines match
  each other; normalize the copy if they are not.
- One file per line for voice-over; never one long take for the whole video.
- Fill jump-cut gaps with the location's room tone (`X-<locacion>-ambiente`) so the
  background does not drop to digital silence.

## Music

- Only tracks with a commercial license. Record the source and license in
  `edicion.md`. A trending sound is used only when the user confirms it is available
  for commercial use on that platform (for example, TikTok's Commercial Music Library).
- Choose the window of the track by energy: low under the setup, rising at the turn,
  peak at the result. Loop or extend only at silent or phrase boundaries.
- End on a musical phrase, not mid-note; a hard stop works only if it lands on a beat.
- Under voice, music sits roughly 18–22 dB below it. The engine ducks automatically
  from `ducking` in `timeline.json`; adjust `base` and `underSpeech` and measure.

## Sound effects

- Subtle accents: a pop when text appears, a whoosh on a fast transition, a click, and
  above all the real product sound (frying, pouring, opening, tearing).
- Not on every cut. If every cut has a whoosh, none of them is an accent.

## Levels and verification

Targets (approximate, common for social platforms):

- Integrated loudness about −14 LUFS for the final mix.
- True peak at or below −1 dBTP.
- Voice sections with music measure within about 1 dB of the voice alone.

Measure, do not judge by impression:

```bash
# integrated loudness and true peak of the mix
ffmpeg -hide_banner -i borrador.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=summary -f null -

# level of one section (start 12 s, length 4 s)
ffmpeg -hide_banner -ss 12 -t 4 -i borrador.mp4 -af volumedetect -f null -

# silences longer than 0.4 s in the voice track (unintended gaps)
ffmpeg -hide_banner -i voz.wav -af silencedetect=noise=-40dB:d=0.4 -f null -
```

Record each measurement and its result in the «Verificación» section of `edicion.md`.
