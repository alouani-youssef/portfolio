# Portfolio v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build youssefalouani.com v1: a static Astro site that presents Youssef Alouani as a Lead Backend & AI Engineer to people and to AI agents from one content model.

**Architecture:** Astro 7 static output. Content collections (MDX + YAML) and one typed `profile` module are the single source; pages, Markdown twins, `/api/*.json`, `resume.json`, `llms.txt` and JSON-LD are all generated from them at build time by pure functions in `src/lib/`. Unit tests (Vitest) cover `src/lib/`; "dist tests" (Vitest + `node-html-parser`) run against the output of `npm run build:preview`.

**Tech Stack:** Astro 7.4, Tailwind 4 via `@tailwindcss/vite`, `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, Zod 4 (`astro/zod`), Vitest 4, `node-html-parser`, sharp, satori + `@resvg/resvg-js`, Pagefind.

**Spec:** `docs/superpowers/specs/2026-11-19-portfolio-v1-design.md` (design) and `docs/Youssef Alouani — Portfolio Content & Spec.md` (the "content spec": all copy, tables and facts). Executors read both. All copy is taken from the content spec; never invent facts about Youssef except where a task says "propose" and marks it for review.

## Global Constraints

- Site URL: `https://youssefalouani.com`. English only in v1; i18n config `locales: ['en','fr']`, `defaultLocale: 'en'`, `prefixDefaultLocale: false`. No French pages are generated in v1.
- Headline (exact): "Lead Backend & AI Engineer, founder of Osoul. I build multi-tenant platforms and the AI systems that run on them."
- Visual: near-black text on off-white, inverted in dark mode; one accent token `--accent` (deep muted blue, start `#2B4C7E` light / `#8FB0E0` dark); 1px borders, no shadows, no gradients, no animation beyond hover/focus transitions, which `prefers-reduced-motion` removes.
- Fonts: Inter (variable) as `--font-sans`, JetBrains Mono as `--font-mono`, via Astro's `fonts` config (self-hosted at build).
- Prose width 65–75ch. One `h1` per page. AA contrast. Visible focus ring using `--accent`.
- Under 50 KB of JS per page; no React. Islands only for theme toggle and command palette (plain `<script>`).
- Clients are always rendered grouped, in group order `government`, `banks-insurers`, `groups`, `growth`; hospitality clients are named "Barceló Group" and "Atlas Group", never "Casa Harris" or "Shanzoo" in any text the site outputs.
- Placeholder metrics: preview builds (`PUBLIC_PREVIEW=true`) show a "sample" badge; the production build (`npm run build`) throws while any published project has a metric with `placeholder: true`.
- Drafts (`draft: true`) never appear in production; in preview they render with `<meta name="robots" content="noindex">` and are excluded from sitemap, RSS, `/api`, `llms*.txt` in every mode.
- Confidentiality: no client data, real transcripts, personal names or phone numbers in images or text. `docs/sowtek/voice_customer.jpeg` and `docs/media/personal_picture.jpg` are not used.
- Git: commit after each task on branch `feat/portfolio-v1`. Commit messages are plain conventional commits with no co-author trailers and no mention of Claude.
- Dev server: `npx astro dev --background`; stop with `npx astro dev stop`.

## Review Focus

1. **Phone width (360px)**: wide tables (skills matrix, clients) must not cause horizontal page scroll. Every `<table>` is wrapped in `<div class="table-scroll">` (`overflow-x:auto`). Test in Task 4.
2. **Dark mode legibility of diagrams**: SVG diagrams must use `currentColor`/CSS variables, never hard-coded hex fills or strokes. Test in Task 7.
3. **Arabic text inside English pages** (STT caption, transcript quotes): any element whose text contains Arabic script carries `lang="ar"` and `dir="rtl"`. Test in Task 7.
4. **Drafts leaking into agent outputs**: the Whisper draft must not appear in sitemap, RSS, `/api/posts.json`, `llms.txt`, `llms-full.txt`, even in preview. Test in Task 12.
5. **Broken twin and llms links**: every `<link rel="alternate" type="text/markdown">` href and every URL in `llms.txt` must resolve to a file in `dist/`. Tests in Tasks 11 and 12.

---

## File structure

