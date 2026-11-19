# Open Source Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a curated, static open-source section (page, home block, nav, CV, agent outputs) for five public projects.

**Architecture:** One static data collection (`oss`, from `src/data/oss.yaml`) feeds the `/open-source` page, a home block, the CV and every agent output, exactly like the v1 collections. No network at build.

**Tech Stack:** Astro 7 content collections (file loader), Zod 4, Vitest, node-html-parser (existing).

**Spec:** `docs/superpowers/specs/2026-11-19-open-source-design.md` (and the v1 design it extends).

## Global Constraints

- Entries, in order: `ai-stones`, `archio`, `translator`, `pg-inspector`, `tracking-kit`. No other repo name (`source-graph`, `starters`, `storage`, `news`, `scrapper`) appears in any built text output.
- Licences: `MIT` for ai-stones, `Apache-2.0` for the rest.
- No stars, download counts or "last updated" figures.
- All v1 global constraints still apply (clean URLs, one h1, tables in `.table-scroll`, JS budget, plain commit messages with no co-author trailers or mention of Claude).
- Work on branch `feat/open-source`.

## Review Focus

1. Hidden repos leaking through text output (pages, twins, llms, API): dist test in Task 1 and Task 2.
2. Licence chip wording must be the SPDX id exactly (`MIT`, `Apache-2.0`): dist test in Task 1.
3. Header nav with six items must still fit at 360px: nav stays in the mobile "Menu" disclosure below `md`; checked visually in Task 1.

---

### Task 1: Data, page, nav and home block

**Files:**
- Create: `src/data/oss.yaml`, `src/pages/open-source.astro`, `src/components/OssCard.astro`, `tests/dist/oss.test.ts`
- Modify: `src/content.config.ts` (add `oss`), `src/components/Header.astro` (nav item), `src/pages/index.astro` (home block), `src/lib/og-pages.ts` (OG card)

**Interfaces:**
- Produces collection `oss`: `{ id, name, pitch (max 160), languages: string[], license: 'MIT' | 'Apache-2.0', repos: Array<{ label, url }>, links: Array<{ label, url }> (default []), highlights: string[] (2–4), order: number, related?: reference('projects') }`.
- Produces `getOss(): Promise<CollectionEntry<'oss'>[]>` in `src/lib/oss.ts`, sorted by `order`.

Entries (copy from the content spec; wording fixed here):

| id | name | languages | license | repos | links | pitch |
| --- | --- | --- | --- | --- | --- | --- |
| ai-stones | AI Stones | JavaScript, Node.js | MIT | GitHub `https://github.com/alouani-youssef/stones` | npm `https://www.npmjs.com/package/ai-stones` | A Node.js CLI that detects a project's stack and conventions, then generates a tailored Claude Code setup. |
| archio | archio | Go | Apache-2.0 | GitHub `…/archio` | — | Object storage in Go with a multi-node, high-availability cluster and semantic search over stored files, built on Docling. |
| translator | translator | Python | Apache-2.0 | GitHub `…/translator` | — | Low-cost, context-aware translation: NLLB-200 for simple text, an LLM above a complexity threshold, behind a three-tier cache. |
| pg-inspector | pg_inspector | Python | Apache-2.0 | GitHub `…/pg_inspector` | — | An MCP server that gives AI assistants safe, read-only access to PostgreSQL. |
| tracking-kit | Tracking kit | Go (Gin), TypeScript | Apache-2.0 | `tracker` `…/tracker`, `tracking-sdk` `…/tracking-sdk` | — | A Go/Gin user-recognition service and a TypeScript browser SDK, with every event HMAC-signed. |

Highlights per entry come only from the content spec's Projects and Open source tables (e.g. AI Stones: `npx ai-stones init`; `.claude/` hooks, skills and MCP servers plus AGENT.md and ROADMAP.md; published on npm under MIT with CI).

- [ ] **Step 1: Write the failing dist test** `tests/dist/oss.test.ts`: `/open-source` has one `h1` "Open source" and five `.oss-card` in the order above, each with a `.license` chip whose text is exactly its SPDX id and at least one `a[href^="https://github.com/alouani-youssef/"]`; AI Stones links to npm; header nav links to `/open-source`; home has an `#open-source` section listing the five names and linking to `/open-source`; no built page's text contains `source-graph`, `starters`, `scrapper`, or the word "stars".
- [ ] **Step 2:** `npm run build:preview && npm run test:dist -- oss`. Expected: FAIL (page missing).
- [ ] **Step 3:** Implement the collection, `getOss`, `OssCard`, the page, the nav item, the home block (after featured case studies), and the OG entry `{ slug: 'open-source', title: 'Open source', subtitle: 'AI Stones, archio, translator, pg_inspector and a tracking kit.' }`.
- [ ] **Step 4:** Build and run `npm run test:dist`. Expected: PASS (all suites). Screenshot `/open-source` and `/` at 375px (iframe method) and confirm no overflow.
- [ ] **Step 5:** Commit `feat: open-source page, nav and home block`.

### Task 2: CV and agent layer

**Files:**
- Modify: `src/pages/cv.astro`, `src/lib/twins.ts`, `src/lib/llms.ts`, `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`, `src/lib/api-schemas.ts`, `src/lib/api.ts`, `src/lib/resume.ts`, `src/pages/resume.json.ts`, `src/lib/jsonld.ts`, `src/pages/open-source.astro`, `tests/unit/agents.test.ts`, `tests/dist/agents.test.ts`, `tests/dist/oss.test.ts`

**Interfaces:**
- Consumes `getOss()` (Task 1).
- `API_NAMES` gains `'oss'`; `apiOss` schema: array of `{ id, updatedAt, url, name, pitch, languages, license, repos, links, highlights }` (`url` = `https://youssefalouani.com/open-source#<id>`).
- `buildResume(profile, roles, skills, recs, oss?)` adds `projects: [{ name, description: pitch, url: first repo url, keywords: languages }]` when `oss` is given.
- `buildLlmsTxt` input gains `oss: Array<{ id, name, pitch }>`; output gains `## Open source` with `- [<name>](<site>/open-source.md): <pitch>` lines.
- `ossJsonLd(entry): object` → `SoftwareSourceCode` with `name`, `description`, `codeRepository`, `programmingLanguage`, `license` (`https://spdx.org/licenses/<id>.html`), `author`.

- [ ] **Step 1: Write failing tests.** Unit: `buildResume(..., oss)` yields `projects[0].name === 'AI Stones'` and `url` the stones repo; `buildLlmsTxt` with one oss entry contains `## Open source` and `(https://youssefalouani.com/open-source.md)`; `API_SCHEMAS.oss` rejects an item without `license`. Dist: `/open-source.md` exists and lists the five names; `llms.txt` has `## Open source`; `api/oss.json` validates and has 5 items; `resume.json` has 5 `projects`; `/open-source` carries 5 `SoftwareSourceCode` JSON-LD items with `license` URLs; `/cv` text contains "Open source" and all five names; no agent output (`llms.txt`, `llms-full.txt`, `api/*.json`, `*.md`) mentions `source-graph`.
- [ ] **Step 2:** Run, expect FAIL. **Step 3:** Implement. **Step 4:** `npm run test:unit && npm run build:preview && npm run test:dist && npm run check`, expect all PASS and 0 errors.
- [ ] **Step 5:** Commit `feat: open source in cv, llms, api, resume and json-ld`.
