// Build a self-contained, shareable HTML page from a page spec (JSON).
//
//   node construir.mjs <hoja.json> [--salida <archivo.html>] [--max-mb 12]
//
// The spec holds the content (blocks) and the brand look (colors and fonts).
// Images and clips named in the spec are shrunk with ffmpeg and embedded as data
// URIs, so the page opens anywhere (an Artifact, a browser, a file sent by chat)
// without other files. Paths in the spec are relative to the JSON file.
//
// Prints one JSON line: { ok, salida, bytes, medios: [{archivo, bytes}] }.
// Fails (exit 1) when a file is missing, ffmpeg fails, or the page exceeds --max-mb.

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve, join, extname, basename } from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const input = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!input) {
  console.error('Uso: node construir.mjs <hoja.json> [--salida <archivo.html>] [--max-mb 12]');
  process.exit(1);
}
const specPath = resolve(input);
const baseDir = dirname(specPath);
const outPath = resolve(option('salida', specPath.replace(/\.json$/i, '') + '.html'));
const maxBytes = Number(option('max-mb', '12')) * 1024 * 1024;

const fail = (msg) => {
  console.log(JSON.stringify({ ok: false, error: msg }));
  process.exit(1);
};

let spec;
try {
  spec = JSON.parse(readFileSync(specPath, 'utf8'));
} catch (e) {
  fail(`No se pudo leer ${specPath}: ${e.message}`);
}

// ---------- text helpers ----------
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
// Inline: **bold**, line breaks.
const txt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

// ---------- media ----------
const tmp = mkdtempSync(join(tmpdir(), 'rss-hojas-'));
const medios = [];
const cache = new Map();

function ffmpeg(argv) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...argv], { encoding: 'utf8' });
  if (r.error) fail(`ffmpeg no está disponible: ${r.error.message}`);
  if (r.status !== 0) fail(`ffmpeg falló: ${r.stderr.trim().split('\n').slice(-3).join(' | ')}`);
}

function embed(file, { video = false, ancho = 360, desde = 0, segundos = 4 } = {}) {
  const src = resolve(baseDir, file);
  if (!existsSync(src)) fail(`No existe el archivo: ${src}`);
  const key = JSON.stringify([src, video, ancho, desde, segundos]);
  if (cache.has(key)) return cache.get(key);
  const out = join(tmp, `m${cache.size}${video ? '.mp4' : '.jpg'}`);
  const isSvg = extname(src).toLowerCase() === '.svg';
  let uri;
  if (isSvg) {
    uri = `data:image/svg+xml;base64,${readFileSync(src).toString('base64')}`;
  } else if (video) {
    ffmpeg([
      '-ss', String(desde), '-t', String(segundos), '-i', src, '-an',
      '-vf', `scale=${ancho}:-2:flags=lanczos,fps=15`,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '32', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', out,
    ]);
    uri = `data:video/mp4;base64,${readFileSync(out).toString('base64')}`;
  } else {
    ffmpeg(['-i', src, '-frames:v', '1', '-vf', `scale='min(${ancho * 2},iw)':-2`, '-q:v', '5', out]);
    uri = `data:image/jpeg;base64,${readFileSync(out).toString('base64')}`;
  }
  medios.push({ archivo: file, bytes: uri.length });
  cache.set(key, uri);
  return uri;
}

// ---------- brand tokens ----------
const marca = spec.marca ?? {};
const claro = marca.claro ?? {};
for (const k of ['fondo', 'texto', 'bloque', 'acento']) {
  if (!claro[k]) fail(`Falta marca.claro.${k} (color de la marca)`);
}
const oscuro = {
  fondo: `color-mix(in srgb, ${claro.bloque} 70%, black)`,
  texto: claro.fondo,
  bloque: claro.fondo,
  sobre_bloque: claro.texto,
  acento: claro.acento,
  ...(marca.oscuro ?? {}),
};
const tokens = (p, sobreBloque) => `--fondo:${p.fondo};--texto:${p.texto};--bloque:${p.bloque};--sobre-bloque:${sobreBloque};--acento:${p.acento};`;
const lightVars = tokens(claro, claro.sobre_bloque ?? claro.fondo);
const darkVars = tokens(oscuro, oscuro.sobre_bloque);

