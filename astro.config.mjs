import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Pre-build map of blog slug → fecha for accurate sitemap lastmod
const blogDir = fileURLToPath(new URL('./src/content/blog', import.meta.url));
const blogDates = {};
try {
  const files = readdirSync(blogDir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const content = readFileSync(join(blogDir, file), 'utf-8');
    const match = content.match(/^fecha:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
    if (match) blogDates[file.replace(/\.md$/, '')] = match[1];
  }
} catch {}

export default defineConfig({
  site: 'https://www.calcfit.com',
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        const SITE = 'https://www.calcfit.com';
        const BUILD_DATE = new Date();
        const STATIC_PAGES = new Set(['aviso-legal', 'politica-privacidad', 'politica-cookies', 'contacto', 'sobre-nosotros']);
        const CATEGORY_PAGES = new Set(['fitness', 'embarazo', 'fechas', 'nutricion']);
        const path = item.url.replace(SITE, '').replace(/^\//, '').replace(/\/$/, '');

        // Homepage
        if (path === '') return { ...item, lastmod: BUILD_DATE, changefreq: 'weekly', priority: 1.0 };

        // Artículo de blog individual (lastmod real desde el frontmatter)
        const blogMatch = item.url.match(/\/blog\/([^/]+)$/);
        if (blogMatch && blogDates[blogMatch[1]]) {
          return { ...item, lastmod: new Date(blogDates[blogMatch[1]] + 'T00:00:00Z'), changefreq: 'monthly', priority: 0.7 };
        }
        // Índice y paginación del blog
        if (path === 'blog' || /^blog\/\d+$/.test(path)) {
          return { ...item, lastmod: BUILD_DATE, changefreq: 'weekly', priority: 0.7 };
        }
        // Páginas de categoría (incluida su paginación)
        if (CATEGORY_PAGES.has(path.split('/')[0])) {
          return { ...item, lastmod: BUILD_DATE, changefreq: 'weekly', priority: 0.6 };
        }
        // Páginas estáticas y legales
        if (STATIC_PAGES.has(path)) {
          return { ...item, lastmod: BUILD_DATE, changefreq: 'yearly', priority: 0.3 };
        }
        // Calculadoras (resto)
        return { ...item, lastmod: BUILD_DATE, changefreq: 'monthly', priority: 0.8 };
      },
    }),
    compress({
      HTML: {
        'html-minifier-terser': {
          // Los tres ajustes siguientes existen porque el minificador reescribía
          // el HTML *dentro* de las islas de React y rompía la hidratación
          // (error #418 en la home: la isla entera se descartaba y se volvía a
          // pintar en cliente). No tocar sin comprobar la hidratación después.
          //
          // 1. minifyCSS pasaba cada atributo `style` por clean-css y lo
          //    devolvía normalizado, distinto del que React esperaba.
          minifyCSS: false,
          // 2. sortAttributes/sortClassName reordenaban los atributos de los SVG
          //    que los iconos inyectan con dangerouslySetInnerHTML.
          sortAttributes: false,
          sortClassName: false,
          // 3. collapseWhitespace se comía el espacio final de los nodos de texto
          //    ("Mostrando " + 15 + " de " + 63). Conservador: colapsa varios
          //    espacios en uno, pero nunca los elimina.
          conservativeCollapse: true,
          // React separa dos nodos de texto contiguos con un comentario vacío.
          // Se conservan sólo esos; los comentarios redactados a mano se siguen
          // eliminando. El resto de la lista son los valores por defecto de
          // astro-compress, que hay que repetir porque el array se sustituye.
          ignoreCustomComments: [
            /^\s*$/,
            /^\s*#/,
            /.*\$.*/,
            /^\s*\[/,
            /^\s*\]/,
            /^\s*!/,
            /^\s*\//,
            /^\s*astro:.*/,
            /^\s*astro:end/,
          ],
        },
      },
    }),
  ],
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
