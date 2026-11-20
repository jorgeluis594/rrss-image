// Load a brand's effect scripts into the engine before checking or rendering.
//
//   node scripts/efectos.mjs <carpeta-de-la-marca>
//
// Copies <marca>/efectos/*.tsx into src/efectos/ and writes the registry that
// maps each file name (without extension) to its effect. Run it again after
// adding or changing a script. A brand without efectos/ leaves the engine with
// no effects, which is valid.

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [brandDir] = process.argv.slice(2);
if (!brandDir) {
  console.error('Uso: node scripts/efectos.mjs <carpeta-de-la-marca>');
  process.exit(1);
}
const source = path.join(brandDir, 'efectos');
const target = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'efectos');
mkdirSync(target, { recursive: true });
for (const file of readdirSync(target)) if (file.endsWith('.tsx')) rmSync(path.join(target, file));

const names = existsSync(source)
  ? readdirSync(source).filter((f) => f.endsWith('.tsx')).map((f) => f.slice(0, -4)).sort()
  : [];
const bad = names.filter((n) => !/^[a-z0-9-]+$/.test(n));
if (bad.length > 0) {
  console.error(`Nombres no válidos (solo minúsculas, números y guiones): ${bad.join(', ')}`);
  process.exit(1);
}
names.forEach((n) => copyFileSync(path.join(source, `${n}.tsx`), path.join(target, `${n}.tsx`)));
const lines = [
  '// Written by scripts/efectos.mjs; do not edit.',
  "import type { Effect } from '../kit';",
  ...names.map((n, i) => `import e${i} from './${n}';`),
  '',
  `export const effects: Record<string, Effect> = {${names.map((n, i) => ` '${n}': e${i}`).join(',')} };`,
  '',
];
writeFileSync(path.join(target, 'registro.ts'), lines.join('\n'));
console.log(`${names.length} efectos cargados${names.length ? ': ' + names.join(', ') : ''}`);
