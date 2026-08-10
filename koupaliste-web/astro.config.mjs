import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Vlastní doména = web se servíruje z rootu, proto BEZ "base" parametru.
  site: 'https://koupaliste.volkovic.cz',

  // GitLab Pages vyžaduje, aby výsledné soubory byly ve složce "public".
  outDir: 'public',
  // Protože "public" je obsazené buildem, statické soubory dáváme do "static".
  publicDir: 'static',

  integrations: [
    // Vygeneruje sitemap-index.xml + sitemap-0.xml (pro Seznam Webmaster / Google).
    sitemap(),
  ],
});
