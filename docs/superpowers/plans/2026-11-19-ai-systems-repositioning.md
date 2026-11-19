# AI Systems Repositioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the review findings (wrong dates, inflated or unverified claims, mixed messaging, out-of-place cards, stale writing) and reposition the site toward an **AI Systems Engineer** role built on a backend foundation.

**Architecture:** One list of six focus areas (`src/lib/focus.ts`) drives the home expertise cards, the `/projects` grouping and each case study's `focus` field. Deep-dives hang off their parent case study through the existing `parent` reference, so the site shows 11 case studies and no content is deleted. Posts sort by a new `views` field. A production build now fails on unresolved `CHECK` markers, just as it already fails on placeholder metrics.

**Tech Stack:** Astro 7, MDX content collections, Zod (`astro/zod`), Tailwind 4, Vitest (`unit` and `dist` projects).

**Spec:** this conversation's review plus the user's answers, captured in "Decisions" below. There is no separate spec file.

## Decisions (from the user)

- Finamaze ran **Jul 2023 – Jan 2024**. Axelerated Solutions (AXS) ran **Feb 2024 – May 2026**.
- Education: **Bachelor's degree, 2017–2021**. The *Diplôme d'Ingénieur 2019–2022* is wrong.
- The Hertz client is **Hertz Morocco**.
- 10xJobs is a **side project started a month ago**: Oct 2026.
- The site targets **AI Systems Engineer** roles. Areas: Backend, mature NLP/NLU, ML/DL, Recommendation systems, ETL, Agentic systems and AI harnesses.
- Availability: **open to Backend & AI positions**. This replaces the "building Osoul full time" message.
- The skills stay, but the levels must show real mastery differences.
- Drafts show **no date**. Articles are listed **by popularity**, not by date.
- Two Medium accounts exist because the oldest one (`alouani-youssef.medium.com`) was lost. Posts stay linked where they live; only the current account is shown as a profile link.
- Mark the README launch checklist as done.

## Defaults (D1 and D3 confirmed by the user)

- **D1 Degree text (confirmed):** `Bachelor's degree in Computer Science`, `Hassan First University, FST Settat`, 2017–2021.
- **D2 Popularity:** a `views` number per post, taken from Medium stats and supplied by the user (Task 6 input).
- **D3 Drafts on the live site (confirmed):** listed last on `/blog` as "Coming soon": title and description only, no date, no link. Not in RSS, the sitemap, `/api`, `llms*.txt` or the home page.
- **D4 Project structure:** the area map in Task 4.

## Global Constraints

