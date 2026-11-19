# Skills Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the text skills table with a visual, icon-led `SkillsGrid` on `/about` and a `CoreStack` strip on the home page, both driven by `skills.yaml`.

**Architecture:** A pure TS module (`src/lib/skill-icons.ts`) resolves `si:<slug>` / `lucide:<name>` refs to normalised inline SVG strings at build time. A `SkillIcon.astro` component renders one; `SkillsGrid`, `CoreStack` and `StackChips` compose it. No client JS.

**Tech Stack:** Astro 7, Tailwind 4, `simple-icons@^16.38.0`, `lucide-static@^1.76.0`, Vitest (`unit` + `dist` projects), `yaml`.

**Spec:** `docs/superpowers/specs/2026-11-19-skills-section-design.md`

## Global Constraints

- No external requests, no client JavaScript for the section.
- Icons legible in light and dark themes; default colour `currentColor`.
- Every skill has an `icon`; an unknown icon fails the build.
- Every grid skill keeps `id="skill-<id>"` (linked by `StackChips` and `/api/skills.json`).
- CV, JSON API, llms.txt and markdown twins output unchanged.
- Commits: no Co-authored-by trailers, no mention of Claude.

## Review Focus

1. Brand icons with near-black/near-white hex (Next.js `000000`, Ollama `000000`) — hover must not make them invisible in either theme → `brandHover` returns `null` for them (Task 1 test).
2. Simple Icons SVGs contain `<title>`; inlined beside the visible name it doubles screen-reader output and shows a tooltip → resolver strips `<title>` and outputs `aria-hidden="true"` (Task 1 test).
3. Level shown as a dot must still be read by assistive tech → each grid item carries `.sr-only` level text (Task 3 test).
4. Home must not emit `id="skill-*"` anchors (would collide conceptually with `/about#skill-*` targets and break the "one anchor per skill" rule) (Task 4 test).
5. Phone width: grid and strip wrap with no horizontal scroll → layout uses wrapping flex / responsive grid only, no fixed widths (checked in Task 4's manual run at 375px).

---

### Task 1: Icon resolver

**Files:**
- Modify: `package.json` (devDependencies: `simple-icons`, `lucide-static`)
- Create: `src/lib/skill-icons.ts`
- Test: `tests/unit/skill-icons.test.ts`

**Interfaces:**
- Produces:
  - `type Category = 'language'|'backend'|'data'|'ai'|'security'|'infra'|'frontend'|'realtime'`
  - `SKILL_CATEGORIES: ReadonlyArray<{ id: Category; label: string; icon: string }>` — order and labels: language "Languages" `lucide:code-xml`, backend "Backend" `lucide:server`, data "Data" `lucide:database`, ai "AI / LLM" `lucide:sparkles`, security "Identity and security" `lucide:shield-check`, infra "Infra" `lucide:cloud`, frontend "Front end" `lucide:layout-template`, realtime "Real-time" `lucide:radio`.
  - `resolveIcon(ref: string): { svg: string; brand: boolean; brandHover: string | null }` — throws `Error('Unknown skill icon: <ref>')` for an unknown prefix/name.
  - `LEVEL_LABELS = { daily: 'daily', production: 'shipped in production', familiar: 'familiar' }`.

- [ ] **Step 1: Install deps** — `npm i -D simple-icons@^16.38.0 lucide-static@^1.76.0`

- [ ] **Step 2: Write failing tests** in `tests/unit/skill-icons.test.ts`:
  - `resolveIcon('si:redis')` → `brand === true`, `brandHover === '#FF4438'`, `svg` contains `viewBox="0 0 24 24"`, `aria-hidden="true"`, `fill="currentColor"`, and **not** `<title`.
  - `resolveIcon('si:nextdotjs').brandHover` and `resolveIcon('si:ollama').brandHover` → `null`.
  - `resolveIcon('lucide:server')` → `brand === false`, `brandHover === null`, `svg` contains `stroke="currentColor"`, `aria-hidden="true"`, not `<!--`, not `width="24"`.
  - `resolveIcon('si:nope')`, `resolveIcon('lucide:nope')`, `resolveIcon('foo:bar')` each throw `/Unknown skill icon/`.
  - `SKILL_CATEGORIES.map(c => c.id)` equals the 8 ids above in order, and every `c.icon` resolves.

- [ ] **Step 3: Run** `npx vitest run --project unit tests/unit/skill-icons.test.ts` → FAIL (module missing).

- [ ] **Step 4: Implement `src/lib/skill-icons.ts`.**
  - Simple Icons: `import * as si from 'simple-icons'`, build a `Map<slug, icon>` from `Object.values(si)`; output `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="…"/></svg>`.
  - Lucide: read `lucide-static/icons/<name>.svg` via `createRequire(import.meta.url).resolve` + `readFileSync`; strip the license comment, `class`, `width`, `height` attributes; add `aria-hidden="true" focusable="false"`. Validate `<name>` against `/^[a-z0-9-]+$/` before resolving.
  - `brandHover`: `'#'+hex` unless WCAG relative luminance of the hex is `< 0.05` or `> 0.85`, then `null`.
  - Memoise results in a `Map<string, …>`.

- [ ] **Step 5: Run** the test file → PASS. Then `npm run check` → 0 errors.

- [ ] **Step 6: Commit** — `git add package.json package-lock.json src/lib/skill-icons.ts tests/unit/skill-icons.test.ts && git commit -m "feat: skill icon resolver for simple-icons and lucide"`

---

### Task 2: Skill data — `icon` and `core`

**Files:**
- Modify: `src/data/skills.yaml`, `src/content.config.ts:5-14`
- Test: `tests/unit/skills-data.test.ts`

**Interfaces:**
- Consumes: `resolveIcon`, `SKILL_CATEGORIES` (Task 1).
- Produces: skills collection entries with `icon: string` (required) and `core: boolean` (default `false`). The `category` enum in `content.config.ts` is built from `SKILL_CATEGORIES` ids.

- [ ] **Step 1: Write failing tests** — parse `src/data/skills.yaml` with `yaml`:
  - every skill has an `icon` and `resolveIcon(icon)` does not throw;
  - skills with `core: true`, in file order, have ids exactly `['typescript','go','python','nestjs','postgresql','redis','kafka','kubernetes','langgraph','ollama']`.

- [ ] **Step 2: Run** `npx vitest run --project unit tests/unit/skills-data.test.ts` → FAIL.

- [ ] **Step 3: Add fields to `skills.yaml`** (keep existing fields/order; `core: true` on the 10 above). Icon per id:

| id | icon | id | icon |
|---|---|---|---|
| typescript | si:typescript | claude-harnesses | si:claude |
| go | si:go | zero-shot-classification | lucide:tags |
| python | si:python | deepeval | lucide:flask-conical |
| kotlin | si:kotlin | giskard | lucide:shield-alert |
| sql | lucide:table | keycloak | si:keycloak |
| nestjs | si:nestjs | oauth2-oidc | si:openid |
| nodejs | si:nodedotjs | hmac-signing | lucide:key-round |
| fastapi | si:fastapi | token-session-design | lucide:fingerprint |
| gin | si:gin | privacy-retention | lucide:user-lock |
| grpc | lucide:waypoints | kubernetes | si:kubernetes |
| typeorm | si:typeorm | ansible | si:ansible |
| postgresql | si:postgresql | docker-compose | si:docker |
| redis | si:redis | hetzner | si:hetzner |
| milvus | si:milvus | oracle-cloud | lucide:cloud |
| neo4j | si:neo4j | hybrid-deployments | lucide:network |
| kafka | si:apachekafka | object-storage | lucide:hard-drive |
| rabbitmq | si:rabbitmq | react | si:react |
| pgvector | lucide:arrows-up-from-line | nextjs | si:nextdotjs |
| semantic-search | lucide:file-search | astro | si:astro |
| rag | lucide:brain-circuit | tailwind | si:tailwindcss |
| mcp | lucide:plug | react-native | si:react |
| langchain | si:langchain | websockets | lucide:cable |
| langgraph | si:langgraph | sse | lucide:activity |
| ollama | si:ollama | push-notifications | lucide:bell |
| whisper | lucide:mic | chat-widgets | lucide:message-circle |
| nllb-200 | si:huggingface | fine-tuning | lucide:sliders-horizontal |
| embeddings | lucide:binary | docling | lucide:file-text |
| pii-redaction | lucide:eye-off | | |

- [ ] **Step 4: Update the schema** — add `icon: z.string().refine(…resolveIcon doesn't throw…, …)` (so an unknown icon fails `astro build`) and `core: z.boolean().default(false)`.

- [ ] **Step 5: Run** unit tests → PASS; `npm run check` → 0 errors.

- [ ] **Step 6: Commit** — `feat: icon and core fields on skills`

---

### Task 3: `SkillIcon` + `SkillsGrid` on `/about`

**Files:**
- Create: `src/components/SkillIcon.astro`, `src/components/SkillsGrid.astro`
- Delete: `src/components/SkillsMatrix.astro`
- Modify: `src/pages/about.astro:5,37`, `src/styles/global.css` (component rules next to `.chip`)
- Test: `tests/dist/pages.test.ts` (`describe('about')`)

**Interfaces:**
- Consumes: `resolveIcon`, `SKILL_CATEGORIES`, `LEVEL_LABELS`.
- Produces: `SkillIcon.astro` — props `{ icon: string; class?: string }`; renders `<span class="skill-icon {class}" style="--brand: <brandHover>">{svg}</span>` (no `style` when `brandHover` is null). CSS: `.skill-icon` is `inline-flex`, svg `1em`; `:is(a,li):hover > .skill-icon[style]` → `color: var(--brand)`; concept (non-brand) icons get `text-muted`.

- [ ] **Step 1: Replace** the `has the skills matrix` test with:
  - `#skills .skill-group` count = 8; their `h3` texts equal `SKILL_CATEGORIES.map(c => c.label)`.
  - `#skills li[id^="skill-"]` count = number of entries in `skills.yaml` (56); each contains `svg[aria-hidden="true"]` and a `.sr-only` whose text is one of `Object.values(LEVEL_LABELS)` in parentheses.
  - `#skills table` is null.
  - `#skills` contains a level legend (`.skill-legend`) with the three labels.

- [ ] **Step 2: Run** `npm run build && npx vitest run --project dist tests/dist/pages.test.ts` → FAIL on the new assertions.

- [ ] **Step 3: Implement `SkillsGrid.astro`** — `getCollection('skills')`; legend line; `<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">` of `<li class="card skill-group">` per category with `<h3>` (category icon + label) and a wrapping `<ul class="flex flex-wrap gap-2">` of skill items: `<li id="skill-{id}" class="chip inline-flex items-center gap-1.5">` → `SkillIcon`, name, level dot (`aria-hidden`: ● daily, ◦ production, · familiar), `<span class="sr-only">(level label)</span>`. Swap it into `about.astro`; delete `SkillsMatrix.astro`. Update the page's intro line only if it no longer fits.

- [ ] **Step 4: Run** build + dist tests → PASS (whole `dist` project, so CV/API/twins tests confirm nothing else moved).

- [ ] **Step 5: Commit** — `feat: visual skills grid on about`

---

### Task 4: `CoreStack` on the home page

**Files:**
- Create: `src/components/CoreStack.astro`
- Modify: `src/pages/index.astro` (new section after "What I build")
- Test: `tests/dist/pages.test.ts` (`describe('home')`)

**Interfaces:**
- Consumes: `SkillIcon`, skills collection `core` flag.

- [ ] **Step 1: Write failing tests** in `describe('home')`:
  - `.core-stack li` texts (trimmed) equal `['TypeScript','Go','Python','NestJS','PostgreSQL','Redis','Kafka','Kubernetes','LangGraph','Ollama']` (excluding the "All skills" link item), each containing an `svg`.
  - Section has an `h2` "Core stack" and a link `a[href="/about#skills"]`.
  - No element on `/` matches `[id^="skill-"]`.

- [ ] **Step 2: Run** build + test → FAIL.

- [ ] **Step 3: Implement** — `<section class="container-page py-10" aria-labelledby="core-stack-h">`, header row matching the other home sections (`h2` + "All skills →" link at right), then `<ul class="core-stack flex flex-wrap gap-2">` of `<li><a class="chip inline-flex items-center gap-1.5" href="/about#skill-{id}">` with `SkillIcon` + name.

- [ ] **Step 4: Run** build + full `dist` suite → PASS. Start `astro dev --background`, view `/` and `/about` at 375px and desktop in light and dark; confirm wrap, no horizontal scroll, hover colours. `astro dev stop`.

- [ ] **Step 5: Commit** — `feat: core stack strip on home`

---

### Task 5: Icons in `StackChips`

**Files:**
- Modify: `src/components/StackChips.astro`
- Test: `tests/dist/projects.test.ts` (or `experience.test.ts`, whichever already loads a detail page)

- [ ] **Step 1: Write failing test** — on one project detail page, every `ul[aria-label="Stack"] a.chip` contains `svg[aria-hidden="true"]` and still links to `/about#skill-<id>`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — add `<SkillIcon icon={s.data.icon} />` before the name; chip becomes `inline-flex items-center gap-1.5`.
- [ ] **Step 4: Run** `npm run build && npm run test:unit && npm run test:dist` → all PASS.
- [ ] **Step 5: Commit** — `feat: icons on project and role stack chips`
