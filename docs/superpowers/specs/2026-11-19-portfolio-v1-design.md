# Portfolio v1: design

19 Nov 2026 · Source of truth for content: `docs/Youssef Alouani — Portfolio Content & Spec.md` (called "the content spec" below). This document covers how v1 gets built; it does not repeat copy that lives in the content spec.

## Intent

A personal site at youssefalouani.com that presents Youssef as a **Lead Backend & AI Engineer, founder of Osoul**, to two audiences at once:

- **People** (recruiters, founders, engineers) who decide in about ten seconds whether to read on.
- **AI agents and search** (ChatGPT, Claude, Perplexity, ATS tools, coding agents) that answer "who is Youssef Alouani / has he done X?" from what they can parse.

Every claim on the site carries a checkable noun (a model, a system, a company, a number), and the same facts reach both audiences from one source.

## Goals (v1)

- Ship the v1 scope from the content spec's "Launch scope": Home, About (with FAQ), Experience (+ one page per role), `/now`, Contact, `/cv`; case studies for **Osoul**, **Saudi-dialect speech-to-text** and **Customer Voice (RAG + MCP)**; one new blog post; the full agent layer; English only (French moves to v1.1, decided by Youssef).
- One content model drives every output: HTML pages, `.md` twins, `/api/*.json`, `resume.json`, `llms.txt`, `llms-full.txt`, JSON-LD.
- Lighthouse 95+ on all four scores, under 50 KB of JS per page, AA contrast, one `h1` per page.

## Non-goals (v1)

- `/open-source` from the GitHub API (v1.2), `/talks` (hidden until entries exist).
- Case studies beyond the three above (AI Stones, archio, Finamaze KYC, Osoul sub-cases come in v1.1+).
- An MCP endpoint for the site, a CMS, comments, a newsletter.
- French (`/fr/`) content: v1.1. The i18n routing and `{ en, fr }` content shape are built in v1 so French drops in without restructuring.
- Arabic version.

## Anti-goals (would be a failure even if it works)

- Flashy or "sci-fi" visuals: glows, gradients, particle or animated backgrounds, skill-percentage bars, logo walls.
- Agent-only content: anything in `llms.txt` or JSON that is not also visible on a page.
- Placeholder metrics shipped as real claims.
- Leaking personal or client data through screenshots (names, phone numbers, real transcripts, client data).
- Generic or AI-generated diagrams standing in for Youssef's actual systems.

## Constraints

- **Stack**: Astro 7 (already installed, `astro@^7.4.13`), Tailwind, MDX, static output. Node 22+ (machine runs v26). Dev server via `astro dev --background` (AGENTS.md).
- **Verify Astro 7 APIs against https://docs.astro.build** before writing code: content collections, the `z` import location, the fonts API, i18n routing and the image pipeline have all changed across majors. The `content.config.ts` sketch in the content spec is a guide, not a drop-in.
- **Near-zero client JS**: Astro islands only where needed (command palette, theme toggle). No React runtime on content pages.
- **Static only**: no server routes; every agent-layer file is generated at build time.
- **Confidentiality**: employer work at architecture level only. HRSD and Tahreez may be named as clients but never tied to screenshots or data.

## Approaches considered

1. **From scratch on the blank Astro starter (chosen).** Content collections + MDX + Tailwind, then thin v1 pages, then the agent layer. Slower to first pixels, but the content model, `.md` twins, JSON and `llms.txt` all come from one source, as the content spec requires, and the result can be published later as the portfolio theme the content spec lists as an OSS idea.
2. **Adapt an existing Astro portfolio theme** (for example AstroPaper). Polished in a day, but its content model does not match the case-study template or the agent layer, so the saved time goes into bending it, and the result is not publishable as an original theme.

Youssef picked option 1.

## Decisions

### Visual direction (decided by Youssef: clean, high-contrast, minimalist, restrained palette)

- Near-black text on off-white; inverted in dark mode. Light and dark themes follow the OS, with a manual toggle stored per visitor.
- **One muted accent**, used only for links, focus rings and the active nav item. *Builder's call*: start with a deep muted blue as a single CSS token; changing it must be a one-line edit.
- **Type**: one variable sans (*builder's call*: Inter) and one mono (*builder's call*: JetBrains Mono) for code, tool names (`track_order`, `reservations.createReservation`) and stack chips. Self-hosted through Astro's fonts API, no Google Fonts request at runtime.
- 65–75 character line length for prose; generous white space; thin 1px borders instead of shadows; no gradients.
- Screenshots in plain neutral frames (rounded corner, 1px border, caption below). Mobile screenshots shown at phone width, side by side on desktop.
- Motion: none beyond hover/focus transitions; `prefers-reduced-motion` removes those too.