- New title, exactly: `AI Systems Engineer`.
- Copy style: no em-dash lists of buzzwords. Each expertise body is one or two sentences that state what was built.
- `oneLiner` stays ≤ 160 chars (the schema already enforces this).
- Commits: conventional prefixes (`feat:`, `fix:`, `content:`, `docs:`, `test:`). **No Co-authored-by trailers and no mention of Claude or AI tooling** (user's global rule).
- Work on branch `content/ai-systems-repositioning`, not `main`.
- After every task: `npm run test:unit && npm run build:preview && npm run test:dist && npm run check` all pass.

## Review Focus

1. **A deep-dive URL that is already shared** (for example `/projects/osoul-table-sessions`) must keep resolving after nesting. Only listings change, never slugs. Task 4 pins this with a dist test.
2. **A post without `views`** must still be listed, after every post that has views, newest first. It must not crash or jump to the top. Task 6 pins this.
3. **A draft in production** must not leak a date anywhere: not on its card, not in JSON-LD, not in `/api/posts.json`, not in `blog.md`. Task 6 pins this.
4. **Machine outputs** (`/resume.json`, `/api/experience.json`, `llms.txt`, the `.md` twins) must carry the new dates, degree and title, not stale copies. Tasks 1 and 2 assert the dist outputs.
5. **A production build with any `CHECK` left** must fail with a list of file:line entries, not ship silently. Task 7 pins this.

---

### Task 1: Correct the facts (dates, degree, 10xJobs, Hertz Morocco)

**Files:**
- Modify: `src/content/experience/en/finamaze.mdx`, `axelerated.mdx`, `10xjobs.mdx`
- Modify: `src/data/profile.ts` (`education`)
- Modify: `src/data/clients.yaml` (`hertz`)
- Test: `tests/dist/cv.test.ts`, `tests/dist/urls.test.ts`, `tests/dist/experience.test.ts`, `tests/unit/clients.test.ts`, `tests/dist/pages.test.ts`

**Interfaces:** Produces only data. The existing `partialDate(d, precision)` in `src/lib/resume.ts` already emits `YYYY-MM` for `precision: month`.

- [ ] **Step 1: Update the tests to the new facts**
  - `cv.test.ts:14`: expect `'Oct 2026 – now'`, `'Feb 2024 – May 2026'`, `'Jul 2023 – Jan 2024'` in place of the old periods.
  - `cv.test.ts:20` and `experience.test.ts:51`: expect `"Bachelor's degree in Computer Science, Hassan First University, FST Settat, 2017–2021"`, and add `not.toContain('Ingénieur')`.
  - `urls.test.ts:39,44`: Finamaze start/end `['2023-07', '2024-01']`. Add Axelerated `['2024-02', '2026-05']`.
  - New assertion in `experience.test.ts`: no two non-side-project roles overlap (`a.end < b.start` for consecutive roles sorted by start).
  - `clients.test.ts:32` and `pages.test.ts:43,48`: the name is `Hertz Morocco` and the alt text is `Hertz Morocco logo`.
- [ ] **Step 2: Run them and confirm they fail.** Run `npm run test:unit -- clients && npm run build:preview && npm run test:dist -- cv urls experience pages`. Expected: FAIL on the old strings.
- [ ] **Step 3: Edit the data**
  - finamaze: `start: 2023-07-01`, `end: 2024-01-31`, `period: Jul 2023 – Jan 2024`, `precision: month`.
  - axelerated: `start: 2024-02-01`, `period: Feb 2024 – May 2026`, `precision: month`.
  - 10xjobs: `start: 2026-10-01`, `period: Oct 2026 – now`, `role: Side project`. Keep `sideProject: true`.
  - profile `education`: `{ degree: "Bachelor's degree in Computer Science", school: 'Hassan First University, FST Settat', start: 2017, end: 2021 }`.
  - clients `hertz`: `name: "Hertz Morocco"`, `market: Morocco`.
- [ ] **Step 4: Run the Step 2 command again.** Expected: PASS.
- [ ] **Step 5: Commit.** `git commit -m "fix: correct role dates, degree and Hertz Morocco"`

### Task 2: Positioning and availability (title, headline, FAQ, contact)

**Files:**
- Modify: `src/data/profile.ts` (`jobTitle`, `headline`, `oneLiner`, `shortBio`, `faq`, `links`, `sameAs`)
- Modify: `src/pages/index.astro:17` (headline split), the hero eyebrow and `<title>`
- Modify: `src/pages/contact.astro` (eyebrow), `src/data/services.ts` (order and the role entry)
- Modify: every consumer of `profile.links.mediumA`/`mediumB` (find them with `grep -rn "mediumA\|mediumB" src`)
- Test: `tests/unit/profile.test.ts`, `tests/unit/jsonld.test.ts:14`, `tests/dist/pages.test.ts:15`, `tests/dist/cv.test.ts:11`

**Interfaces:**
- Produces: `profile.links.medium: string` (the current account, `https://alouaniyoussef.medium.com`). `mediumA`/`mediumB` are removed. `sameAs` keeps both Medium URLs, because both are still the user's identity.
- Produces: `splitHeadline(h: string): [lead: string, rest: string]` in `src/lib/markdown.ts`. It splits at the first `". "`.

- [ ] **Step 1: Update the tests**
  - profile: `headline` is `'AI Systems Engineer with a backend foundation. I build NLP, speech, recommendation and agentic systems, and the platforms they run on.'` and `jobTitle` is `'AI Systems Engineer'`.
  - jsonld: `mainEntity.jobTitle` is `'AI Systems Engineer'`.
  - pages: the home `h1` is `'AI Systems Engineer with a backend foundation.'`. The contact eyebrow contains `'Open to backend & AI positions'`. The FAQ text contains neither `'full time'` nor `'founder of 10xJobs'`.
  - cv: contains `'AI Systems Engineer with a backend foundation.'`.
  - unit `splitHeadline('A b. C d. E')` returns `['A b.', 'C d. E']`.
- [ ] **Step 2: Run the tests and confirm they fail.**
- [ ] **Step 3: Edit the copy**
  - `oneLiner`: `'Casablanca-based AI systems engineer and founder of Osoul: NLP/NLU, speech, recommendations, ETL and agentic systems on a solid backend.'`
  - `shortBio`: open with "AI systems engineer with five years of backend…". Keep the Osoul sentence.
  - FAQ "What does he do now?": "He builds Osoul… and runs 10xJobs as a side project."
  - FAQ "Is he open to new roles?": `'Yes. He is open to backend and AI engineering positions, remote or in Casablanca.'`
  - services: move `role` to the first position and rename it `'Backend & AI positions'`. Keep the other four under the existing grid. Change their section intro to say they are for "freelance or advisory work".
  - index `<title>`: `Youssef Alouani · AI Systems Engineer`. Hero eyebrow: `Casablanca · AI systems & backend`.
- [ ] **Step 4: Run the tests and confirm they pass.** Also run `grep -rn "Lead Backend & AI Engineer" src dist`. Expected: no hits.
- [ ] **Step 5: Commit.** `git commit -m "content: reposition as AI Systems Engineer, open to backend and AI roles"`

### Task 3: Six focus areas drive the expertise cards

**Files:**
- Create: `src/lib/focus.ts`
- Modify: `src/data/profile.ts` (schema for `expertise` and its six entries)
- Modify: `src/components/ExpertiseCards.astro` (grid `sm:grid-cols-2 lg:grid-cols-3`)
- Test: `tests/unit/profile.test.ts`, `tests/dist/pages.test.ts:17-21`

**Interfaces:**
- Produces, in `src/lib/focus.ts`:
  ```ts
  export const FOCUS_AREAS = [
    { id: 'agentic', title: 'Agentic systems & AI harnesses' },
    { id: 'nlp', title: 'NLP / NLU' },
    { id: 'ml', title: 'ML / DL & speech' },
    { id: 'recsys', title: 'Recommendation systems' },
    { id: 'etl', title: 'Data pipelines & ETL' },
    { id: 'backend', title: 'Backend & platform' },
  ] as const;
  export type FocusId = (typeof FOCUS_AREAS)[number]['id'];
  export const FOCUS_IDS: [FocusId, ...FocusId[]];
  ```
- Produces: an `expertise` item `{ id: FocusId, body: string, skills: string[], project: string }`. The title comes from `FOCUS_AREAS`, and the schema is `.length(6)` with unique ids in `FOCUS_AREAS` order.

- [ ] **Step 1: Update the tests.** profile: `expertise.map(e => e.id)` equals `FOCUS_AREAS.map(a => a.id)`. No body contains `KYC`, `DeepEval`, `Giskard`, `familiarity` or `AI Stones`. pages: 6 `.expertise-card` elements, with top-project hrefs `['/projects/customer-voice', '/projects/qalqul-nlu', '/projects/saudi-stt', '/projects/osoul-recommendations', '/projects/10xjobs-ingestion', '/projects/osoul']`.
- [ ] **Step 2: Run the tests and confirm they fail.**
- [ ] **Step 3: Write the six entries.** Bodies are exact copy:
  - agentic: `'RAG pipelines with an MCP server as the retriever, and assistants that act with the user's own permissions, redact personal data and ask before they write.'` skills `[rag, mcp, langgraph, langchain, claude-harnesses]`, project `customer-voice`
  - nlp: `'Intent classification and entity extraction tuned per client across Arabic, French and Darija, on language servers, Duckling and Botpress v12 core.'` skills `[duckling, botpress, zero-shot-classification, nllb-200]`, project `qalqul-nlu`
  - ml: `'Whisper large-v3 fine-tuned for Saudi-dialect calls, from audio preparation to evaluation, serving live transcripts and voice agents.'` skills `[whisper, fine-tuning, huggingface-transformers]`, project `saudi-stt`
  - recsys: `'Dish and drink pairings, meal-completion promos and event-based dynamic pricing, built on one menu data model.'` skills `[recommendation-systems, postgresql, redis]`, project `osoul-recommendations`
  - etl: `'Pipelines that collect, clean, extract into type-safe LLM schemas and load: job ingestion, call-recording pipelines and signed server-side CAPI events.'` skills `[data-pipelines, docling, clickhouse]`, project `10xjobs-ingestion`
  - backend: `'Multi-tenant SaaS with isolated data and identity per tenant, Kafka and RabbitMQ messaging, real time over WebSockets and SSE, Keycloak, and migrations to Kubernetes.'` skills `[nestjs, postgresql, kafka, keycloak, kubernetes]`, project `osoul`
- [ ] **Step 4: Run the tests and confirm they pass.**
- [ ] **Step 5: Commit.** `git commit -m "feat: six focus areas for the expertise cards"`

### Task 4: Projects by focus area; deep-dives nested

**Files:**
- Modify: `src/content.config.ts` (projects: add `focus: z.enum(FOCUS_IDS).optional()`)
- Modify: the frontmatter of all 21 `src/content/projects/en/*.mdx`
- Modify: `src/lib/projects.ts` (add `getProjectAreas`, keep `getProjectGroups` for `/experience` if it is used there)
- Modify: `src/pages/projects/index.astro` (group by area)
- Modify: `src/pages/index.astro` (replace the "All N projects, by company" block)
- Test: create `tests/unit/projects-structure.test.ts`, modify `tests/dist/projects.test.ts:25`

**Interfaces:**
- Consumes: `FOCUS_AREAS` and `FocusId` from Task 3.
- Produces: `getProjectAreas(): Promise<Array<{ id: FocusId; title: string; projects: CollectionEntry<'projects'>[] }>>`. It returns top-level projects only (no `parent`, `focus` set), sorted by `order`, in `FOCUS_AREAS` order, with empty areas dropped.

**Area map (D4):**

| focus | top-level (order) | children (`parent:`) |
|---|---|---|
| agentic | customer-voice★ 3, osoul-ai-assistant 11, ai-stones 4 | – |
| nlp | qalqul-nlu 41 | qalqul-botpress, qalqul-realtime → `en/qalqul-nlu` |
| ml | saudi-stt★ 2 | sowtek-voip → `en/saudi-stt` |
| recsys | osoul-recommendations 12 | – |
| etl | 10xjobs-ingestion 50, osoul-server-side-tracking 15 | 10xjobs-search → `en/10xjobs-ingestion` |
| backend | osoul★ 1, sowtek-omnichannel-chat 20, finamaze-kyc 30 | osoul-multi-tenancy, osoul-table-sessions → `en/osoul`; sowtek-flowbuilder → `en/sowtek-omnichannel-chat`; finamaze-keycloak, finamaze-migration → `en/finamaze-kyc` |

`osoul-ai-assistant`, `osoul-recommendations` and `osoul-server-side-tracking` lose their `parent` and become top-level. `archio` gets neither field and appears only on `/open-source`. ★ = `featured: true` (unchanged).

- [ ] **Step 1: Write the failing structure test** (it reads the frontmatter with `yaml` the way `content-review.test.ts` reads files):
  - every project has exactly one of `focus` or `parent`, except `archio`, which has neither
  - every `parent` points to a project that has `focus` (one level of nesting only)
  - top-level count is `11`, child count is `10`
  - featured ids are `['osoul', 'saudi-stt', 'customer-voice']`
- [ ] **Step 2: Update the dist tests.** `/projects` shows 11 cards (`projects.test.ts:25`) and 6 `section[data-focus]` elements in `FOCUS_AREAS` order. Every one of the 21 project URLs (including archio) still returns a page. Each child page links back to its parent (`a[href="/projects/<parent>"]`). The home page has at most 2 links whose text matches `/projects/i` and points to `/projects`.
- [ ] **Step 3: Run the tests and confirm they fail.**
- [ ] **Step 4: Implement.** Apply the area map to the frontmatter. Add `getProjectAreas`. `/projects` renders one `<section data-focus={id}>` per area, with the title from `FOCUS_AREAS` and each card followed by a "Deep dives" list of its children (title and link). The intro line reads `{n} case studies in six areas, with deep dives inside each.` On the home page, delete the company block (lines 64–83) and the duplicate CTAs. Keep one "See all projects" link in the expertise header and the "All N projects →" link on the featured header.
- [ ] **Step 5: Run the tests and confirm they pass.**
- [ ] **Step 6: Commit.** `git commit -m "feat: group projects by focus area and nest deep dives"`

### Task 5: Skills show real mastery

**Files:**
- Modify: `src/data/skills.yaml`, `src/content.config.ts` (`level` enum), `src/components/SkillsGrid.astro:6` and its legend
- Test: `tests/unit/skills-data.test.ts`

**Interfaces:** `level: 'expert' | 'production' | 'familiar'` (`daily` becomes `expert`). Legend: `● expert`, `◦ shipped in production`, `· familiar`.

**Default `expert` set (≤ 12; the user may swap items):** python, typescript, sql, nestjs, fastapi, postgresql, redis, rag, mcp, langchain, whisper, recommendation-systems. Everything currently `daily` that is not in this list becomes `production`. These move from `production` to `familiar`: terraform, prometheus, grafana, gcp, robot-framework, neo4j, deepeval, giskard, argocd, ollama, clickhouse.

- [ ] **Step 1: Update the tests.** At most 12 skills are `expert`. Every `evidence` id is an existing project, experience or oss id (`en/` prefix stripped). The `nllb-200` evidence is exactly `['translator']`. The `duckling` and `botpress` evidence includes `qalqul`. The `FastAPI daily` test becomes `expert`.
- [ ] **Step 2: Run the tests and confirm they fail.** Expected: the evidence test lists the copy-pasted arrays (for example NLLB-200 → customer-voice, osoul, ai-stones).
- [ ] **Step 3: Fix the levels and rewrite each `evidence` array** to the roles and projects that actually used the skill. Source of truth: each experience entry's and project's own `skills:` list. A skill's evidence is every entry whose `skills` includes it, plus the oss ids that state it in `languages` or `highlights`.
- [ ] **Step 4: Run the tests and confirm they pass.**
- [ ] **Step 5: Commit.** `git commit -m "content: skills levels reflect mastery, evidence matches the work"`

### Task 6: Writing sorted by popularity; drafts without dates

**Files:**
- Modify: `src/content.config.ts` (blog: `views: z.number().int().nonnegative().optional()`)
- Modify: `src/lib/posts.ts`, `src/lib/post-queries.ts`
- Modify: `src/components/blog/PostCard.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/pages/index.astro` (writing section), `src/lib/twins.ts:106`
- Modify: the 10 `medium-*.mdx` files (add `views`)
- Test: `tests/unit/posts.test.ts`, `tests/dist/blog.test.ts`

**Interfaces:**
- `byPopularity<T extends { data: { views?: number; pubDate: Date } }>(a: T, b: T): number`: views descending, posts without views after posts with views, ties broken by `pubDate` descending.
- `publishedPosts(posts, opts)` keeps its signature but sorts with `byPopularity`.
- `upcomingPosts<T extends PostLike>(posts: T[]): T[]`: drafts only, sorted by title. Used by `/blog` in **every** build (D3).

**Input needed from the user:** the Medium view count for each of the 10 posts (Medium → Stats → Stories). Until a post has a number it sorts by date after the ranked ones, so the build never blocks on this.

- [ ] **Step 1: Write the failing unit tests**
  - `byPopularity`: `[{views:10},{views:50},{none, 2023},{none, 2024}]` sorts to `[50, 10, 2024, 2023]`
  - `publishedPosts` with `preview: false` still drops drafts
  - `upcomingPosts` returns only drafts
- [ ] **Step 2: Write the failing dist tests.** On `/blog`, the first card is the post with the most views. A `[data-upcoming]` list holds the 3 drafts, with a `Coming soon` badge on each, no `<time>` and no `<a href="/blog/…">` link. In production (`npm run build`), `/blog/whisper-saudi-dialect.html` does not exist, and `dist/api/posts.json`, `rss.xml`, `blog.md` and `llms.txt` do not mention any draft title. The home page section heading is `Most read`.
- [ ] **Step 3: Run the tests and confirm they fail.**
- [ ] **Step 4: Implement.** `PostCard` renders no `<time>` when `draft`, and swaps the `draft` badge for `Coming soon`. In preview, `[slug].astro` omits the `<time>` for drafts and `blogPostingJsonLd` omits `datePublished` for drafts. `/blog` renders the published grid (`getPosts(false)`, by popularity) and then the `upcomingPosts` list. The home page shows the top 3 by popularity under `Most read`, with no "Latest". `twins.ts` lists posts in the same popularity order.
- [ ] **Step 5: Add `views:` to the 10 Medium posts** from the user's numbers.
- [ ] **Step 6: Run the tests and confirm they pass**, including a production `npm run build`.
- [ ] **Step 7: Commit.** `git commit -m "feat: posts by popularity, upcoming drafts without dates"`

### Task 7: Launch gate on unverified claims, then resolve them

**Files:**
- Modify: `src/lib/metrics.ts` (add `checkMarkerViolations`), the place where `placeholderViolations` fails the production build (find it with `grep -rn placeholderViolations src`)
- Create: `docs/review/claims-to-confirm.md` (generated, committed for the user to fill in)
- Modify: `tests/unit/content-review.test.ts`
- Modify: the 28 content files with markers, and `metrics:` in `osoul`, `saudi-stt`, `customer-voice`, `finamaze-kyc`
- Test: `tests/unit/metrics.test.ts`

**Interfaces:** `checkMarkerViolations(files: Array<{ path: string; text: string }>): string[]` returns one `path:line: <line trimmed to 120 chars>` entry per line that contains `CHECK`.

- [ ] **Step 1: Write the failing test.** `checkMarkerViolations([{ path: 'a.mdx', text: 'x\nfoo {/* CHECK */}' }])` returns `['a.mdx:2: foo {/* CHECK */}']`, and returns `[]` for text without markers.
- [ ] **Step 2: Implement it.** Wire it next to the placeholder gate so that `npm run build` fails, listing every violation, over `src/content/**/*.mdx` and `src/components/diagrams/*.astro`. Preview builds only warn.
- [ ] **Step 3: Generate `docs/review/claims-to-confirm.md`.** One numbered row per marker: file, line, the full sentence, and a blank `Keep / Edit: … / Cut` column. Also list the 5 placeholder metrics and the 5 `differently:` lines. **Hand it to the user and stop until they fill it in.**
- [ ] **Step 4: Apply the answers.** Keep: remove the marker. Edit: replace the text, then remove the marker. Cut: delete the sentence (a bullet, decision or diagram label) and fix any numbering. A metric the user does not confirm is deleted, not left as a placeholder. A `differently:` line the user does not rewrite is deleted (make the field optional in `content.config.ts` and hide the section when it is absent).
- [ ] **Step 5: Replace the `FLAGGED` block in `content-review.test.ts`** (it now contradicts the gate) with a test asserting `checkMarkerViolations` over the content is `[]`. Keep the `FORBIDDEN` block.
- [ ] **Step 6: Run `npm run build`.** Expected: it succeeds, with no placeholder and no CHECK violations. Then run the full test suite.
- [ ] **Step 7: Commit.** `git commit -m "content: resolve unverified claims and gate production on CHECK markers"`

### Task 8: README launch checklist done

**Files:** Modify `README.md`

- [ ] **Step 1: Mark every launch checklist item `[x]`.** Delete the "Publishing the Whisper post" section if the post went live in Task 7. Otherwise leave it.
- [ ] **Step 2: Ask the user whether the Qalqul screenshots were replaced with the cropped versions.** If not, keep that single item unchecked.
- [ ] **Step 3: Run the full verification** (`test:unit`, `build`, `build:preview`, `test:dist`, `check`) and commit: `git commit -m "docs: launch checklist complete"`
