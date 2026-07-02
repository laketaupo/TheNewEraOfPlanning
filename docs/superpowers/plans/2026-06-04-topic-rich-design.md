# Topic Page Rich Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `TopicLayout.astro` so topic pages share the landing page's visual language — grid-background hero header, chapter-colored badge, and rich card-style prose components.

**Architecture:** All changes are confined to `src/layouts/TopicLayout.astro`. The frontmatter gains two accent-color maps and four derived variables that are injected as CSS custom properties (`--accent`, `--accent-subtle`) on `<main>`. The HTML is restructured into a hero section (landing-page treatment) + a clean reading area. A single `<style is:global>` block styles all prose elements using those CSS variables.

**Tech Stack:** Astro, Tailwind CSS (prose plugin), vanilla CSS custom properties

---

### Task 1: Add accent color maps and derived variables to frontmatter

**Files:**
- Modify: `src/layouts/TopicLayout.astro` (frontmatter, lines 1–45)

- [ ] **Step 1: Add the four color maps and four derived variables after the existing `colorMap` block**

Open `src/layouts/TopicLayout.astro`. After the existing `const chapterColorClass = ...` line, add:

```typescript
const accentColorMap: Record<string, string> = {
  indigo:  '#6366f1',
  violet:  '#8b5cf6',
  sky:     '#0ea5e9',
  emerald: '#10b981',
  amber:   '#f59e0b',
  teal:    '#14b8a6',
};

const accentSubtleMap: Record<string, string> = {
  indigo:  'rgba(99, 102, 241, 0.07)',
  violet:  'rgba(139, 92, 246, 0.07)',
  sky:     'rgba(14, 165, 233, 0.07)',
  emerald: 'rgba(16, 185, 129, 0.07)',
  amber:   'rgba(245, 158, 11, 0.07)',
  teal:    'rgba(20, 184, 166, 0.07)',
};

const badgeBgMap: Record<string, string> = {
  indigo:  'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
  violet:  'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-400',
  sky:     'bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30 text-sky-600 dark:text-sky-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
};

const dotColorMap: Record<string, string> = {
  indigo:  'bg-indigo-500',
  violet:  'bg-violet-500',
  sky:     'bg-sky-500',
  emerald: 'bg-emerald-500',
};

const accentColor  = accentColorMap[chapterColor]  ?? '#6366f1';
const accentSubtle = accentSubtleMap[chapterColor] ?? 'rgba(99, 102, 241, 0.07)';
const badgeBgClass = badgeBgMap[chapterColor]      ?? badgeBgMap.indigo;
const dotColorClass = dotColorMap[chapterColor]    ?? 'bg-indigo-500';
```

- [ ] **Step 2: Verify the file compiles without errors**

```bash
cd /Users/stefanbakker/Documents/Github/Development && npm run build 2>&1 | tail -5
```

