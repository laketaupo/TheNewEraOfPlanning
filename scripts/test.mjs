#!/usr/bin/env node
// Regression suite for the Vanilla JS SPA. Starts a GitHub-Pages-like static server (see
// gh-pages-like-server.mjs — replicates the real 404+404.html-redirect behavior, unlike `serve -s`
// or python's http.server, both of which mask deep-link bugs), drives it with Playwright, and
// asserts on outcomes instead of just printing diagnostics. Exits non-zero on any failure.
//
// This exists because there were no automated tests for this project before the Astro -> Vanilla
// JS migration; it caught 4 real bugs during that port (search dialog visible-by-default, the
// #app-main/<main> tag collision corrupting role-phase-nav back-links, the hidden-chapter routing
// gap, and the planning-cycles-and-governance module-slug mismatch) — run it after any change to
// js/, index.html, or 404.html.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8099;
const BASE = `http://localhost:${PORT}/`;

let failures = 0;
function ok(cond, label) {
  if (cond) console.log(`  ok   ${label}`);
  else { console.log(`  FAIL ${label}`); failures++; }
}

function startServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', ['scripts/gh-pages-like-server.mjs', String(PORT)], { cwd: ROOT });
    proc.stdout.once('data', () => resolve(proc));
    proc.on('error', reject);
    setTimeout(() => resolve(proc), 1500); // fallback if stdout buffering delays the ready message
  });
}

const ROUTES = [
  '', 'pillars', 'roles', 'glossary', 'faq', 'about', 'progress',
  'technology', 'technology/configuration', 'technology/planning-software',
  'technology/planning-software/01-understanding-basics',
  'technology/planning-software/01-understanding-basics/item',
  'technology/planning-software/99-layout-showcase',
  ...['prose-topic', 'card-grid', 'data-table', 'comparison', 'full-widget', 'node-topic', 'topic-with-widget']
    .map((t) => `technology/planning-software/99-layout-showcase/${t}`),
  'process', 'process/planning-governance', 'process/sop',
  'data', 'data/data-foundations', 'people', 'people/roles-and-responsibilities',
  'roles/strategic-planner', 'roles/strategic-planner/1',
];

async function testRouteMatrix(page) {
  console.log('\nRoute matrix (deep-link load via 404.html redirect):');
  for (const route of ROUTES) {
    const consoleErrors = [];
    const handler = (msg) => { if (msg.type() === 'error' && !msg.text().includes('404')) consoleErrors.push(msg.text()); };
    page.on('console', handler);
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(150);
    const mainLen = await page.evaluate(() => document.getElementById('app-main')?.innerHTML.length ?? -1);
    page.off('console', handler);
    ok(mainLen > 0, `/${route || '(home)'}  (mainLen=${mainLen})`);
    ok(consoleErrors.length === 0, `/${route || '(home)'} no unexpected console errors${consoleErrors.length ? ': ' + consoleErrors[0] : ''}`);
  }
  // Router must render a not-found page (not blow up) for an unknown route.
  await page.goto(BASE + 'this-should-not-exist', { waitUntil: 'networkidle' });
  const notFoundLen = await page.evaluate(() => document.getElementById('app-main')?.innerHTML.length ?? -1);
  ok(notFoundLen > 0, '/this-should-not-exist renders a not-found page, not a blank/crashed one');
}

