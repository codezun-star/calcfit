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
    compress(),
  ],
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
