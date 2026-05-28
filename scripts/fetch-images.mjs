/**
 * Ejecutar una sola vez para pre-fetchar imágenes de Unsplash
 * y guardar la URL en el frontmatter de cada artículo.
 *
 * Uso: node scripts/fetch-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');

const env = loadEnv('production', ROOT, '');
const ACCESS_KEY = env.UNSPLASH_ACCESS_KEY;

if (!ACCESS_KEY) {
  console.error('❌  UNSPLASH_ACCESS_KEY no encontrada en .env');
  process.exit(1);
}

async function fetchUnsplash(query) {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '1');
  url.searchParams.set('orientation', 'landscape');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });

  if (!res.ok) {
    console.warn(`  ⚠️  API error ${res.status} para query: "${query}"`);
    return null;
  }

  const data = await res.json();
  const photo = data.results?.[0];
  if (!photo) return null;

  // Construir URL con parámetros de tamaño para no depender del CDN de Unsplash
  const imgUrl = `${photo.urls.raw}&w=1200&h=630&fit=crop&q=80&auto=format`;
  return {
    url: imgUrl,
    autor: photo.user.name,
    autorLink: photo.links.html,
  };
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return { raw: match[1], body: content.slice(match[0].length) };
}

function extractField(rawFm, field) {
  const match = rawFm.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return match ? match[1].replace(/^['"]|['"]$/g, '').trim() : null;
}

function extractMultilineField(rawFm, field) {
  // Soporta arrays YAML simples
  const start = rawFm.indexOf(`${field}:`);
  if (start === -1) return null;
  const lines = rawFm.slice(start).split('\n');
  const items = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].startsWith('  - ')) {
      items.push(lines[i].replace('  - ', '').replace(/^['"]|['"]$/g, '').trim());
    } else break;
  }
  return items.length ? items.join(' ') : null;
}

function setOrUpdateField(rawFm, field, value) {
  const regex = new RegExp(`^${field}:.*$`, 'm');
  const newLine = `${field}: "${value}"`;
  if (regex.test(rawFm)) {
    return rawFm.replace(regex, newLine);
  }
  // Insertar antes de "publicado:"
  return rawFm.replace(/^publicado:/m, `${newLine}\npublicado:`);
}

async function processArticle(file) {
  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  const parsed = parseFrontmatter(content);
  if (!parsed) { console.log(`  ⚠️  Sin frontmatter: ${file}`); return; }

  const { raw: rawFm, body } = parsed;

  // Si ya tiene imagen guardada, saltar
  if (/^imagen:/m.test(rawFm)) {
    console.log(`  ✓  Ya tiene imagen: ${file}`);
    return;
  }

  // Obtener query
  const query = extractField(rawFm, 'unsplashQuery')
    ?? extractMultilineField(rawFm, 'keywords')
    ?? file.replace('.md', '').replace(/-/g, ' ');

  console.log(`  🔍  Buscando: "${query.slice(0, 60)}..."`);

  const photo = await fetchUnsplash(query);
  if (!photo) { console.log(`  ✗  Sin resultado para: ${file}`); return; }

  const newFm = setOrUpdateField(rawFm, 'imagen', photo.url);
  const newContent = `---\n${newFm}\n---${body}`;
  fs.writeFileSync(filePath, newContent, 'utf-8');

  console.log(`  ✅  ${file} → ${photo.autor} / Unsplash`);
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
console.log(`\n📸  Procesando ${files.length} artículos...\n`);

for (const file of files) {
  await processArticle(file);
  // Pequeña pausa para no saturar la API
  await new Promise(r => setTimeout(r, 300));
}

console.log('\n✅  Listo. Haz commit de los cambios en src/content/blog/\n');
