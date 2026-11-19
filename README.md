# youssefalouani.com

Personal site of Youssef Alouani, Lead Backend & AI Engineer. Static [Astro](https://docs.astro.build) site that serves people styled HTML and serves AI agents Markdown and JSON from the same content.

- Content spec: `docs/Youssef Alouani — Portfolio Content & Spec.md`
- Design: `docs/superpowers/specs/2026-11-19-portfolio-v1-design.md`

## Commands

| Command | What it does |
| --- | --- |
| `npx astro dev --background` | Dev server in the background (`npx astro dev stop` to stop) |
| `npm run build:preview` | Preview build: placeholder metrics show a "sample" badge, draft posts render with `noindex` |
| `npm run build` | Production build. **Fails** while any case-study metric is still a placeholder |
| `npm run test:unit` | Unit tests for `src/lib` |
| `npm run test:dist` | Tests over `dist/` (run after `build:preview`) |
| `npm run check` | Type check |
| `npm run media` | Re-export case-study screenshots from `docs/` into `src/assets/`, blurring personal data |

## Where things live

- `src/data/profile.ts`: headline, bios, expertise cards, FAQ, `/now`, contact
- `src/data/{skills,clients,recommendations}.yaml`: skills matrix, grouped clients, LinkedIn quotes
- `src/content/experience/en/*.mdx`: the five roles
- `src/content/projects/en/*.mdx`: case studies
- `src/content/blog/en/*.mdx`: posts (Medium entries are frontmatter only)
- `src/lib/`: everything generated for agents (`twins.ts`, `api.ts`, `llms.ts`, `resume.ts`, `jsonld.ts`)

Agent outputs: `/<page>.md` twins, `/llms.txt`, `/llms-full.txt`, `/resume.json`, `/api/{profile,experience,projects,skills,posts}.json` with schemas under `/api/schema/`, `/robots.txt`, `/sitemap-index.xml`, `/rss.xml`.

## Confirming a metric

Each metric in a case study's frontmatter starts as `placeholder: true`. When the real number is known, set the value and change it to `placeholder: false`. The production build passes once none remain.

## Publishing the Whisper post

`src/content/blog/en/whisper-saudi-dialect.mdx` is a draft. Review every `{/* CHECK */}` marker, set the real `pubDate`, change `draft: true` to `draft: false`, and add `post: "/blog/whisper-saudi-dialect"` to the `links` of `src/content/projects/en/saudi-stt.mdx`.

## Deploying (Cloudflare Pages)

- Build command `npm run build`, output directory `dist`, Node 22.
- Environment variable `PUBLIC_CF_ANALYTICS_TOKEN` enables Cloudflare Web Analytics (no cookies); omit it to ship without analytics.

## Launch checklist

- [ ] Buy youssefalouani.com and connect it to Cloudflare Pages
- [ ] Create the hello@youssefalouani.com mailbox
- [ ] Confirm or correct the four placeholder metrics
- [ ] Review the CHECK markers: `grep -rn "CHECK" src/content`
- [ ] Replace the Qalqul screenshots in `src/assets/experience/qalqul/` with the cropped versions