```
astro.config.mjs                  site, i18n, fonts, integrations, vite tailwind
vitest.config.ts                  two projects: unit (tests/unit) and dist (tests/dist)
scripts/redact-media.mjs          copies + blurs source screenshots into src/assets
src/styles/global.css             tailwind import, theme tokens, base styles
src/layouts/BaseLayout.astro      <head> (meta, fonts, JSON-LD, twin link, OG), header, footer
src/layouts/ProseLayout.astro     BaseLayout + prose column
src/components/                   Header, Footer, ThemeToggle, ExpertiseCards, ClientGroups,
                                  Recommendation, Figure, MetricList, StackChips, Timeline,
                                  CommandPalette, diagrams/{Osoul,SaudiStt,CustomerVoice}Diagram
src/content.config.ts             collections: skills, clients, recommendations, experience, projects, blog
src/data/profile.ts               typed profile object (bios, links, expertise, faq, now, contact)
src/data/{skills,clients,recommendations}.yaml
src/content/experience/en/*.mdx   five roles
src/content/projects/en/*.mdx     three case studies
src/content/blog/en/*.mdx         Whisper draft + 10 Medium external entries
src/lib/i18n.ts                   localized schema, t(), entrySlug(), entryLang()
src/lib/clients.ts                groupClients()
src/lib/metrics.ts                placeholderViolations(), isPreview()
src/lib/posts.ts                  publishedPosts()
src/lib/jsonld.ts                 JSON-LD builders
src/lib/markdown.ts               mdxToMarkdown(), page twin builders
src/lib/api.ts                    API record builders + Zod API schemas
src/lib/resume.ts                 buildResume()
src/lib/llms.ts                   buildLlmsTxt(), buildLlmsFull()
src/lib/og.ts                     renderOgPng()
src/pages/                        routes (see tasks)
tests/unit/*.test.ts              unit tests for src/lib
tests/dist/helpers.ts             readHtml(), readText(), listHtmlPages()
tests/dist/*.test.ts              tests over dist/
.github/workflows/ci.yml
```

---

### Task 1: Foundation (tooling, theme, layout)

**Files:**
- Create: `vitest.config.ts`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/layouts/ProseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/ThemeToggle.astro`, `tests/dist/helpers.ts`, `tests/dist/foundation.test.ts`
- Modify: `astro.config.mjs`, `package.json`, `src/pages/index.astro`, `tsconfig.json`
- Delete: `src/components/Welcome.astro`, `src/layouts/Layout.astro`, `src/assets/astro.svg`, `src/assets/background.svg`

**Interfaces:**
- Produces: `BaseLayout` props `{ title: string; description: string; path: string; jsonLd?: object[]; noindex?: boolean; ogImage?: string }`. `path` is the route without trailing slash (`/`, `/about`, `/projects/osoul`); later tasks derive the twin URL and canonical from it.
- Produces: npm scripts `dev`, `build` (`astro build && pagefind --site dist` — pagefind added in Task 13, keep `astro build` now), `build:preview` (`PUBLIC_PREVIEW=true astro build`), `test:unit` (`vitest run --project unit`), `test:dist` (`vitest run --project dist`), `check` (`astro check`).
- Produces: `tests/dist/helpers.ts` exports `readHtml(route: string): HTMLElement` (reads `dist/<route>/index.html`, `/` → `dist/index.html`), `readText(file: string): string` (relative to `dist/`), `listHtmlPages(): string[]` (routes of every `index.html` under `dist/`), `exists(file: string): boolean`.

- [ ] **Step 1:** Create branch `git checkout -b feat/portfolio-v1`. Install: `npm i -D tailwindcss @tailwindcss/vite @astrojs/mdx @astrojs/sitemap @astrojs/rss @astrojs/check typescript vitest node-html-parser`. Verify each installs a version compatible with `astro@7.4` (`npm ls astro` shows one copy).
- [ ] **Step 2: Write the failing dist test** `tests/dist/foundation.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { readHtml, listHtmlPages } from './helpers';

describe('foundation', () => {
  it('home has exactly one h1 and lang=en', () => {
    const doc = readHtml('/');
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('html')!.getAttribute('lang')).toBe('en');
  });
  it('theme script runs before any stylesheet to avoid a flash', () => {
    const head = readHtml('/').querySelector('head')!.innerHTML;
    expect(head.indexOf('data-theme')).toBeGreaterThan(-1);
    expect(head.indexOf('data-theme')).toBeLessThan(head.indexOf('rel="stylesheet"'));
  });
  it('every page has a canonical URL on youssefalouani.com', () => {
    for (const route of listHtmlPages()) {
      const href = readHtml(route).querySelector('link[rel="canonical"]')?.getAttribute('href');
      expect(href, route).toMatch(/^https:\/\/youssefalouani\.com\//);
    }
  });
});
```

- [ ] **Step 3:** Run `npm run build:preview && npm run test:dist`. Expected: FAIL (helpers/layout missing).
- [ ] **Step 4:** Implement. `astro.config.mjs`: `site`, `i18n` (Global Constraints), `fonts` with `fontProviders.google()` for Inter (`--font-sans`, weights 400–700) and JetBrains Mono (`--font-mono`, 400–500), integrations `mdx()` and `sitemap()`, `vite.plugins: [tailwindcss()]`. `global.css`: `@import "tailwindcss";`, `@theme` mapping `--font-sans`, `--font-mono`, and tokens `--bg #FAFAF9 / #0E0F11`, `--fg #111214 / #EDEDEF`, `--muted #5B5F66 / #A0A4AB`, `--border #E4E4E2 / #26282C`, `--accent` (Global Constraints), switched by `:root[data-theme="dark"]`. `BaseLayout`: inline head script sets `data-theme` from `localStorage` (try/catch) or `prefers-color-scheme`; `<Font cssVariable=…>` from `astro:assets`; canonical = `site + path`; `<link rel="alternate" hreflang="en">` and `hreflang="x-default"` pointing at the canonical (a `fr` alternate is added only for pages that have a French version, none in v1); header nav: Experience, Projects, Blog, About, Contact; theme toggle button with `aria-label`. Footer: email, GitHub, LinkedIn, links to `/llms.txt` and `/resume.json`. Replace `index.astro` with a placeholder using BaseLayout and the headline as the `h1`.
- [ ] **Step 5:** Run `npm run build:preview && npm run test:dist`. Expected: PASS. Run `npm run check`. Expected: 0 errors.
- [ ] **Step 6:** Commit: `git add -A && git commit -m "feat: astro foundation with tailwind, theme tokens and base layout"`

