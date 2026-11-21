// Measure how someone speaks from word-level timings.
//
//   node medir-habla.mjs <palabras.json> [--audio <archivo>] [--pausa 0.35] [--desde 0] [--hasta <s>]
//
// <palabras.json> is the output of the video engine's transcribir.mjs:
// { "words": [{ "text", "start", "end" }] } in seconds. Prints JSON with speed,
// pauses, and sentence lengths. --desde/--hasta limit the range (for example one
// answer inside a longer recording).
//
// Pauses: whisper.cpp word timings are contiguous, so gaps between words hide the
// pauses. With --audio (the recording itself, audio or video) pauses are measured
// as silences with ffmpeg; this only works on a voice without music. Without
// --audio they come from word gaps and "fuente" says so: treat them as a floor.

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const input = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!input) {
  console.error('Uso: node medir-habla.mjs <palabras.json> [--pausa 0.35] [--desde 0] [--hasta <s>]');
  process.exit(1);
}
const minPause = Number(option('pausa', '0.35'));
const from = Number(option('desde', '0'));
const to = Number(option('hasta', 'Infinity'));

const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const median = (list) => {
  if (list.length === 0) return 0;
  const s = [...list].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// A token counts as a word only if it has a letter or a digit (drops loose punctuation).
const isWord = (t) => /[\p{L}\p{N}]/u.test(t);
const words = JSON.parse(readFileSync(input, 'utf8')).words.filter(
  (w) => isWord(w.text) && w.start >= from && w.end <= to,
);
if (words.length === 0) {
  console.error('No hay palabras en ese rango.');
  process.exit(1);
}

const first = words[0].start;
const last = words[words.length - 1].end;
const span = last - first;

const audio = option('audio', null);
const pauses = [];
if (audio) {
  // silencedetect logs to stderr; -f null discards the output.
  const run = spawnSync(
    'ffmpeg',
    ['-hide_banner', '-nostats', '-i', audio, '-vn', '-af', `silencedetect=noise=-30dB:d=${minPause}`, '-f', 'null', '-'],
    { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' },
  );
  if (run.status !== 0) {
    console.error(`ffmpeg no pudo leer el audio: ${audio}`);
    process.exit(1);
  }
  const log = run.stderr;
  const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  starts.forEach((start, i) => {
    const end = ends[i];
    // Only silences inside the speech: not the lead-in or the tail.
    if (end === undefined || start <= first || end >= last) return;
    const mid = (start + end) / 2;
    const next = words.findIndex((w) => (w.start + w.end) / 2 > mid);
    pauses.push({
      en: round(start),
      dura: round(end - start),
      despues_de: next > 0 ? words[next - 1].text : null,
      antes_de: next >= 0 ? words[next].text : null,
    });
  });
} else {
  for (let i = 1; i < words.length; i++) {
    const gap = words[i].start - words[i - 1].end;
    if (gap >= minPause) {
      pauses.push({
        en: round(words[i - 1].end),
        dura: round(gap),
        despues_de: words[i - 1].text,
        antes_de: words[i].text,
      });
    }
  }
}
const pauseTotal = pauses.reduce((sum, p) => sum + p.dura, 0);

// Sentences end at . ? ! or … attached to a word.
const sentences = [];
let current = [];
for (const w of words) {
  current.push(w);
  if (/[.?!…]["»)]?$/.test(w.text)) {
    sentences.push(current);
    current = [];
  }
}
if (current.length) sentences.push(current);
const lengths = sentences.map((s) => s.length);

// Speed in consecutive 5 s windows, to see where the speaker speeds up or slows down.
const windows = [];
for (let t = first; t < last; t += 5) {
  const end = Math.min(t + 5, last);
  if (end - t < 2) break;
  const count = words.filter((w) => w.start >= t && w.start < end).length;
  windows.push({ desde: round(t, 1), hasta: round(end, 1), palabras_por_segundo: round(count / (end - t)) });
}

const result = {
  palabras: words.length,
  primera_palabra_en: round(first),
  ultima_palabra_en: round(last),
  palabras_en_primeros_3s: words.filter((w) => w.start < from + 3).length,
  // Includes pauses: what a script's timing budget should use.
  palabras_por_segundo: round(words.length / span),
  // Excludes pauses: how fast the mouth moves while speaking.
  palabras_por_segundo_sin_pausas: round(words.length / Math.max(span - pauseTotal, 0.1)),
  pausas: {
    fuente: audio ? 'silencios del audio' : 'huecos entre palabras (subestima)',
    umbral: minPause,
    cantidad: pauses.length,
    por_minuto: round((pauses.length / span) * 60, 1),
    duracion_mediana: round(median(pauses.map((p) => p.dura))),
    lista: pauses,
  },
  frases: {
    cantidad: sentences.length,
    palabras_mediana: median(lengths),
    palabras_max: Math.max(...lengths),
    arranques: sentences.map((s) => s.slice(0, 3).map((w) => w.text).join(' ')),
  },
  velocidad_por_tramos: windows,
};
console.log(JSON.stringify(result, null, 2));