const fuentes = { titulo: 'Georgia', texto: 'system-ui', ...(marca.fuentes ?? {}) };
const fontsUrl =
  marca.google_fonts ??
  (() => {
    const fams = [...new Set([fuentes.titulo, fuentes.texto, fuentes.mano].filter(Boolean))].filter(
      (f) => !['Georgia', 'system-ui', 'serif', 'sans-serif', 'monospace'].includes(f),
    );
    if (!fams.length) return null;
    return `https://fonts.googleapis.com/css2?${fams.map((f) => `family=${f.trim().replace(/ /g, '+')}`).join('&')}&display=swap`;
  })();
const ff = (f, fallback) => `"${f}",${fallback}`;

// ---------- built-in drawings ----------
function dibujoCamaraLateral(e = {}) {
  const L = {
    pared: 'pared detrás de ti',
    altura: 'a la altura de tus ojos',
    celular: ['celular en vertical,', 'cámara trasera'],
    distancia: '1 metro',
    ...e,
  };
  const cel = Array.isArray(L.celular) ? L.celular : [L.celular];
  return `<svg viewBox="0 0 580 300" role="img" aria-label="Vista de costado: la persona sentada frente al celular en trípode, ${esc(L.distancia)}, ${esc(L.altura)}"><rect width="580" height="300" fill="var(--panel)"/>
<rect x="24" y="20" width="10" height="250" fill="var(--texto)"/><text x="44" y="38" class="dl">${esc(L.pared)}</text>
<line x1="0" y1="270" x2="580" y2="270" stroke="var(--texto)" stroke-width="3"/>
<rect x="60" y="150" width="14" height="80" rx="4" fill="var(--sil2)"/><rect x="60" y="216" width="90" height="14" rx="4" fill="var(--sil2)"/><line x1="105" y1="230" x2="105" y2="270" stroke="var(--sil2)" stroke-width="6"/>
<circle cx="112" cy="112" r="22" fill="var(--texto)"/><path d="M84 216 L84 160 Q84 138 112 138 Q140 138 140 160 L140 216Z" fill="var(--texto)"/><rect x="120" y="200" width="70" height="18" rx="8" fill="var(--texto)"/><rect x="174" y="210" width="16" height="60" rx="6" fill="var(--texto)"/>
<line x1="136" y1="110" x2="376" y2="110" stroke="var(--texto)" stroke-width="2" stroke-dasharray="6 6"/><text x="256" y="100" text-anchor="middle" class="dl">${esc(L.altura)}</text>
<rect x="380" y="86" width="14" height="48" rx="3" fill="var(--texto)"/><circle cx="378" cy="110" r="5" fill="var(--acento)" stroke="var(--texto)" stroke-width="2"/>
<line x1="387" y1="134" x2="387" y2="200" stroke="var(--texto)" stroke-width="4"/><line x1="387" y1="200" x2="352" y2="270" stroke="var(--texto)" stroke-width="4"/><line x1="387" y1="200" x2="422" y2="270" stroke="var(--texto)" stroke-width="4"/><line x1="387" y1="200" x2="387" y2="270" stroke="var(--texto)" stroke-width="4"/>
${cel.map((t, i) => `<text x="410" y="${100 + i * 18}" class="dl">${esc(t)}</text>`).join('')}
<line x1="140" y1="288" x2="380" y2="288" stroke="var(--texto)" stroke-width="2"/><line x1="140" y1="282" x2="140" y2="294" stroke="var(--texto)" stroke-width="2"/><line x1="380" y1="282" x2="380" y2="294" stroke="var(--texto)" stroke-width="2"/><rect x="216" y="278" width="88" height="20" fill="var(--panel)"/><text x="260" y="293" text-anchor="middle" class="dl b">${esc(L.distancia)}</text></svg>`;
}