---

### Task 2: Content model and data

**Files:**
- Create: `src/content.config.ts`, `src/lib/i18n.ts`, `src/lib/clients.ts`, `src/data/profile.ts`, `src/data/skills.yaml`, `src/data/clients.yaml`, `src/data/recommendations.yaml`, `tests/unit/i18n.test.ts`, `tests/unit/clients.test.ts`, `tests/unit/profile.test.ts`

**Interfaces:**
- Produces (`src/lib/i18n.ts`): `type Lang = 'en' | 'fr'`; `localized = z.object({ en: z.string(), fr: z.string().optional() })`; `t(value: { en: string; fr?: string } | string, lang: Lang): string` (falls back to `en`); `entrySlug(id: string): string` (`'en/osoul'` → `'osoul'`); `entryLang(id: string): Lang`.
- Produces (`src/lib/clients.ts`): `type ClientGroup = 'government' | 'banks-insurers' | 'groups' | 'growth'`; `GROUP_ORDER: ClientGroup[]`; `GROUP_LABELS: Record<ClientGroup, string>` = "Government and public institutions", "Banks and insurers", "International and hospitality groups", "Growth and technology companies"; `groupClients<T extends { group: ClientGroup; order: number }>(clients: T[]): Array<{ group: ClientGroup; label: string; clients: T[] }>` (groups in `GROUP_ORDER`, empty groups omitted, clients sorted by `order`).
- Produces collections (ids are `en/<slug>` for glob collections):
  - `skills` (file `src/data/skills.yaml`): `{ id, name, category: 'language'|'backend'|'data'|'ai'|'security'|'infra'|'frontend'|'realtime', level: 'daily'|'production'|'familiar', evidence: string[] }`
  - `clients` (file): `{ id, name, group: ClientGroup, order: number, experience: reference('experience'), market: string }`
  - `recommendations` (file): `{ id, author, title, relationship, date: z.coerce.date(), quote, url }`
  - `experience` (glob `*/*.mdx`, base `src/content/experience`): content-spec schema plus `order` is not needed; fields `company, alias?, role, founding, teamSize?, start, end (nullable), location, url?, summary (max 200), highlights (max 6), skills: reference('skills')[], clients: string[] (client ids), media: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string() })).default([])`
  - `projects` (glob `*/*.mdx`): content-spec schema exactly (title, summary, area, kind, company?, parent?, status, featured, confidentiality, skills, links, metrics, cover?, updatedAt) plus `order: z.number()`.
  - `blog` (glob `*/*.mdx`): content-spec schema exactly.
- Produces (`src/data/profile.ts`): `export const profile` validated by an exported Zod `profileSchema` with fields `name, headline, oneLiner, shortBio, longBio: string[]` (paragraphs), `location: { city: 'Casablanca', country: 'MA' }`, `languages: string[]` (English, French, Arabic), `email: 'hello@youssefalouani.com'`, `links: { github, linkedin, mediumA, mediumB, osoul }`, `sameAs: string[]`, `education`, `expertise: Array<{ title, body, skills: string[] }>` (the four cards, exact text from the content spec), `faq: Array<{ q, a }>` (6–8), `now: { updated: string; items: string[] }`, `knowsAbout: string[]`, `jobTitle: 'Lead Backend & AI Engineer'`.

- [ ] **Step 1: Write failing unit tests.**

```ts
// tests/unit/clients.test.ts
import { groupClients, GROUP_ORDER } from '../../src/lib/clients';
const c = (id: string, group: any, order: number) => ({ id, group, order });
it('orders groups and clients, drops empty groups', () => {
  const out = groupClients([c('tahreez','growth',3), c('hrsd','government',1), c('snb','banks-insurers',1), c('kingsaud','government',2)]);
  expect(out.map(g => g.group)).toEqual(['government','banks-insurers','growth']);
  expect(out[0].clients.map(x => x.id)).toEqual(['hrsd','kingsaud']);
  expect(out[0].label).toBe('Government and public institutions');
});
```

```ts
// tests/unit/i18n.test.ts
import { t, entrySlug, entryLang } from '../../src/lib/i18n';
it('falls back to en', () => expect(t({ en: 'Hi' }, 'fr')).toBe('Hi'));
it('parses entry ids', () => { expect(entrySlug('en/osoul')).toBe('osoul'); expect(entryLang('fr/osoul')).toBe('fr'); });
```

```ts
// tests/unit/profile.test.ts
import { profile, profileSchema } from '../../src/data/profile';
it('profile is valid and on-message', () => {
  expect(profileSchema.parse(profile)).toBeTruthy();
  expect(profile.headline).toBe('Lead Backend & AI Engineer, founder of Osoul. I build multi-tenant platforms and the AI systems that run on them.');
  expect(profile.oneLiner.length).toBeLessThanOrEqual(160);
  expect(profile.expertise).toHaveLength(4);
  expect(profile.faq.length).toBeGreaterThanOrEqual(6);
  expect(profile.faq.length).toBeLessThanOrEqual(8);
});
```

