// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// Custom domain (avishay.co.il) served from the site root, so no `base` is needed.
// `public/CNAME` preserves the custom-domain binding on GitHub Pages.
export default defineConfig({
  site: 'https://avishay.co.il',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
