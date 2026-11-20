// Normalize the loudness of a rendered draft and write the publishable file.
//
//   node scripts/finalizar.mjs <borrador.mp4> <salida.mp4> [--lufs -14] [--pico -1.5]
//
// Two-pass loudnorm on the audio; the video stream is copied untouched.
// Prints the measured loudness before and after.

import { execFileSync, spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const [input, output] = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!input || !output) {
  console.error('Uso: node scripts/finalizar.mjs <borrador.mp4> <salida.mp4> [--lufs -14] [--pico -1.5]');
  process.exit(1);
}
const target = `I=${option('lufs', '-14')}:TP=${option('pico', '-1.5')}:LRA=11`;

// ffmpeg prints the loudnorm report as JSON at the end of stderr.
const measure = (file) => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-'], {
    encoding: 'utf8',
  });
  return JSON.parse(r.stderr.slice(r.stderr.lastIndexOf('{'), r.stderr.lastIndexOf('}') + 1));
};

const first = measure(input);
const filter = [
  `loudnorm=${target}`,
  `measured_I=${first.input_i}`,
  `measured_TP=${first.input_tp}`,
  `measured_LRA=${first.input_lra}`,
  `measured_thresh=${first.input_thresh}`,
  `offset=${first.target_offset}`,
  'linear=true',
].join(':');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', input, '-c:v', 'copy', '-af', filter, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', output]);

const result = measure(output);
console.log(`antes: ${first.input_i} LUFS, pico ${first.input_tp} dBTP`);
console.log(`después: ${result.input_i} LUFS, pico ${result.input_tp} dBTP → ${output}`);