Also add to `clients.test.ts` a test that loads `src/data/clients.yaml` (via `yaml` package, `npm i -D yaml`) and asserts: 12 entries; names include "Barceló Group" and "Atlas Group"; no name contains "Casa Harris" or "Shanzoo"; group membership exactly as the content spec's clients table.

- [ ] **Step 2:** Run `npm run test:unit`. Expected: FAIL (modules missing).
- [ ] **Step 3:** Implement the modules and data. Skills: one entry per skill in the content spec's skills matrix, `category` from its row, `evidence` from its Evidence column (project/experience slugs: `osoul`, `axelerated`, `finamaze`, `qalqul`, `10xjobs`, `saudi-stt`, `customer-voice`, or a repo name), `level`: `daily` for TypeScript, Go, Python, NestJS, PostgreSQL, Redis; `production` for anything named in an experience row; `familiar` otherwise (DeepEval, Giskard). Clients: exactly the content spec's grouped table. Recommendations: the three rows with full author titles. FAQ (propose 7, from content-spec facts only): current role; main stack; location and time zone (Casablanca, GMT+1); languages; open to which roles (founder framing, "open to conversations about Senior Backend / AI roles"); what Osoul is; how to reach him.
- [ ] **Step 4:** Run `npx astro sync && npm run test:unit`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: content collections, profile and data files`.

---

### Task 3: Experience (timeline + role pages)

**Files:**
- Create: `src/content/experience/en/{10xjobs,osoul,axelerated,finamaze,qalqul}.mdx`, `src/pages/experience/index.astro`, `src/pages/experience/[slug].astro`, `src/components/Timeline.astro`, `src/components/Figure.astro`, `src/components/StackChips.astro`, `src/components/ClientGroups.astro`, `src/assets/experience/<slug>/*` (copied images), `tests/dist/experience.test.ts`

**Interfaces:**
- Consumes: collections and `groupClients` (Task 2), `BaseLayout` (Task 1).
- Produces: `Figure.astro` props `{ src: ImageMetadata; alt: string; caption: string; device?: 'desktop' | 'phone' }` (uses `<Picture formats={['avif','webp']}>`; phone variant max-width 320px). `StackChips` props `{ skills: string[] }` (skill ids → chips linking to `/about#skills`). `ClientGroups` props `{ clients: ClientEntry[]; heading?: string }`; renders `<section>` with `h2`/`h3` per group label and a plain `<ul>` of names.

- [ ] **Step 1:** Copy images: `docs/10xjobs/*.png` → `src/assets/experience/10xjobs/`, `docs/qalqul/*.png` → `…/qalqul/`, `docs/finamaze/*.png` → `…/finamaze/`, `docs/sowtek/{inbox_module,automation,social_media}.jpeg` → `…/axelerated/`. (Osoul images come from Task 5.)
- [ ] **Step 2: Write failing dist test** `tests/dist/experience.test.ts`: `/experience` lists five role links in order 10xJobs, Osoul, Axelerated Solutions, Finamaze, Qalqul Engine; each `/experience/<slug>` has one `h1` containing the company name and `h2`s exactly `["Context","My part","Stack","Outcome","What I'd do differently"]` in order; `/experience/axelerated` contains a "Migrations and deployments" section with the five bullets from the content spec; every `<img>` under `/experience/*` has non-empty `alt`; `/experience/osoul` client list contains "Barceló Group" and "Atlas Group".
- [ ] **Step 3:** Run `npm run build:preview && npm run test:dist -- experience`. Expected: FAIL.
- [ ] **Step 4:** Write the five MDX entries (frontmatter from the content spec's experience table and dates; body follows the per-role page template with copy drawn only from the content spec; "Outcome" says "Numbers to come." where the spec has none; "What I'd do differently" is one proposed line marked `{/* CHECK */}`). Implement the timeline (newest first by `start`, "now" for `end: null`) and role page (Figure gallery from `media`, StackChips, ClientGroups filtered to that role, education line under the timeline: "Diplôme d'Ingénieur d'État in Computer Science, Hassan First University, FST Settat, 2019–2022").
- [ ] **Step 5:** Run the build and `npm run test:dist -- experience`. Expected: PASS.
- [ ] **Step 6:** Commit `feat: experience timeline and role pages`.

---

### Task 4: Home, About (+ FAQ, skills), Now, Contact

**Files:**
- Create: `src/pages/about.astro`, `src/pages/now.astro`, `src/pages/contact.astro`, `src/pages/404.astro`, `src/components/ExpertiseCards.astro`, `src/components/Recommendation.astro`, `src/components/SkillsMatrix.astro`, `src/assets/media/headshot.png`, `tests/dist/pages.test.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `profile`, collections, `ClientGroups`, `Figure`.
- Produces: `SkillsMatrix` renders the skills table inside `<div class="table-scroll">` with `id="skills"` on its section; levels shown as words ("daily", "shipped in production", "familiar").

