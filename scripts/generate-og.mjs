// Genera imágenes Open Graph (1200x630 JPG) de marca para cada calculadora.
// Lee los nombres reales desde src/lib/calcData.ts y rasteriza un SVG con sharp.
// Uso: node scripts/generate-og.mjs
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public', 'og');
mkdirSync(outDir, { recursive: true });

const INK = '#0F0E0D';
const CREAM = '#F5F1E8';
const ACID = '#CAFF00';
const MUTED = '#9a9a90';
const FONT = 'DejaVu Sans, FreeSans, sans-serif';

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Parte un texto en líneas de como mucho `max` caracteres respetando palabras.
function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}

function buildSvg(nombre, desc) {
  const upper = nombre.toUpperCase();
  // Ajuste de tamaño de fuente y wrap según longitud
  let fontSize, maxChars;
  if (upper.length <= 13) { fontSize = 102; maxChars = 13; }
  else if (upper.length <= 24) { fontSize = 82; maxChars = 15; }
  else { fontSize = 62; maxChars = 20; }
  const lines = wrap(upper, maxChars).slice(0, 3);
  const lineHeight = fontSize * 1.04;
  const blockHeight = lines.length * lineHeight;
  const startY = 300 - blockHeight / 2 + fontSize * 0.8;
  const titleTspans = lines
    .map((l, i) => `<tspan x="80" y="${Math.round(startY + i * lineHeight)}">${esc(l)}</tspan>`)
    .join('');

  const descLines = wrap(desc, 56).slice(0, 2);
  const descTspans = descLines
    .map((l, i) => `<tspan x="80" y="${470 + i * 38}">${esc(l)}</tspan>`)
    .join('');

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${INK}"/>
  <rect x="0" y="0" width="14" height="630" fill="${ACID}"/>
  <text x="80" y="96" font-family="${FONT}" font-size="36" font-weight="bold" fill="${CREAM}" letter-spacing="1">Calc<tspan fill="${ACID}">Fit</tspan></text>
  <text font-family="${FONT}" font-size="${fontSize}" font-weight="bold" fill="${CREAM}" letter-spacing="1">${titleTspans}</text>
  <text font-family="${FONT}" font-size="30" fill="${MUTED}">${descTspans}</text>
  <text x="80" y="572" font-family="${FONT}" font-size="25" font-weight="bold" fill="${ACID}" letter-spacing="1">Gratis · Sin registro · Validada cientificamente</text>
  <g transform="translate(1024,398)" opacity="0.92">
    <rect x="62" y="0" width="28" height="150" fill="${ACID}"/>
    <rect x="0" y="61" width="150" height="28" fill="${ACID}"/>
  </g>
</svg>`;
}

async function render(filename, nombre, desc) {
  const svg = buildSvg(nombre, desc);
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(join(outDir, filename));
}

// --- Extraer calculadoras desde calcData.ts ---
const data = readFileSync(join(root, 'src', 'lib', 'calcData.ts'), 'utf-8');
const re = /\{\s*slug:\s*'([^']+)',\s*nombre:\s*'([^']+)',\s*desc:\s*'([^']+)'/g;
const calcs = [];
let m;
while ((m = re.exec(data)) !== null) {
  calcs.push({ slug: m[1].replace(/^\//, ''), nombre: m[2], desc: m[3] });
}

const main = async () => {
  let count = 0;
  for (const c of calcs) {
    await render(`${c.slug}.jpg`, c.nombre, c.desc);
    count++;
  }
  // OG por defecto (homepage y fallback)
  await render('default.jpg', 'Calculadoras de Salud', '141 calculadoras gratuitas, validadas cientificamente. Sin registro.');
  console.log(`✓ Generadas ${count} imagenes OG de calculadora + default.jpg en public/og/`);
};
main().catch((e) => { console.error(e); process.exit(1); });