Home page, sketched:

```
┌──────────────────────────────────────────────────────────────┐
│ Youssef Alouani        Experience Projects Blog About  ⌘K ◐ │
├──────────────────────────────────────────────────────────────┤
│ Lead Backend & AI Engineer, founder of Osoul.        [photo] │
│ I build multi-tenant platforms and the AI systems            │
│ that run on them.                                            │
│ [Contact]  [CV]                                              │
├──────────────────────────────────────────────────────────────┤
│ Backend & distributed │ Applied AI & LLM │ Speech & │ Security│
│ systems               │ systems          │ language │ platform│
├──────────────────────────────────────────────────────────────┤
│ Featured: Osoul · Saudi-dialect STT · Customer Voice         │
├──────────────────────────────────────────────────────────────┤
│ Clients I have worked for                                    │
│  Government: HRSD · King Saud Medical City                   │
│  Banks & insurers: SNB · Crédit du Maroc · SANLAM · ...      │
│  Groups: Hertz · Barceló Group · Atlas Group                 │
│  Growth: YouCan · CityClub · Tahreez                         │
│ "He naturally thinks like an architect..." (recommendation)  │
│ Latest posts (3)                                             │
└──────────────────────────────────────────────────────────────┘
```

### Information architecture

Routes exactly as the content spec's "Pages" table, minus `/open-source` and `/talks` for v1. French mirrors every route under `/fr/` with Astro's i18n routing; English is the default locale without a prefix. `hreflang` alternates on every page.

### Content model

Collections as in the content spec (`skills`, `experience`, `projects`, `blog`), adapted to Astro 7's API. `oss` is deferred to v1.2. Additions:

- `profile` (single data file): headline, one-liner, short and long bio, location, languages, links, `sameAs`, contact. Feeds Home, About, JSON-LD, `resume.json`, `/api/profile.json`.
- `clients` (data file): the twelve clients from the content spec, each with a `group` (government, banks-insurers, groups, growth), an order within the group, and a reference to its experience entry. Clients are always rendered grouped, never as a flat list. Hospitality clients use the parent group name (Barceló Group, Atlas Group), never the venue.
- `recommendations` (data file): the three LinkedIn quotes with author, relationship, date, link.
- Locale: each MDX entry has an `en` and `fr` file (`osoul.en.mdx`, `osoul.fr.mdx`) sharing one id; data files carry `{ en, fr }` for translatable strings.
- `metrics[].placeholder` as in the content spec. **Rule**: preview builds show a "sample" badge; the production build fails while any placeholder metric remains on a page that is published.

### Media

Source images stay in `docs/` as originals. The builder copies the ones in use to `src/assets/<collection>/<slug>/` so Astro's image pipeline produces responsive AVIF/WebP with width and height set. Mapping for v1:

| Page | Images |
| --- | --- |
| Home / About | `media/alouani_youssef.png` (headshot). `media/personal_picture.jpg` is unused in v1. |
| Osoul case study | `osoul/portal_dashboard.png`, `osoul/recommendations.png`, `osoul/dish_paring.png` (Guest App), `osoul/mobile_app.png` (Waiter App) |
| Saudi-dialect STT case study | `sowtek/saudi_dialect.png` (live Saudi-dialect transcript with a `track_order` tool call) |
| Customer Voice case study | No screenshot. Architecture diagram drawn for the page. `sowtek/voice_customer.jpeg` is **not** used (generic, AI-generated RAG comparison). |
| Experience: Axelerated | `sowtek/inbox_module.jpeg`, `sowtek/automation.jpeg`, `sowtek/social_media.jpeg` as product context |
| Experience: Qalqul | `qalqul/calls.png`, `qalqul/tickets.png`, `qalqul/customer_profile.png` (after Youssef crops the nav bar) |
| Experience: Finamaze | `finamaze/onboarding.png`, `finamaze/mobile_apps.png` |
| Experience: 10xJobs | `10xjobs/*.png` |