- [ ] **Step 1:** Copy `docs/media/alouani_youssef.png` → `src/assets/media/headshot.png`.
- [ ] **Step 2: Write failing dist test** `tests/dist/pages.test.ts`:
  - Home: `h1` text equals the headline's first sentence "Lead Backend & AI Engineer, founder of Osoul."; 4 `.expertise-card`; client group headings in `GROUP_ORDER` label order; exactly one recommendation `blockquote`; links to `/contact` and `/cv`.
  - About: three recommendation `blockquote`s each with a link to LinkedIn; `#faq` has 6–8 `<details>` or `dt` items; `#skills` exists.
  - `/now` shows a visible "Updated" date; `/contact` shows `hello@youssefalouani.com` as a `mailto:` link.
  - Review Focus 1: for every page in `listHtmlPages()`, every `<table>` has a parent with class `table-scroll`.
  - No page's text contains "Casa Harris" or "Shanzoo".
- [ ] **Step 3:** Run build + test. Expected: FAIL.
- [ ] **Step 4:** Implement the pages following the design's Home sketch (hero with headshot via `<Picture>` at 160px, 4 expertise cards, featured projects block reading `featured: true` projects — renders nothing until Task 7, client groups, one pull-quote, latest 3 published posts, CTA). About: long bio paragraphs, education, languages, SkillsMatrix, three recommendations, FAQ. Now: `profile.now`. Contact: email, LinkedIn, GitHub, `/cv` link.
- [ ] **Step 5:** Run build + test. Expected: PASS.
- [ ] **Step 6:** Commit `feat: home, about, now and contact pages`.

---

### Task 5: Case-study media and redaction

**Files:**
- Create: `scripts/redact-media.mjs`, `tests/unit/redact.test.ts`
- Output: `src/assets/projects/osoul/{portal-dashboard,guest-home,guest-pairings,waiter-floors}.png`, `src/assets/projects/saudi-stt/live-transcript.png`

**Interfaces:**
- Produces: `redact(input: string, output: string, boxes: Array<{ left: number; top: number; width: number; height: number }>): Promise<void>` exported from `scripts/redact-media.mjs` (sharp: extract each box, blur sigma 24, composite back). Running the script with no args processes the manifest below.

Manifest (`left, top, width, height` in original pixels of the 3440×1920 source):

| Source | Output | Boxes |
| --- | --- | --- |
| `docs/osoul/portal_dashboard.png` | `osoul/portal-dashboard.png` | staff name block `20,1780,490,120`; assistant payload block `2660,1400,780,115` |
| `docs/osoul/recommendations.png` | `osoul/guest-home.png` | none |
| `docs/osoul/dish_paring.png` | `osoul/guest-pairings.png` | none |
| `docs/osoul/mobile_app.png` | `osoul/waiter-floors.png` | none |
| `docs/sowtek/saudi_dialect.png` | `saudi-stt/live-transcript.png` | none |

- [ ] **Step 1: Write the failing test** `tests/unit/redact.test.ts`: run `redact` on the dashboard to a temp file; with sharp, compute `stats()` of the payload box region in input and output; assert output channel `stdev` is below 50% of input's; assert the image outside the boxes is byte-identical on a sampled region (`0,0,400,400` raw pixels equal).
- [ ] **Step 2:** `npm run test:unit -- redact`. Expected: FAIL.
- [ ] **Step 3:** Implement `redact` and the manifest runner; add npm script `media` → `node scripts/redact-media.mjs`.
- [ ] **Step 4:** Run tests (PASS), then `npm run media`. Open `src/assets/projects/osoul/portal-dashboard.png` with the Read tool and confirm the name "Yassine Alaoui" and the phone digits are unreadable while "Shanzoo" may remain; widen a box if any text is still legible.
- [ ] **Step 5:** Commit `feat: redacted case-study media`.

---

### Task 6: Projects collection pages and the metrics gate

**Files:**
- Create: `src/lib/metrics.ts`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/components/MetricList.astro`, `tests/unit/metrics.test.ts`

**Interfaces:**
- Produces: `isPreview(): boolean` (`import.meta.env.PUBLIC_PREVIEW === 'true'`); `placeholderViolations(projects: Array<{ id: string; data: { metrics: Array<{ label: string; placeholder: boolean }> } }>): string[]` returning `"<slug>: <label>"` per placeholder metric. `projects/[slug].astro` `getStaticPaths` throws `Error("Placeholder metrics in production build:\n" + list)` when `!isPreview()` and the list is non-empty. `MetricList` props `{ metrics; preview: boolean }`; placeholder metrics render with a `<span class="badge">sample</span>` in preview.
- Case-study page renders `h2`s in order: "Problem", "Constraints", "Architecture", "Key decisions", "Results", "Stack and links" (the MDX body supplies the first four; the layout supplies Results from `metrics` and Stack and links from `skills`/`links`).
- Projects index groups by `area` with anchor links (`#backend`, `#ai`, `#platform`) at the top; no client JS.

- [ ] **Step 1: Write failing unit test**: `placeholderViolations` returns `['osoul: Average ticket']` for one project with one placeholder and one confirmed metric, and `[]` when all are confirmed.
- [ ] **Step 2:** Run, expect FAIL. **Step 3:** Implement. **Step 4:** Run, expect PASS. (Dist assertions for these pages come in Task 7 once content exists.)
- [ ] **Step 5:** Commit `feat: case-study template and placeholder-metric gate`.

