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
      changefreq: 'monthly',
      priority: 0.8,
      serialize(item) {
        const blogMatch = item.url.match(/\/blog\/([^/]+)$/);
        if (blogMatch) {
          const slug = blogMatch[1];
          if (blogDates[slug]) {
            return { ...item, lastmod: new Date(blogDates[slug] + 'T00:00:00Z') };
          }
        }
        return { ...item, lastmod: new Date('2026-05-16T00:00:00Z') };
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
