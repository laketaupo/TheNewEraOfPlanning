import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://stefanbakker.com',
  base: '/',
  output: 'static',
  integrations: [tailwind(), mdx()],
  devToolbar: { enabled: false },
});