function dibujoEncuadre(e = {}) {
  const L = {
    aire: 'aire sobre tu cabeza',
    aire2: 'aquí va el titular',
    ojos: 'tus ojos, aquí',
    pecho: 'pecho y manos a la vista',
    pecho2: 'abajo van los subtítulos',
    ...e,
  };
  return `<svg viewBox="0 0 270 480" role="img" aria-label="Cómo debe verse la persona en la pantalla del celular: ${esc(L.ojos)}, ${esc(L.aire)}, ${esc(L.pecho)}"><rect width="270" height="480" fill="var(--pared)" stroke="var(--texto)" stroke-width="3"/>
<circle cx="135" cy="190" r="46" fill="var(--sil)"/><path d="M20 480 C20 330 60 268 135 268 C210 268 250 330 250 480Z" fill="var(--sil)"/>
<rect x="24" y="34" width="222" height="70" fill="none" stroke="var(--texto)" stroke-width="2" stroke-dasharray="6 5"/><text x="135" y="64" text-anchor="middle" class="dl b">${esc(L.aire)}</text><text x="135" y="84" text-anchor="middle" class="dl">${esc(L.aire2)}</text>
<line x1="0" y1="180" x2="270" y2="180" stroke="var(--acento)" stroke-width="3"/><line x1="0" y1="180" x2="270" y2="180" stroke="var(--texto)" stroke-width="1"/><rect x="142" y="150" width="120" height="22" fill="var(--pared)"/><text x="258" y="166" text-anchor="end" class="dl b">${esc(L.ojos)}</text>
<rect x="0" y="400" width="270" height="80" fill="var(--texto)" opacity=".18"/><text x="135" y="436" text-anchor="middle" class="dl b">${esc(L.pecho)}</text><text x="135" y="456" text-anchor="middle" class="dl">${esc(L.pecho2)}</text></svg>`;
}

const silueta = `<svg viewBox="0 0 90 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><rect width="90" height="160" fill="var(--pared)"/><circle cx="45" cy="62" r="17" fill="var(--sil)"/><path d="M8 160 C8 112 22 92 45 92 C68 92 82 112 82 160Z" fill="var(--sil)"/></svg>`;

// ---------- blocks ----------
const NIVEL = { obligatorio: 'Obligatorio', recomendado: 'Recomendado', opcional: 'Opcional' };
const DECIR = { exacto: 'Decir exactamente', propias: 'Con tus palabras', 'sin-voz': 'Sin hablar' };

function figura(f) {
  let inner;
  if (f.dibujo === 'camara-lateral') inner = dibujoCamaraLateral(f.etiquetas);
  else if (f.dibujo === 'encuadre') inner = dibujoEncuadre(f.etiquetas);
  else if (f.archivo) inner = `<img src="${embed(f.archivo, { ancho: 480 })}" alt="${esc(f.alt ?? f.pie ?? '')}">`;
  else fail('Una figura necesita "dibujo" (camara-lateral | encuadre) o "archivo"');
  const cls = f.dibujo === 'encuadre' ? ' class="estrecha"' : '';
  return `<figure${cls}>${inner}${f.pie ? `<figcaption>${txt(f.pie)}</figcaption>` : ''}</figure>`;
}