Expected: `[build] Complete!` with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/TopicLayout.astro
git commit -m "feat: add chapter accent color maps to TopicLayout frontmatter"
```

---

### Task 2: Rebuild the main HTML structure

**Files:**
- Modify: `src/layouts/TopicLayout.astro` (the `<main>` block and everything inside it up to `</main>`)

- [ ] **Step 1: Replace the entire `<main>` element** (currently `min-h-screen pt-16 pb-32 flex flex-col items-center`) with the new two-zone structure. The `<nav>` and `<script>` blocks after `</main>` are untouched.

Replace everything from `<main class="min-h-screen ...">` through `</main>` with:

```astro
  <!-- Main content -->
  <main class="min-h-screen pt-16 pb-32" style={`--accent: ${accentColor}; --accent-subtle: ${accentSubtle};`}>

    <!-- ── Hero: landing-page treatment ── -->
    <div class="relative overflow-hidden bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
      <!-- Grid background -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[64px_64px] opacity-60 dark:opacity-40 pointer-events-none"></div>
      <!-- Radial gradient -->
      <div class="absolute inset-0 topic-radial-gradient pointer-events-none"></div>

      <!-- Top chapter-color accent line -->
      <div class="relative z-10 h-[3px]" style={`background: linear-gradient(90deg, ${accentColor}, ${accentColor}44 60%, transparent)`}></div>

      <!-- Header content -->
      <div class="relative z-10 max-w-3xl mx-auto px-6 pt-12 pb-16 animate-fade-in">
        <!-- Chapter badge (same pill as landing page) -->
        <div class={`inline-flex items-center gap-2 text-xs font-medium border rounded-full px-3 py-1 mb-6 ${badgeBgClass}`}>
          <span class={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColorClass}`}></span>
          {chapterTitle} · Topic {topicOrder}
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight tracking-tight">{title}</h1>

        <!-- Description -->
        <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">{description}</p>
      </div>
    </div>

    <!-- ── Reading area ── -->
    <div class="bg-gray-50 dark:bg-gray-950">
      <article class="max-w-3xl mx-auto px-6 py-14 animate-slide-up">

        <!-- Markdown content -->
        <div class="topic-prose prose prose-gray dark:prose-invert prose-lg max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-p:leading-[1.85] prose-p:text-gray-700 dark:prose-p:text-gray-300
          prose-li:text-gray-700 dark:prose-li:text-gray-300
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold">
          <slot />
        </div>

        <!-- Simulation widget slot -->
        {widget && widget !== '' && (
          <div class="mt-16">
            <slot name="widget" />
          </div>
        )}
      </article>
    </div>
  </main>
```

- [ ] **Step 2: Build and verify no errors**

```bash
npm run build 2>&1 | tail -5
```

Expected: `[build] Complete!`

- [ ] **Step 3: Commit**

```bash
git add src/layouts/TopicLayout.astro
git commit -m "feat: redesign TopicLayout hero section with landing-page treatment"
```

---

### Task 3: Replace the prose CSS with rich global styles

**Files:**
- Modify: `src/layouts/TopicLayout.astro` (the `<style is:global>` block)

- [ ] **Step 1: Replace the entire `<style is:global>` block** with the following:

