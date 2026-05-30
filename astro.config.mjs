import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

export default defineConfig({
  site: 'https://www.calcfit.com',
  integrations: [
    react(),
    sitemap({
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date(),
    }),
    compress(),
  ],
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