function cuadro(c) {
  const pie = c.pie ? `<figcaption>${txt(c.pie)}</figcaption>` : '';
  const tit = c.texto_pantalla ? `<div class="tit">${txt(c.texto_pantalla)}</div>` : '';
  const ancho = c.ancho ? ' wide' : '';
  switch (c.tipo) {
    case 'persona':
      return `<figure class="tile"><div class="fr${c.cerca ? ' close' : ''}">${silueta}${tit}</div>${pie}</figure>`;
    case 'imagen': {
      const uri = embed(c.archivo, { ancho: c.ancho ? 420 : 240 });
      const cls = c.recorte === 'captura' ? 'fr cap' : 'fr esq';
      return `<figure class="tile${ancho}"><div class="${c.ancho ? 'frw' : cls}"><img src="${uri}" alt="">${tit}</div>${pie}</figure>`;
    }
    case 'video': {
      const uri = embed(c.archivo, { video: true, ancho: c.ancho ? 420 : 240, desde: c.desde ?? 0, segundos: c.segundos ?? 4 });
      const v = `<video src="${uri}" autoplay muted loop playsinline aria-hidden="true"></video>`;
      if (c.ancho) return `<figure class="tile wide"><div class="frw">${v}</div>${pie}</figure>`;
      const cls = c.recorte === 'captura' ? 'fr capv' : 'fr';
      return `<figure class="tile"><div class="${cls}">${v}${tit}</div>${pie}</figure>`;
    }
    case 'nota':
      return `<figure class="tile"><div class="fr ph"><span>${txt(c.texto)}</span></div>${pie}</figure>`;
    default:
      fail(`Tipo de cuadro desconocido: ${c.tipo}`);
  }
}

const h = (t) => (t ? `<h3>${txt(t)}</h3>` : '');

