import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // Update site and base when you know your GitHub Pages URL:
  // site: 'https://YOUR-USERNAME.github.io',
  // base: '/YOUR-REPO-NAME',
  integrations: [tailwind(), mdx()],
});
