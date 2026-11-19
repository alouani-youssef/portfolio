# Skills section — design

Date: 2026-11-19 · Size: small change (short design)

## Intent

Skills become a visual, reusable section instead of a text table: grouped by category, every skill shown with a logo or icon. It is the first of several major changes to the portfolio.

## Goals

- **`SkillsGrid.astro`** — the full catalogue, used on `/about#skills`. One card per category (8 groups), each skill an icon + name, level shown as a small marker with a legend (● daily · ◦ shipped in production · · familiar).
- **`CoreStack.astro`** — a short "core stack" strip for the home page: one row of icon + name pills, ending in "All skills →" linking to `/about#skills`.
- Both read the same `skills` collection and the same icon resolver, so any page can drop either in.

## Non-goals

- Fixing the per-skill `evidence` lists (each category currently repeats one list). Separate data task.
- Changing the CV, JSON API, llms.txt or markdown twins output — they keep reading `name`/`category`/`level` as today.

## Anti-goals

- No external requests, no client JavaScript for the section.
- Icons must stay legible in both light and dark themes.

## Approaches

- **A. Simple Icons (brand SVGs) + generic outline icons for concepts** — chosen. One visual style, follows the theme via `currentColor`, inlined at build time.
- B. Full-colour logos (Devicon / official SVGs) — rejected: dark logos vanish in dark mode, concept skills would look mismatched, more manual curation.
- Icon CDN (skillicons.dev etc.) — rejected: external requests, Lighthouse cost.

## How it's built

- **Dependencies (dev):** `simple-icons` (v16, CC0) for brands, `lucide-static` (ISC) for generic icons. Both are read at build time and inlined as `<svg>`; nothing ships to the client beyond the markup.
- **Data:** `skills.yaml` gains two optional fields, validated in `content.config.ts`:
  - `icon` — `si:<slug>` or `lucide:<name>`. Every skill gets one; a missing/unknown icon fails the build.
  - `core: true` — marks skills shown in the home strip (order = file order).
- **Coverage (checked against simple-icons 16.38.0):** brand logos exist for TypeScript, Go, Python, Kotlin, PostgreSQL, NestJS, Node.js, FastAPI, Gin, TypeORM, Redis, Milvus, Neo4j, Kafka, RabbitMQ, LangChain, LangGraph, Ollama, Hugging Face (NLLB-200), Claude, Keycloak, OpenID (OAuth2/OIDC), Kubernetes, Ansible, Docker, Hetzner, React, Next.js, Astro, Tailwind, React Native (React logo). Not available: gRPC, Oracle Cloud, Whisper/OpenAI → generic icons. Concept skills (SQL, RAG, MCP, Embeddings, PII redaction, Hybrid deployments, SSE, etc.) → matching Lucide icons.
- **Colour:** icons render in the foreground colour; on hover a brand icon takes its Simple Icons brand hex (falling back to accent where the hex is too dark/light for the current theme). Concept icons use the muted colour.
- **Category headers** also get a Lucide icon (code, server, database, sparkles, shield, cloud, layout, radio).
- **Anchors kept:** every skill in the grid keeps `id="skill-<id>"` so `StackChips` links and the API's `url` field still resolve.
- **Pages:** `/about` swaps `SkillsMatrix` → `SkillsGrid` (old component deleted). Home gets a "Core stack" section after "What I build".
- **Layout:** grid cards 1 column on phones, 2 on `sm`, 3–4 on `lg`; strip wraps on small screens.
- **Tests:** update `tests/dist/pages.test.ts` (`#skills table` → grid checks: 8 groups, every skill has an svg + anchor; home has the core strip). Add a unit check that every skill's icon resolves.

## Calls I made (check these)

- Proposed core stack: TypeScript, Go, Python, NestJS, PostgreSQL, Redis, Kafka, Kubernetes, LangGraph, Ollama.
- `StackChips` on project/role pages also gets the small icon, since it reuses the same resolver.
- Level marker style (dots + legend) rather than dropping levels from the visual.

## Left to the builder

Exact Lucide icon per concept skill, spacing/typography within the existing tokens, brand-hex contrast threshold.
