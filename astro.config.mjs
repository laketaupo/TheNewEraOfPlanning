import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  site: 'https://stefanbakker.com',
  base: '/',
  adapter: vercel(),
  integrations: [tailwind(), mdx()],
});
