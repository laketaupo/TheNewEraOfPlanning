import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: 'https://laketaupo.github.io',
  base: isGitHubActions ? '/Development' : '/',
  integrations: [tailwind(), mdx()],
});