async function testInteractive(page) {
  console.log('\nInteractive flows:');
  await page.goto(BASE, { waitUntil: 'networkidle' });

  await page.click('a[href*="pillars"]');
  await page.waitForTimeout(250);
  ok(page.url() === BASE + 'pillars', 'SPA nav: clicking home card navigates to /pillars without reload');

  await page.click('a[href$="/technology"]');
  await page.waitForTimeout(250);
  await page.click('a[href*="planning-software"]');
  await page.waitForTimeout(250);
  await page.click('#app-main a[href*="/planning-software/"] >> nth=0');
  await page.waitForTimeout(250);
  const startBtn = page.locator('text=Start chapter');
  ok(await startBtn.count() > 0, 'chapter-index page renders a Start chapter link');
  await startBtn.first().click();
  await page.waitForTimeout(400);
  ok(/\/technology\/planning-software\//.test(page.url()) && page.url().split('/').length >= 7, 'Start chapter navigates into a topic page');

  const glossTerm = page.locator('.glossary-term').first();
  if (await glossTerm.count()) {
    await glossTerm.hover();
    await page.waitForTimeout(250);
    const tooltipVisible = await page.evaluate(() => !document.getElementById('glossary-tooltip')?.classList.contains('hidden'));
    ok(tooltipVisible, 'glossary tooltip shows on hover');
  }

  const completeBtn = page.locator('#complete-btn');
  if (await completeBtn.count()) {
    await completeBtn.click();
    await page.waitForTimeout(600);
    const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('platform-progress') || '{}'));
    ok(Object.values(progress).includes('complete'), 'mark-complete persists to localStorage["platform-progress"]');
  }

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.keyboard.press('/');
  await page.waitForTimeout(200);
  const dialogOpen = await page.evaluate(() => document.getElementById('search-modal')?.open === true);
  ok(dialogOpen, '"/" key opens the search dialog');
  await page.fill('#search-modal #search-input', 'item');
  await page.waitForTimeout(500);
  const resultsCount = await page.evaluate(() => document.querySelectorAll('#search-results a').length);
  ok(resultsCount > 0, `search for "item" returns results (${resultsCount})`);

  await page.goto(BASE, { waitUntil: 'networkidle' });
  const dialogHiddenByDefault = await page.evaluate(() => getComputedStyle(document.getElementById('search-modal')).display === 'none');
  ok(dialogHiddenByDefault, 'search dialog is display:none by default (regression check for the dialog/[open] bug)');

  await page.click('#theme-toggle-slot button');
  await page.waitForTimeout(150);
  await page.click('button[data-theme="dark"]');
  await page.waitForTimeout(200);
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  ok(isDark, 'theme toggle switches to dark mode');
}

async function testRoleNav(page) {
  console.log('\nRole-phase navigation override (?from=roles/x/y):');
  await page.goto(BASE + 'roles/strategic-planner', { waitUntil: 'networkidle' });
  await page.click('a[href*="/roles/strategic-planner/"]');
  await page.waitForTimeout(250);

  const chapterLink = page.locator('main a[href*="?from=roles"]').first();
  ok(await chapterLink.count() > 0, 'phase page has chapter links carrying ?from=roles/x/y');
  await chapterLink.click();
  await page.waitForTimeout(250);

  const backLink = await page.evaluate(() => document.getElementById('nav-back-link')?.getAttribute('href'));
  ok(backLink === '/roles/strategic-planner', `nav-back-link points to role overview with no stray query (got: ${backLink})`);

  const backOverview = await page.evaluate(() => document.getElementById('chapter-back-overview')?.getAttribute('href'));
  ok(backOverview === '/roles/strategic-planner', `chapter-back-overview points to role overview (got: ${backOverview})`);

  await page.click('text=Start chapter');
  await page.waitForTimeout(250);
  const roleNav = await page.evaluate(() => {
    const nav = document.querySelector('[data-role-nav]');
    return nav ? [...nav.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')) : null;
  });
  ok(Array.isArray(roleNav) && roleNav.some((h) => h.includes('?from=roles')), 'topic page prev/next nav preserves role-phase scoping');
}

const server = await startServer();
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (err) => { console.log(`  FAIL uncaught page error: ${err.message}`); failures++; });
await page.addInitScript(() => localStorage.setItem('platform-intro-seen', 'true'));

try {
  await testRouteMatrix(page);
  await testInteractive(page);
  await testRoleNav(page);
} finally {
  await browser.close();
  server.kill();
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