---

### Task 7: The three v1 case studies and diagrams

**Files:**
- Create: `src/content/projects/en/{osoul,saudi-stt,customer-voice}.mdx`, `src/components/diagrams/{OsoulDiagram,SaudiSttDiagram,CustomerVoiceDiagram}.astro`, `tests/dist/projects.test.ts`

**Interfaces:**
- Consumes: Task 5 assets, Task 6 template, `Figure`.
- Produces: each diagram is an inline `<svg role="img">` with `<title>` and `<desc>`, strokes/fills only `currentColor` or `var(--…)`, followed by `<details><summary>Diagram source (Mermaid)</summary>` with a ` ```mermaid ` block (same graph).

Diagram content (nodes, left to right):
- Osoul: Guest App (NFC/QR) / Waiter App / Osoul Portal → API gateway (Keycloak) → NestJS services (ordering, reservations, recommendations, ad signals, AI assistant) → PostgreSQL (per-tenant) + Redis; side: POS/PMS integrations, CAPI events.
- Saudi STT: WhatsApp audio + Asterisk call audio → preparation (resampling, segmentation, labelling) → Whisper large-v3 fine-tuned for Saudi dialect → transcripts → agent tools (e.g. `track_order`).
- Customer Voice: structured + unstructured sources + customer interactions → ingestion → embeddings in Milvus → gRPC retrieval module → MCP server (main retriever) → LLM clients; wrapper boxes: Keycloak auth, privacy and retention layer; side: ai-llm module (tokens, cost, privacy).

Metrics (proposed, `placeholder: true` until Youssef confirms each):

| Project | Label | Value |
| --- | --- | --- |
| osoul | Venues live | 2 (`placeholder: false`, real) |
| osoul | Average ticket from meal-completion promos | +8% |
| osoul | Reservation no-shows after reminders and deposits | −30% |
| saudi-stt | Word error rate, base Whisper large-v3 → fine-tuned | 38% → 19% |
| customer-voice | Calls processed per month | 50,000 |

- [ ] **Step 1: Write failing dist test** `tests/dist/projects.test.ts`:
  - `/projects` links to `/projects/osoul`, `/projects/saudi-stt`, `/projects/customer-voice`; Osoul first and marked flagship.
  - Each case study has the six `h2`s in order (Task 6); at least one `svg[role="img"] title`; a `details` containing `mermaid`.
  - Preview build shows `.badge` "sample" next to every placeholder metric and none next to "Venues live".
  - `/projects/osoul` has 4 images, `/projects/saudi-stt` has 1, `/projects/customer-voice` has 0; all `alt` non-empty; no `src` contains `voice_customer` or `personal_picture`.
  - Review Focus 2: no `fill`/`stroke` attribute or style in any diagram SVG matches `/#[0-9a-f]{3,6}/i`.
  - Review Focus 3: across all pages, every element whose own text matches `/[؀-ۿ]/` has `lang="ar"` and `dir="rtl"` on itself or an ancestor below `body`.
  - Home now shows the three featured projects.
- [ ] **Step 2:** Run build:preview + test, expect FAIL.
- [ ] **Step 3:** Write the MDX case studies from the content spec (Osoul framing: business first — RaaS, the lost data, the KPIs — then the sub-cases list as "the machinery"; Saudi STT and Customer Voice at architecture level, no client names tied to them). Captions: Saudi STT figure caption quotes the customer line with `<span lang="ar" dir="rtl">`. Key decisions: two or three per study, each with the rejected option, drawn from the content spec; anything not stated there is marked `{/* CHECK */}`. Build the three diagrams.
- [ ] **Step 4:** Run build:preview + test, expect PASS. Run `npm run build` and confirm it FAILS with the placeholder list (the gate works).
- [ ] **Step 5:** Commit `feat: osoul, saudi-dialect stt and customer voice case studies`.

---

### Task 8: Blog

