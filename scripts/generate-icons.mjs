// Genera los iconos PNG de la app instalable (manifest.webmanifest) a partir
// del diseño del favicon: cruz «+» acid sobre fondo ink.
// Uso: node scripts/generate-icons.mjs
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

const INK = '#0F0E0D';
const ACID = '#CAFF00';

// `scale`: fracción del lienzo que ocupa la cruz. Los iconos «maskable» la
// encogen para que quede dentro de la zona segura (círculo del 80 %) cuando
// Android recorta el icono en círculo, gota o cuadrado redondeado.
function crossSvg(size, scale) {
  const arm = size * scale;
  const bar = arm * (6 / 28); // mismas proporciones que public/favicon.svg
  const a = (size - arm) / 2;
  const b = (size - bar) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${INK}"/>
  <rect x="${b}" y="${a}" width="${bar}" height="${arm}" fill="${ACID}"/>
  <rect x="${a}" y="${b}" width="${arm}" height="${bar}" fill="${ACID}"/>
</svg>`;
}

const icons = [
  { file: 'icon-192.png', size: 192, scale: 0.72 },
  { file: 'icon-512.png', size: 512, scale: 0.72 },
  { file: 'icon-maskable-512.png', size: 512, scale: 0.5 },
];

for (const { file, size, scale } of icons) {
  await sharp(Buffer.from(crossSvg(size, scale))).png({ compressionLevel: 9 }).toFile(join(outDir, file));
  console.log(`✓ public/icons/${file}`);
}
