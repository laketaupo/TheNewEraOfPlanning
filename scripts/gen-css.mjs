#!/usr/bin/env node
// Runs the Tailwind CLI once over the vanilla JS/HTML sources -> css/site.css (committed).
// Not run at deploy time — re-run manually whenever a new Tailwind utility class is introduced
// in js/**/*.js or index.html/404.html, per tailwind.config.mjs's `content` globs.
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// Tailwind v4: the CLI lives in @tailwindcss/cli and the config is loaded via the
// `@config` directive in scripts/tailwind-input.css (the v3 `-c` flag was removed).
const result = spawnSync(
  'npx',
  ['@tailwindcss/cli', '-i', 'scripts/tailwind-input.css', '-o', 'css/site.css', '--minify'],
  { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' },
);
process.exit(result.status ?? 1);