**Files:**
- Create: `src/lib/posts.ts`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/pages/blog/tags/[tag].astro`, `src/pages/rss.xml.ts`, `src/content/blog/en/whisper-saudi-dialect.mdx`, ten `src/content/blog/en/medium-*.mdx`, `tests/unit/posts.test.ts`, `tests/dist/blog.test.ts`

**Interfaces:**
- Produces: `publishedPosts(posts: BlogEntry[], opts: { preview: boolean; includeDrafts?: boolean }): BlogEntry[]` sorted by `pubDate` desc; drafts included only when `preview && includeDrafts`. Pages call it with `includeDrafts: true`; RSS, sitemap filter, `/api`, `llms*` call it with `includeDrafts: false`.
- External posts: no detail page; index links straight to the Medium URL with an "on Medium" badge.

- [ ] **Step 1: Write failing tests.** Unit: draft excluded when `preview:false`, excluded when `includeDrafts:false` even in preview, included when both true; sort order. Dist: `/blog` lists 10 "on Medium" entries with the content spec's dates and URLs; in preview `/blog/whisper-saudi-dialect` exists with `meta[name=robots][content=noindex]`; `rss.xml` does not contain `whisper-saudi-dialect`; tag pages exist for every tag used.
- [ ] **Step 2:** Run, expect FAIL.
- [ ] **Step 3:** Implement. Medium entries: frontmatter only (title, description ≤160, pubDate, tags, `external: { platform: 'medium', url }`), from the content spec's table. Whisper post: full draft (problem, data from WhatsApp and Asterisk, preparation, fine-tuning setup, evaluation, what went wrong, what's next), realistic details each followed by `{/* CHECK */}`, `draft: true`, one diagram reusing `SaudiSttDiagram`, cross-link to `/projects/saudi-stt`.
- [ ] **Step 4:** Run, expect PASS. Commit `feat: blog with medium entries, rss and whisper draft`.

---

### Task 9: Printable CV

**Files:**
- Create: `src/pages/cv.astro`, `tests/dist/cv.test.ts`

- [ ] **Step 1: Failing dist test:** `/cv` has `h1` "Youssef Alouani", the headline, five roles with dates, education, skills grouped by category, email and site URL; contains a `@media print` rule hiding header, footer and theme toggle (check the built CSS for `@media print`).
- [ ] **Step 2:** Run, FAIL. **Step 3:** Implement from `profile` + collections, A4 print styles (`@page { size: A4; margin: 16mm }`), no images. **Step 4:** Run, PASS. Commit `feat: printable cv page`.

---

### Task 10: JSON-LD, robots, sitemap

**Files:**
- Create: `src/lib/jsonld.ts`, `src/pages/robots.txt.ts`, `tests/unit/jsonld.test.ts`, `tests/dist/seo.test.ts`
- Modify: pages to pass `jsonLd` to `BaseLayout`; `astro.config.mjs` sitemap `filter` excluding drafts and `404`.

**Interfaces:**
- Produces: `personJsonLd(profile): object` (shape of the content spec's example, `worksFor` Osoul, `knowsLanguage ['en','fr','ar']`), `profilePageJsonLd(profile): object` (wraps Person), `blogPostingJsonLd(post, url): object`, `projectJsonLd(project, url): object` (`SoftwareSourceCode` when `links.repo`, else `CreativeWork`), `faqPageJsonLd(faq): object`.

- [ ] **Step 1: Failing tests.** Unit: `profilePageJsonLd(profile)['@type'] === 'ProfilePage'`, `mainEntity.sameAs` contains both Medium URLs, GitHub and LinkedIn. Dist: home and about have a parseable `application/ld+json` with `ProfilePage`; about also `FAQPage` whose questions equal `profile.faq`; each case study has `CreativeWork`; `robots.txt` contains `Allow: /`, a `User-agent:` line for each of GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, and `Sitemap: https://youssefalouani.com/sitemap-index.xml`; `sitemap-0.xml` excludes `/404` and the draft.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS. Commit `feat: json-ld, robots.txt and sitemap`.

---

### Task 11: Markdown twins

**Files:**
- Create: `src/lib/markdown.ts`, `src/pages/[...twin].md.ts`, `tests/unit/markdown.test.ts`, `tests/dist/twins.test.ts`
- Modify: `BaseLayout.astro` (alternate link)

**Interfaces:**
- Produces: `mdxToMarkdown(body: string): string` — removes `import`/`export` lines and self-closing or paired JSX components whose tag starts with an uppercase letter, strips `{/* … */}` comments, keeps fenced code (including `mermaid`) and Markdown untouched, collapses 3+ blank lines to 2. `buildTwins(): Promise<Array<{ path: string; markdown: string }>>` — one per HTML page: `/index.md`, `/about.md`, `/experience.md`, `/experience/<slug>.md`, `/projects.md`, `/projects/<slug>.md`, `/blog.md`, `/blog/<slug>.md` (published only), `/now.md`, `/contact.md`, `/cv.md`. Each starts with `# <title>`, then a one-line source link `Source: https://youssefalouani.com<path>`, then content (frontmatter facts as a bullet list, then body).
- `twinHref(path: string): string` — `/` → `/index.md`, otherwise `${path}.md`. BaseLayout emits `<link rel="alternate" type="text/markdown" href={twinHref(path)}>`.

- [ ] **Step 1: Failing tests.** Unit: `mdxToMarkdown` on a sample with `import Figure from '…'`, `<Figure src={x} alt="a" />`, `{/* CHECK */}`, a mermaid fence and a paragraph returns only the fence and paragraph; `twinHref('/')==='/index.md'`, `twinHref('/projects/osoul')==='/projects/osoul.md'`. Dist (Review Focus 5): for every page, the alternate href exists in `dist/`; `projects/osoul.md` contains "Revenue" and a mermaid fence and no `<Figure`; no twin contains "CHECK".
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS. Commit `feat: markdown twins for every page`.

---

### Task 12: /api JSON, resume.json, llms.txt, llms-full.txt

**Files:**
- Create: `src/lib/api.ts`, `src/lib/resume.ts`, `src/lib/llms.ts`, `src/pages/api/[name].json.ts`, `src/pages/api/schema/[name].json.ts`, `src/pages/resume.json.ts`, `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`, `tests/unit/api.test.ts`, `tests/dist/agents.test.ts`

