# v1.1 piece 1: Open source — design

19 Nov 2026 · Extends `2026-11-19-portfolio-v1-design.md`. Facts come from the content spec ("Projects", "Open source contributions") and Youssef's answers below.

## Intent

v1 never mentions Youssef's open-source work. Recruiters and agents asking "has he built X in public?" find nothing. This adds a curated `/open-source` page and surfaces the same entries everywhere the site already speaks: home, CV, and the agent layer.

## Decisions (Youssef)

- Shown, in this order: AI Stones (`stones`), archio, translator, pg_inspector, tracking kit (`tracker` + `tracking-sdk` as one entry).
- Hidden: `source-graph`, `starters`, `storage`, `news`, `scrapper`, `portfolio`, profile README.
- archio is described with both angles: object storage with a multi-node high-availability cluster, and semantic search built on Docling.
- Licences shown on every entry: MIT for AI Stones (as published on npm), Apache-2.0 for the rest ("Apache-2.0 when none is selected").
- Fully static: a data file, no GitHub API at build. No stars or "last updated" figures (they would go stale).

## Approaches considered

1. Curated data plus build-time GitHub enrichment: live numbers, but a network dependency at build.
2. **Fully static curated list (chosen):** deterministic builds, wording fully under Youssef's control; numbers omitted rather than stale.
3. Generated from the GitHub API: depends on thin GitHub descriptions and needs a hide list.

## Design

- **Data**: `src/data/oss.yaml`, a new `oss` collection replacing the deferred GitHub-loader one: `id, name, repos: [{ label, url }], links: [{ label, url }] (npm etc.), languages, license, pitch (≤160), highlights (2–4), order, related?: project id` (AI Stones and archio gain case studies in piece 2).
- **Page** `/open-source`: one card per entry in order (name, pitch, languages and licence as chips, highlights, repo and package links). No "upstream contributions" section until there is one.
- **Home**: an "Open source" block after the featured case studies: name and pitch per entry, link to `/open-source`.
- **Navigation**: "Open source" added between Projects and Blog.
- **CV**: an "Open source" section listing name, one-line pitch and repo URL.
- **Agent layer**: `/open-source.md` twin; an "Open source" section in `llms.txt` and in `llms-full.txt`; `/api/oss.json` with its schema; JSON-LD `SoftwareSourceCode` per entry on `/open-source`; `resume.json` `projects` from the same data.

## Anti-goals

- Hidden repos appearing anywhere in text output.
- Figures (stars, downloads) that can go stale.

## Known gap (not code)

GitHub detects no LICENSE file in any of these repos. Until a LICENSE file is added, the repos are legally "all rights reserved" whatever the site says. Adding Apache-2.0 (and MIT for `stones`) LICENSE files is a change to Youssef's GitHub repos and needs his go-ahead.
