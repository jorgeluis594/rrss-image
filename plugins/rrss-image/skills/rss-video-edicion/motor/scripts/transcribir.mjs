// Transcribe speech into word-level timings for timeline.json captions.
//
//   node scripts/transcribir.mjs <entrada> <salida.json> [--modelo small] [--idioma es] [--desplazamiento 0]
//
// <entrada> is any audio or video file. The output is
// { "words": [{ "text", "start", "end" }] } in seconds; --desplazamiento adds
// the position of that file on the output timeline. Whisper.cpp and the model
// are installed on first use under $RRSS_WHISPER_DIR (default: whisper/ next
// to this engine).

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  downloadWhisperModel,
  installWhisperCpp,
  toCaptions,
  transcribe,
} from '@remotion/install-whisper-cpp';

const WHISPER_VERSION = '1.5.5';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const [input, output] = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!input || !output) {
  console.error('Uso: node scripts/transcribir.mjs <entrada> <salida.json> [--modelo small] [--idioma es] [--desplazamiento 0]');
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`No existe el archivo de entrada: ${input}`);
  process.exit(1);
}
const model = option('modelo', 'small');
const language = option('idioma', 'es');
const offset = Number(option('desplazamiento', '0'));
const engineDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const whisperDir = path.resolve(process.env.RRSS_WHISPER_DIR ?? path.join(engineDir, 'whisper'));

await installWhisperCpp({ to: whisperDir, version: WHISPER_VERSION });
await downloadWhisperModel({ model, folder: whisperDir });

// Whisper.cpp reads 16 kHz mono WAV only.
const work = mkdtempSync(path.join(tmpdir(), 'transcribir-'));
const wav = path.join(work, 'audio.wav');
try {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', input, '-vn', '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav]);
  const result = await transcribe({
    inputPath: wav,
    whisperPath: whisperDir,
    whisperCppVersion: WHISPER_VERSION,
    model,
    tokenLevelTimestamps: true,
    language,
    splitOnWord: true,
  });
  const { captions } = toCaptions({ whisperCppOutput: result });
  const words = captions
    .map((c) => ({
      text: c.text.trim(),
      start: Math.round((c.startMs / 1000 + offset) * 1000) / 1000,
      end: Math.round((c.endMs / 1000 + offset) * 1000) / 1000,
    }))
    .filter((w) => w.text.length > 0);
  writeFileSync(output, JSON.stringify({ words }, null, 2) + '\n');
  console.log(`${words.length} palabras → ${output}`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
