// Check a timeline.json against the files in the video folder before rendering.
//
//   node scripts/validar.mjs <carpeta-del-video> [edicion/timeline.json]
//
// Prints one line per problem. Exit code 1 when any error is found; warnings
// alone exit 0.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const [videoDir, timelineArg = 'edicion/timeline.json'] = process.argv.slice(2);
if (!videoDir) {
  console.error('Uso: node scripts/validar.mjs <carpeta-del-video> [edicion/timeline.json]');
  process.exit(1);
}
const timelinePath = path.resolve(videoDir, timelineArg);
const t = JSON.parse(readFileSync(timelinePath, 'utf8'));
const errors = [];
const warnings = [];
const EPS = 1 / 30;

const durationCache = new Map();
const mediaDuration = (rel) => {
  if (!durationCache.has(rel)) {
    const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(videoDir, rel)]);
    durationCache.set(rel, Number(String(out).trim()));
  }
  return durationCache.get(rel);
};

const checkFile = (rel, where) => {
  if (!/^[A-Za-z0-9._/-]+$/.test(rel)) errors.push(`${where}: "${rel}" debe usar solo letras ASCII, números, . _ - /`);
  if (!existsSync(path.join(videoDir, rel))) {
    errors.push(`${where}: no existe ${rel}`);
    return false;
  }
  return true;
};

const clips = t.clips ?? [];
const total = t.duration ?? Math.max(0, ...clips.map((c) => c.start + c.duration));
if (clips.length === 0) errors.push('timeline: no hay clips');

clips.forEach((c, i) => {
  const where = `clips[${i}] ${c.src}`;
  if (!checkFile(c.src, where)) return;
  if (c.duration <= 0) errors.push(`${where}: duración no positiva`);
  if (c.duration > 4 + EPS && (c.track ?? 1) === 1) warnings.push(`${where}: plano de ${c.duration} s; el estándar pide cambiar cada 2–4 s`);
  if (c.kind !== 'image') {
    const needed = (c.in ?? 0) + c.duration * (c.speed ?? 1);
    const available = mediaDuration(c.src);
    if (needed > available + EPS) errors.push(`${where}: necesita hasta ${needed.toFixed(2)} s de fuente y el archivo dura ${available.toFixed(2)} s`);
  }
});

// The base track must cover the whole timeline, or black frames show through.
const base = clips.filter((c) => (c.track ?? 1) === 1).sort((a, b) => a.start - b.start);
let cursor = 0;
for (const c of base) {
  if (c.start > cursor + EPS) errors.push(`pista 1: hueco sin video entre ${cursor.toFixed(2)} y ${c.start.toFixed(2)} s`);
  if (c.start < cursor - EPS) warnings.push(`pista 1: ${c.src} se superpone con el clip anterior en ${c.start.toFixed(2)} s`);
  cursor = Math.max(cursor, c.start + c.duration);
}
if (cursor < total - EPS) errors.push(`pista 1: sin video desde ${cursor.toFixed(2)} hasta ${total.toFixed(2)} s`);

(t.texts ?? []).forEach((x, i) => {
  const where = `texts[${i}] "${x.text}"`;
  if (x.end <= x.start) errors.push(`${where}: termina antes de empezar`);
  if (x.end > total + EPS) errors.push(`${where}: termina después del video (${total} s)`);
  const words = x.text.split(/\s+/).filter(Boolean).length;
  if (words / (x.end - x.start) > 10) warnings.push(`${where}: ${words} palabras en ${(x.end - x.start).toFixed(1)} s; más de 10 palabras por segundo`);
  if (x.y !== undefined && (x.y < 200 / 1920 || x.y > 1 - 250 / 1920)) errors.push(`${where}: y=${x.y} cae en la zona de controles de la plataforma`);
});

(t.audio ?? []).forEach((a, i) => {
  const where = `audio[${i}] ${a.src}`;
  if (!checkFile(a.src, where)) return;
  const available = mediaDuration(a.src) - (a.in ?? 0);
  if (a.role === 'voz' && a.duration === undefined) errors.push(`${where}: la voz necesita "duration" para el ducking (archivo: ${available.toFixed(2)} s)`);
  if (a.duration !== undefined && a.duration > available + EPS) errors.push(`${where}: duration ${a.duration} s supera el audio disponible (${available.toFixed(2)} s)`);
  if (a.start + (a.duration ?? available) > total + EPS && a.role !== 'musica') warnings.push(`${where}: sigue sonando después del final del video`);
});

const words = t.captions?.words ?? [];
words.forEach((w, i) => {
  if (w.end < w.start) errors.push(`captions.words[${i}] "${w.text}": termina antes de empezar`);
  if (i > 0 && w.start < words[i - 1].start - EPS) errors.push(`captions.words[${i}] "${w.text}": fuera de orden`);
});

// Effects are scripts of the brand: <marca>/efectos/<name>.tsx, two levels above the video.
const effectsDir = path.resolve(videoDir, '..', '..', 'efectos');
(t.effects ?? []).forEach((e, i) => {
  const where = `effects[${i}] ${e.name}`;
  if (!/^[a-z0-9-]+$/.test(e.name ?? '')) errors.push(`${where}: el nombre debe usar solo minúsculas, números y guiones`);
  else if (!existsSync(path.join(effectsDir, `${e.name}.tsx`))) errors.push(`${where}: no existe ${path.join(effectsDir, `${e.name}.tsx`)}`);
  if (!(e.end > e.start)) errors.push(`${where}: termina antes de empezar`);
  if (e.end > total + EPS) errors.push(`${where}: termina después del video (${total} s)`);
});

const capY = t.captions?.y;
if (capY !== undefined && (capY < 200 / 1920 || capY > 1 - 250 / 1920)) errors.push(`captions: y=${capY} cae en la zona de controles de la plataforma`);
(t.captions?.hide ?? []).forEach(([a, b], i) => {
  if (!(b > a)) errors.push(`captions.hide[${i}]: termina antes de empezar`);
});

for (const file of [t.brand?.fontFile, t.brand?.captionFontFile].filter(Boolean)) checkFile(file, 'brand');

errors.forEach((e) => console.log(`ERROR  ${e}`));
warnings.forEach((w) => console.log(`AVISO  ${w}`));
console.log(`${errors.length} errores, ${warnings.length} avisos · duración ${total.toFixed(2)} s`);
process.exit(errors.length > 0 ? 1 : 0);