const bloques = {
  portada(b) {
    let titulo = esc(b.titulo);
    if (b.resaltado && b.titulo.includes(b.resaltado)) titulo = titulo.replace(esc(b.resaltado), `<mark>${esc(b.resaltado)}</mark>`);
    const datos = (b.datos ?? []).map((d) => `<li><b>${esc(d.valor)}</b> ${txt(d.texto)}</li>`).join('');
    return `<header>${b.antetitulo ? `<div class="eyebrow">${esc(b.antetitulo)}</div>` : ''}<h1>${titulo}</h1>${b.bajada ? `<p class="lede">${txt(b.bajada)}</p>` : ''}${datos ? `<ul class="facts">${datos}</ul>` : ''}</header>`;
  },
  texto(b) {
    const ps = [].concat(b.texto ?? []).map((p) => `<p class="lede">${txt(p)}</p>`).join('');
    return `<section>${h(b.titulo)}${ps}</section>`;
  },
  figuras(b) {
    return `<section>${h(b.titulo)}<div class="cam">${b.figuras.map(figura).join('')}</div></section>`;
  },
  pasos(b) {
    const items = b.items
      .map((it) => {
        const o = typeof it === 'string' ? { texto: it } : it;
        const nv = o.nivel ? ` <span class="nv ${esc(o.nivel)}">${NIVEL[o.nivel] ?? esc(o.nivel)}</span>` : '';
        return `<li>${txt(o.texto)}${nv}</li>`;
      })
      .join('');
    return `<section>${h(b.titulo)}${b.bajada ? `<p class="lede">${txt(b.bajada)}</p>` : ''}<ol class="steps">${items}</ol></section>`;
  },
  lista(b) {
    return `<section>${h(b.titulo)}<ul class="list">${b.items.map((i) => `<li>${txt(i)}</li>`).join('')}</ul></section>`;
  },
  lectura(b) {
    const ps = b.frases.map((f, i) => `<p><span class="n s">${i + 1}</span><span>${txt(f)}</span></p>`).join('');
    return `<section>${h(b.titulo)}<div class="read">${ps}</div></section>`;
  },
  escenas(b) {
    const head = b.titulo || b.bajada ? `<section>${h(b.titulo)}${b.bajada ? `<p class="lede">${txt(b.bajada)}</p>` : ''}</section>` : '';
    const scenes = b.escenas
      .map((e, i) => {
        const tag = e.decir ? `<span class="tag${e.decir === 'exacto' ? ' ex' : ''}">${DECIR[e.decir] ?? esc(e.decir)}</span>` : '';
        const linea = e.linea ? `<p class="line">«${txt(e.linea)}»</p>` : '';
        const filas = (e.filas ?? []).map(([k, v]) => `<dt>${txt(k)}</dt><dd>${txt(v)}</dd>`).join('');
        return `<section class="scene"><header><span class="n">${e.n ?? i + 1}</span><h2>${txt(e.titulo)}</h2>${e.tiempo ? `<span class="t">${esc(e.tiempo)}</span>` : ''}</header>
<div class="say">${tag}${linea}${e.como ? `<p class="how">${txt(e.como)}</p>` : ''}${filas ? `<dl class="kv">${filas}</dl>` : ''}</div>
${e.cuadros?.length ? `<div class="tiles">${e.cuadros.map(cuadro).join('')}</div>` : ''}</section>`;
      })
      .join('\n');
    return head + scenes;
  },
  opciones(b) {
    const ops = b.opciones
      .map(
        (o) =>
          `<div class="op${o.elegida ? ' on' : ''}"><div class="op-h"><b>${txt(o.nombre)}</b>${o.elegida ? '<span class="tag ex">Elegido</span>' : ''}</div><p>${txt(o.texto)}</p>${o.detalle ? `<p class="op-d">${txt(o.detalle)}</p>` : ''}</div>`,
      )
      .join('');
    return `<section>${h(b.titulo)}${b.bajada ? `<p class="lede">${txt(b.bajada)}</p>` : ''}<div class="ops">${ops}</div></section>`;
  },
  tabla(b) {
    const th = b.columnas.map((c) => `<th>${txt(c)}</th>`).join('');
    const rows = b.filas.map((r) => `<tr>${r.map((c, i) => `<td data-l="${esc(b.columnas[i] ?? '')}">${txt(c)}</td>`).join('')}</tr>`).join('');
    return `<section>${h(b.titulo)}${b.bajada ? `<p class="lede">${txt(b.bajada)}</p>` : ''}<div class="tw"><table><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
  },
  fichas(b) {
    const cards = b.fichas
      .map((f) => `<div class="card"><h4>${txt(f.titulo)}</h4><dl class="kv">${(f.filas ?? []).map(([k, v]) => `<dt>${txt(k)}</dt><dd>${txt(v)}</dd>`).join('')}</dl></div>`)
      .join('');
    return `<section>${h(b.titulo)}<div class="cards">${cards}</div></section>`;
  },
  aviso(b) {
    return `<section class="aviso">${b.titulo ? `<h3>${txt(b.titulo)}</h3>` : ''}${[].concat(b.texto ?? []).map((p) => `<p>${txt(p)}</p>`).join('')}</section>`;
  },
};

if (!spec.titulo) fail('Falta "titulo" (2 a 4 palabras)');
if (!Array.isArray(spec.bloques) || !spec.bloques.length) fail('Falta "bloques"');
const body = spec.bloques
  .map((b) => {
    const fn = bloques[b.tipo];
    if (!fn) fail(`Tipo de bloque desconocido: ${b.tipo}`);
    return fn(b);
  })
  .join('\n');

const pieDePagina = spec.pie ? `<footer>${txt(spec.pie)}</footer>` : '';

const css = `
:root{${lightVars}
--panel:color-mix(in srgb,var(--texto) 9%,var(--fondo));--suave:color-mix(in srgb,var(--texto) 72%,var(--fondo));--linea:color-mix(in srgb,var(--texto) 25%,var(--fondo));
--pared:color-mix(in srgb,var(--fondo) 45%,white);--sil:color-mix(in srgb,var(--texto) 35%,var(--fondo));--sil2:color-mix(in srgb,var(--texto) 45%,var(--fondo));
--f-titulo:${ff(fuentes.titulo, 'Georgia,serif')};--f-texto:${ff(fuentes.texto, 'system-ui,sans-serif')};--f-mano:${fuentes.mano ? ff(fuentes.mano, 'cursive') : 'inherit'};color-scheme:light}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${darkVars}--pared:color-mix(in srgb,var(--fondo) 80%,white);color-scheme:dark}}
:root[data-theme="dark"]{${darkVars}--pared:color-mix(in srgb,var(--fondo) 80%,white);color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--fondo);color:var(--texto);font-family:var(--f-texto);font-size:15px;line-height:1.55;padding:32px max(16px,env(safe-area-inset-right,0px)) 64px max(16px,env(safe-area-inset-left,0px))}
main{max-width:980px;margin:0 auto;display:flex;flex-direction:column;gap:30px}
img{max-width:100%}
.eyebrow{font-size:13px;letter-spacing:.04em;color:var(--suave);text-transform:uppercase}
h1{font-family:var(--f-titulo);font-weight:400;font-size:clamp(30px,6vw,46px);line-height:1.1;margin:6px 0 10px;text-wrap:balance}
h1 mark{background:linear-gradient(transparent 58%,var(--acento) 58%);color:inherit}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) h1 mark{background:none;color:var(--acento)}}
:root[data-theme="dark"] h1 mark{background:none;color:var(--acento)}
h3{font-family:var(--f-titulo);font-weight:400;font-size:24px;margin:0 0 12px}
h4{font-family:var(--f-titulo);font-weight:400;font-size:19px;margin:0 0 8px}
.lede{max-width:64ch;margin:0 0 8px}
.facts{display:flex;flex-wrap:wrap;gap:8px 20px;margin:14px 0 0;padding:0;list-style:none;font-size:13px;color:var(--suave)}
.facts b{color:var(--texto)}
.cam{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,.8fr);gap:20px;align-items:start}
.cam figure{margin:0;min-width:0}
.cam svg,.cam img{display:block;width:100%;height:auto;border:1px solid var(--linea)}
.cam figure:only-child{grid-column:1/-1;max-width:640px}
figcaption{font-size:13px;color:var(--suave);margin-top:6px}
.dl{font-family:var(--f-texto);font-size:13px;fill:var(--texto)}.dl.b{font-weight:700}
ol.steps,ul.list{margin:8px 0 0;padding-left:1.4em;display:flex;flex-direction:column;gap:6px;max-width:68ch}
.nv{display:inline-block;font-size:11px;letter-spacing:.04em;text-transform:uppercase;padding:0 6px;margin-left:4px;border:1px solid var(--texto);vertical-align:1px}
.nv.obligatorio{background:var(--texto);color:var(--fondo)}
.nv.opcional{border-style:dashed;color:var(--suave);border-color:var(--suave)}
.read{background:var(--bloque);color:var(--sobre-bloque);padding:22px 24px;display:flex;flex-direction:column;gap:10px}
.read p{margin:0;font-size:17px;line-height:1.5;max-width:64ch;display:flex;gap:12px}
.n{font-family:var(--f-titulo);font-size:20px;min-width:1.4em}
.n.s{font-size:15px;opacity:.7;padding-top:2px}
.scene{border-top:2px solid var(--texto);padding-top:14px}
.scene header{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:10px}
.scene h2{font-family:var(--f-titulo);font-weight:400;font-size:22px;margin:0;flex:1}
.t{font-size:13px;color:var(--suave);font-variant-numeric:tabular-nums}
.line{font-size:19px;line-height:1.45;margin:8px 0 6px;max-width:60ch}
.how{font-family:var(--f-mano);font-size:${fuentes.mano ? '23px' : '15px'};${fuentes.mano ? '' : 'font-style:italic;'}line-height:1.2;margin:0 0 14px;color:var(--suave)}
.tag{display:inline-block;font-size:12px;letter-spacing:.05em;text-transform:uppercase;border:1px solid var(--texto);padding:1px 8px}
.tag.ex{background:var(--texto);color:var(--fondo)}
.kv{display:grid;grid-template-columns:max-content 1fr;gap:4px 14px;margin:6px 0 12px;font-size:14px}
.kv dt{color:var(--suave)}.kv dd{margin:0}
.tiles{display:flex;flex-wrap:wrap;gap:12px}
.tile{margin:0;width:132px}
.tile.wide{width:min(100%,420px)}
.tile figcaption{font-size:11.5px;line-height:1.3}
.fr{position:relative;aspect-ratio:9/16;overflow:hidden;border:1px solid var(--texto);background:var(--pared)}
.fr>svg,.fr>video,.fr.esq>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fr.close>svg{transform:scale(1.35);transform-origin:50% 42%}
.tit{position:absolute;left:8%;right:8%;top:9%;background:${claro.fondo};color:${claro.texto};font-family:var(--f-titulo);font-size:11px;line-height:1.2;padding:5px 6px;text-align:center;border:1px solid ${claro.texto}}
.fr.cap,.fr.capv,.fr.ph{background:${claro.bloque};display:grid;place-items:center}
.fr.cap img,.fr.capv video{position:static;width:86%;height:auto;max-height:88%;object-fit:contain;border:2px solid ${claro.fondo};transform:rotate(-1.5deg)}
.fr.ph span{color:${claro.fondo};font-size:12px;text-align:center;border:1px dashed ${claro.fondo};padding:14px 8px;margin:8px}
.frw{border:1px solid var(--texto);background:${claro.bloque}}.frw video,.frw img{display:block;width:100%;height:auto}
.ops{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
.op{border:1px solid var(--linea);padding:12px 14px}.op.on{border:2px solid var(--texto);background:var(--panel)}
.op-h{display:flex;justify-content:space-between;gap:8px;align-items:center}.op p{margin:6px 0 0}.op-d{font-size:13px;color:var(--suave)}
.tw{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:14px}
th{text-align:left;font-weight:700;border-bottom:2px solid var(--texto);padding:6px 8px;vertical-align:bottom}
td{border-bottom:1px solid var(--linea);padding:8px;vertical-align:top}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
.card{background:var(--panel);padding:14px 16px}
.aviso{background:var(--bloque);color:var(--sobre-bloque);padding:20px 24px}.aviso p{margin:6px 0 0;max-width:64ch}.aviso h3{margin-bottom:4px}
footer{font-size:12px;color:var(--suave);border-top:1px solid var(--linea);padding-top:10px}
@media (max-width:680px){.cam{grid-template-columns:1fr}.cam .estrecha{max-width:220px}.tile{width:104px}
table,thead,tbody,tr,td{display:block}thead{display:none}tr{border-bottom:1px solid var(--linea);padding:6px 0}td{border:0;padding:2px 0}td::before{content:attr(data-l);display:block;font-size:11px;color:var(--suave);text-transform:uppercase;letter-spacing:.04em}}
`;

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(spec.titulo)}</title>
${fontsUrl ? `<link rel="stylesheet" href="${esc(fontsUrl)}">` : ''}
<style>${css}</style></head>
<body><main>
${body}
${pieDePagina}
</main></body></html>
`;

rmSync(tmp, { recursive: true, force: true });
const bytes = Buffer.byteLength(html);
if (bytes > maxBytes) {
  const top = [...medios].sort((a, b) => b.bytes - a.bytes).slice(0, 5);
  fail(`La página pesa ${(bytes / 1048576).toFixed(1)} MB (máximo ${maxBytes / 1048576} MB). Acorta o quita clips: ${top.map((m) => `${basename(m.archivo)} ${(m.bytes / 1048576).toFixed(1)} MB`).join(', ')}`);
}
writeFileSync(outPath, html);
console.log(JSON.stringify({ ok: true, salida: outPath, bytes, medios }));