```astro
  <style is:global>
    /* ── Hero radial gradient ── */
    .topic-radial-gradient {
      background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.08), transparent);
    }
    .dark .topic-radial-gradient {
      background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.15), transparent);
    }

    /* ── H2: bottom-border section break with accent underline ── */
    .topic-prose h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin-top: 3.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.875rem;
      border-bottom: 1px solid #e5e7eb;
      position: relative;
    }
    .topic-prose h2::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -1px;
      width: 2.5rem;
      height: 2px;
      background: var(--accent, #6366f1);
      border-radius: 9999px;
    }
    .dark .topic-prose h2 {
      color: #f9fafb;
      border-bottom-color: rgba(255,255,255,0.08);
    }

    /* ── H3: left accent bar ── */
    .topic-prose h3 {
      font-size: 1.0625rem;
      font-weight: 600;
      color: #1f2937;
      margin-top: 2.25rem;
      margin-bottom: 0.625rem;
      padding-left: 0.875rem;
      border-left: 2px solid var(--accent, #6366f1);
    }
    .dark .topic-prose h3 {
      color: #f3f4f6;
    }

    /* ── Blockquote: chapter card style ── */
    .topic-prose blockquote {
      background: var(--accent-subtle, rgba(99,102,241,0.07));
      border: 1px solid rgba(0,0,0,0.06);
      border-left: 4px solid var(--accent, #6366f1);
      border-radius: 0.75rem;
      padding: 1.25rem 1.5rem;
      font-style: normal;
      color: #374151;
      margin-left: 0;
      margin-right: 0;
    }
    .dark .topic-prose blockquote {
      border-color: rgba(255,255,255,0.06);
      border-left-color: var(--accent, #818cf8);
      color: #d1d5db;
    }
    .topic-prose blockquote p {
      margin: 0;
      font-size: 0.9375rem;
      line-height: 1.75;
    }

    /* ── Inline code ── */
    .topic-prose code:not(pre code) {
      background: rgba(0,0,0,0.04);
      color: var(--accent, #6366f1);
      padding: 0.15em 0.45em;
      border-radius: 0.375rem;
      font-size: 0.85em;
      font-weight: 500;
      border: 1px solid rgba(0,0,0,0.07);
    }
    .dark .topic-prose code:not(pre code) {
      background: rgba(255,255,255,0.06);
      border-color: rgba(255,255,255,0.1);
    }

    /* ── Code blocks ── */
    .topic-prose pre {
      background: #1e1e2e !important;
      border: none !important;
      border-radius: 0.875rem !important;
      padding: 1.5rem !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.15) !important;
    }
    .topic-prose pre code {
      background: none !important;
      border: none !important;
      color: #cdd6f4;
      font-size: 0.875em;
      padding: 0 !important;
    }

    /* ── Table ── */
    .topic-prose table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 0.875rem;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      font-size: 0.9375rem;
    }
    .dark .topic-prose table {
      border-color: rgba(255,255,255,0.08);
      box-shadow: none;
    }
    .topic-prose thead {
      background: #f9fafb;
    }
    .dark .topic-prose thead {
      background: #1f2937;
    }
    .topic-prose th {
      font-weight: 600;
      text-align: left;
      padding: 0.75rem 1.125rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
    }
    .dark .topic-prose th {
      color: #9ca3af;
      border-bottom-color: rgba(255,255,255,0.08);
    }
    .topic-prose td {
      padding: 0.75rem 1.125rem;
      border-top: 1px solid #f3f4f6;
      line-height: 1.6;
    }
    .dark .topic-prose td {
      border-top-color: rgba(255,255,255,0.04);
    }
    .topic-prose tbody tr:nth-child(even) {
      background: #fafafa;
    }
    .dark .topic-prose tbody tr:nth-child(even) {
      background: rgba(255,255,255,0.02);
    }
    .topic-prose tbody tr:hover {
      background: var(--accent-subtle, rgba(99,102,241,0.05));
    }

    /* ── HR ── */
    .topic-prose hr {
      border: none;
      height: 1px;
      background: linear-gradient(90deg, transparent, #e5e7eb 20%, #e5e7eb 80%, transparent);
      margin: 2.5rem 0;
    }
    .dark .topic-prose hr {
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent);
    }

    /* ── List markers ── */
    .topic-prose ul > li {
      padding-left: 0.25rem;
    }
    .topic-prose ul > li::marker {
      color: var(--accent, #6366f1);
    }
    .topic-prose ol > li::marker {
      color: var(--accent, #6366f1);
      font-weight: 700;
    }

    /* ── Strong ── */
    .topic-prose strong {
      font-weight: 700;
      color: #111827;
    }
    .dark .topic-prose strong {
      color: #f9fafb;
    }
  </style>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build 2>&1 | tail -5
```

Expected: `[build] Complete!`

- [ ] **Step 3: Spot-check two topic pages in the built output**

```bash
# Verify --accent variable is set on <main>
grep -o '\-\-accent:[^;]*' dist/chapters/01-understanding-basics/05-resource-consumptions/index.html | head -1

# Verify badge element with chapter color classes is present
grep -o 'animate-pulse[^"]*' dist/chapters/01-understanding-basics/05-resource-consumptions/index.html | head -1

# Verify topic-radial-gradient CSS is present
grep -o 'topic-radial-gradient{[^}]*}' dist/chapters/01-understanding-basics/05-resource-consumptions/index.html | head -1
```

Expected outputs:
- Line 1: `--accent: #6366f1`
- Line 2: `animate-pulse bg-indigo-500` (or the chapter's dot color class)
- Line 3: `topic-radial-gradient{background:radial-gradient(...)}`

- [ ] **Step 4: Commit**

```bash
git add src/layouts/TopicLayout.astro
git commit -m "feat: rich prose styles for topic pages — hero, h2, h3, blockquote, table, code"
```