**Redaction before use**: `osoul/portal_dashboard.png` shows a staff member's name ("Yassine Alaoui", bottom-left) and a guest's phone number inside the assistant's payload. Both are blurred in the copy under `src/assets/`; the original in `docs/` is left untouched. The venue name Shanzoo visible in the screenshot may stay; captions name the parent, Atlas Group. Every image gets descriptive alt text written from what it actually shows.

### Diagrams

Architecture diagrams are inline SVG authored by hand (or rendered from Mermaid at build time and inlined), with the Mermaid source in the MDX next to it so agents can read it. Colours come from the theme tokens so they work in both themes. v1 needs three: Osoul platform overview, Saudi STT pipeline (WhatsApp + Asterisk audio → preparation → Whisper large-v3 fine-tune → transcripts), Customer Voice (sources → ingestion → Milvus → gRPC retrieval module → MCP retriever, with Keycloak and the retention layer around it).

### Agent layer

As in the content spec's "AI-agent layer" table: JSON-LD per page type, open `robots.txt` naming the AI crawlers, sitemap and RSS, `.md` twin for every page linked by `<link rel="alternate" type="text/markdown">`, `llms.txt`, `llms-full.txt`, `resume.json` (JSON Resume schema), `/api/{profile,experience,projects,skills,posts}.json` with JSON Schemas at `/api/schema/*.json`, About FAQ with `FAQPage` JSON-LD. All generated from the collections at build time.

### Site features

- Command palette (Ctrl/Cmd+K) and search with Pagefind, static.
- Per-page Open Graph image generated at build time from the title (and the page's diagram where one exists).
- `/cv` prints cleanly to PDF; the Contact page's "CV download" links to `/cv` for v1 (*builder's call*: generated PDF files can come later).
- Analytics: Cloudflare Web Analytics, no cookies.

### Hosting

*Builder's call*: Cloudflare Pages (the content spec allows Cloudflare or Vercel; Cloudflare adds AI-crawler analytics).

### Quality gates in CI

`astro check`, production build (fails on placeholder metrics), JSON Schema validation of every `/api` file, link check over `llms.txt` and the `.md` twins, Lighthouse CI budget (95+, < 50 KB JS).

## Build order

1. Foundation: Tailwind, theme tokens, fonts, base layout, header/footer, theme toggle, i18n routing.
2. Content model and data: collections and schemas, profile, skills, experience (five roles), clients, recommendations, in English.
3. Pages: Home, About + FAQ, Experience + role pages, `/now`, Contact, `/cv`.
4. Case studies: template, then Osoul, Saudi STT, Customer Voice with media and diagrams.
5. Blog: collection, index with external Medium entries, RSS, the first new post.
6. Agent layer: JSON-LD, `.md` twins, `/api` + schemas, `resume.json`, `llms.txt`, `llms-full.txt`, robots, sitemap.
7. Polish and gates: command palette, Pagefind, OG images, analytics, CI checks, deploy.

## Left to the builder

Component structure, Tailwind configuration details, exact spacing and type scale, the accent hue within "deep muted blue", how `.md` twins are generated (endpoint per route or a post-build step), and how OG images are rendered, as long as the decisions above hold.

## Answers from Youssef (19 Nov 2026)

- **Metrics**: use realistic numbers based on Youssef's real-world experience. The builder proposes a figure for each v1 case-study metric (word error rate before/after, no-show change, average-ticket change, calls per month), keeps `placeholder: true` on each, and lists them for Youssef. He confirms or corrects each one; confirming flips it to `placeholder: false`. The production gate stays: nothing ships as a claim until he has confirmed it, because interviewers will ask about every number.
- **French**: English first; French in v1.1.
- **First blog post** (fine-tuning Whisper large-v3 for Saudi dialect): the builder writes the full draft and fills the factual gaps with realistic details, each marked in the MDX with a `{/* CHECK */}` comment. The post stays `draft: true` until Youssef reviews and enhances it, so it does not publish with unchecked facts.
- **Contact**: a new address on the domain (for example `hello@youssefalouani.com`), held in the `profile` data file; a placeholder until the domain and mailbox exist. No booking link in v1.
- **Clients**: grouped by organisation type and size, with hospitality clients named by parent group (Barceló Group, Atlas Group). These are the names used everywhere.
- **Upstream contributions**: none; the RabbitMQ and Centrifugo mentions were only discussions and are removed from the content spec.

## Open items

Listed in the content spec's "Open questions" (real metrics, hidden repos). Questions raised by this design are answered below once Youssef replies.