**Interfaces:**
- Produces (`src/lib/api.ts`): Zod schemas `apiProfile`, `apiExperience`, `apiProject`, `apiSkill`, `apiPost` (every item has `id`, `updatedAt` ISO string, canonical `url`; references resolved to ids; clients grouped via `groupClients`); `API_NAMES = ['profile','experience','projects','skills','posts'] as const`; `buildApi(name): Promise<unknown>`; schema files are `z.toJSONSchema(schema)`.
- Produces: `buildResume(...)` returning a JSON Resume v1 object (`basics`, `work`, `education`, `skills`, `languages`, `references` from recommendations); `buildLlmsTxt(...)` matching the content spec's example structure with real URLs (`https://youssefalouani.com/...`) and only published entries; `buildLlmsFull(...)` concatenating the twins of profile, experience, projects and post abstracts.

- [ ] **Step 1: Failing tests.** Unit: each `buildApi(name)` output parses with its schema. Dist: each `/api/<name>.json` parses and validates against `/api/schema/<name>.json` (validate with the Zod schema in-process); `resume.json` has `basics.name === 'Youssef Alouani'` and five `work` items; `llms.txt` starts with `# Youssef Alouani`, has a `> ` summary line, and every `https://youssefalouani.com/...` URL in it maps to an existing file in `dist/` (Review Focus 5); Review Focus 4: `whisper-saudi-dialect` does not appear in `llms.txt`, `llms-full.txt`, `api/posts.json`, `rss.xml` or any sitemap file in the preview build; "no agent-only claims": every project title and role in `api/*.json` appears in some HTML page's text.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS. Commit `feat: api json, resume.json and llms.txt`.

---

### Task 13: Search, command palette, OG images, analytics

**Files:**
- Create: `src/components/CommandPalette.astro`, `src/lib/og.ts`, `src/pages/og/[...slug].png.ts`, `tests/dist/budget.test.ts`
- Modify: `package.json` (`build` → `astro build && pagefind --site dist`, same for `build:preview`), `BaseLayout.astro` (og:image, twitter card, palette, analytics)

**Interfaces:**
- Produces: `renderOgPng({ title: string; subtitle?: string }): Promise<Buffer>` (satori, 1200×630, Inter from the build fonts or a bundled TTF in `src/assets/fonts/`, off-white background, near-black title, accent rule); OG route per page path; `BaseLayout` sets `og:image` to `/og/<path or "index">.png`.
- Palette: Ctrl/Cmd+K opens a `<dialog>` with Pagefind UI loaded lazily on first open (`/pagefind/pagefind-ui.js`) plus quick links to the main routes; Escape closes; focus returns to the trigger.
- Analytics: Cloudflare Web Analytics beacon script with token from `PUBLIC_CF_ANALYTICS_TOKEN`; omitted when unset.

- [ ] **Step 1:** `npm i -D pagefind satori @resvg/resvg-js`.
- [ ] **Step 2: Failing dist test** `budget.test.ts`: `dist/pagefind/pagefind.js` exists; every page's `og:image` file exists and is a PNG of 1200×630 (read header bytes); for every page, total bytes of same-origin `<script src>` files plus inline scripts is under 51,200 (Pagefind's lazily loaded files excluded because they load only on open).
- [ ] **Step 3:** FAIL. **Step 4:** Implement. **Step 5:** PASS. Manually check with the dev server: Cmd+K opens, searching "Whisper" finds the Saudi STT case study, Escape closes. Commit `feat: pagefind search, command palette, og images and analytics`.

---

### Task 14: CI and launch readiness

**Files:**
- Create: `.github/workflows/ci.yml`, `lighthouserc.json`
- Modify: `README.md`

- [ ] **Step 1:** CI on push and PR: Node 22; `npm ci`; `npm run check`; `npm run test:unit`; `npm run build:preview`; `npm run test:dist`; `npx linkinator dist --recurse --skip "^https?://(?!youssefalouani)"`; `npx @lhci/cli autorun` with `lighthouserc.json` asserting `categories:performance|accessibility|best-practices|seo >= 0.95` over `/`, `/about`, `/projects/osoul`, `/blog`. A separate job runs `npm run build` and is allowed to fail until metrics are confirmed (`continue-on-error: true`), so the gate stays visible.
- [ ] **Step 2:** Run the same commands locally; all pass except the production build, which fails only with the placeholder list.
- [ ] **Step 3:** README: how to run, preview vs production builds, how to confirm a metric (`placeholder: false`), how to publish the Whisper post (`draft: false` after review), Cloudflare Pages settings (build `npm run build`, output `dist`, Node 22, env `PUBLIC_CF_ANALYTICS_TOKEN`), and the remaining launch checklist: buy domain, create `hello@` mailbox, confirm metrics, review CHECK markers (`grep -rn "CHECK" src/content`).
- [ ] **Step 4:** Commit `chore: ci, lighthouse budget and launch readme`.

---

## Hand-off list for Youssef (produced at the end, not code)

- Confirm or correct the four placeholder metrics (Task 7 table).
- Review every `{/* CHECK */}` in experience entries, case studies and the Whisper draft.
- Buy the domain, create the mailbox, connect Cloudflare Pages.
