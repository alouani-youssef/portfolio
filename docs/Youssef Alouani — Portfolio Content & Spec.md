# Youssef Alouani — Portfolio Content & Spec

Nov 19, 2026 · @Youssef Alouani

## Positioning

Lead with one identity, Backend & AI Engineer, and treat full-stack as proof of range rather than a second headline. Three equal titles read as unfocused to recruiters and get flattened by AI summarisers.

**Headline (hero, title tag, LinkedIn, GitHub bio)**

Lead Backend & AI Engineer, founder of Osoul. I build multi-tenant platforms and the AI systems that run on them.

**One-liner (meta description, llms.txt summary, ≤ 160 characters)**

Casablanca-based backend and AI engineer, founder of Osoul. NestJS, Go, Python; RAG, MCP servers, speech-to-text, and secure multi-tenant SaaS.

**Short bio (about 50 words: cards, talk bios, Medium)**

Youssef Alouani is a senior backend and AI engineer in Casablanca and the technical founder of Osoul, a Revenue-as-a-Service (RaaS) growth engine for fine-dining restaurants. He has spent five years building backends, conversational AI and data pipelines at Qalqul, Finamaze and Axelerated Solutions, with a focus on security, privacy and systems that hold up in production.

**Long bio (about 150 words: About page)**

I'm a backend engineer who ended up deep in AI because the interesting problems kept landing there. I started at Qalqul Engine working on Botpress v12 core, NLP/NLU engines on language servers and Duckling, and no-code workflow systems, while shipping portals, Kotlin SDKs and React chat widgets. At Finamaze I worked on reconciliation and on KYC with document and visual verification, alongside AI for a robo-advisor. At Axelerated Solutions I was a founding engineer and the backend lead in a team of nine. I fine-tuned Whisper large-v3 for Saudi-dialect call transcription, built RAG on Milvus, coding agents, and the Customer Voice RAG pipeline with an MCP server as its retriever, plus an MCP server over our backend APIs validated through Keycloak, where I owned the auth flow and the privacy and data-retention layer.

Since June 2026 I've been building Osoul, a Revenue-as-a-Service (RaaS) growth engine for fine dining: a SaaS built around specific revenue KPIs, with management tools built in. It uses mature technologies to capture the data restaurants usually lose and turn it into better KPIs. Under the hood: NFC/QR table ordering, reservations, recommendation systems, ad signal infrastructure and a privacy-aware AI assistant for restaurants, on NestJS, PostgreSQL, Redis and Keycloak. I've also worked on platform migrations and hybrid deployments for banking and government institutions. I care about fundamentals, clean architecture, and AI that respects user data.

**Voice rules for all copy**

- First person on the site, third person in bios others will reuse.
- Every claim carries a noun you can check: a model, a system, a company, a number.
- No "passionate", "guru", "ninja" or skill-percentage bars.

## Experience

Five roles over five years, each with a clear AI thread; the site shows them as a timeline with a short case per role, and the same data feeds `/api/experience.json`.

| Period | Company | Role | What to highlight |
| --- | --- | --- | --- |
| Nov 2026 – now | 10xJobs | Founder | Multi-user SaaS built on Apify actors: a pipeline tuned for cost, efficiency and performance that finds jobs and matches them to each registered user's published profile |
| Jun 2026 – now | [Osoul](https://osoul.io) | Technical Founder | Revenue-as-a-Service (RaaS): a SaaS growth engine for fine dining built around specific revenue KPIs, with management tools built in, that turns lost data into KPI gains. Multi-tenant platform with NFC/QR ordering, reservations with deposits and bots, recommendation systems, ad signal infrastructure (CAPI ad-audience optimisation), AI assistant (LangChain, PII redaction, user auth propagation), POS/PMS integrations, identity merging, event-based dynamic pricing; front ends: Osoul Portal, Osoul Guest App, Osoul Waiter App (React Native); customers: Casa Harris, Shanzoo (Tangier) |
| 2024 – 2026 | Axelerated Solutions (Sowtek AXS) | Lead Backend Engineer, founding engineer (team of 9) | Whisper large-v3 fine-tuned for Saudi dialect (WhatsApp and Asterisk audio pipeline), RAG on Milvus, coding agents, tool-using chatbots, Customer Voice RAG pipeline with an MCP server as its main retriever (architecture, auth, privacy and retention), an MCP server over backend APIs with Keycloak request validation, knowledge-base search on Docling and zero-shot classification; migrations and hybrid deployments (see below); clients: HRSD, Tahreez |
| 2023 – 2024 | Finamaze | Backend Engineer | Reconciliation; KYC with document and visual verification; AI for robo-advisory; React/Next.js front ends; client: SNB |
| 2021 – 2023 | Qalqul Engine | Software Engineer | NLP/NLU engines built on language servers and Duckling, Botpress v12 core, no-code workflows and n8n, portals, browser SDKs in TypeScript, Kotlin SDKs, React chat widgets; clients: King Saud Medical City, Hertz, CDM, SANLAM, AtlantaSanad, CityClub, YouCan |

**Migrations and deployments**

Assisted as Lead Backend Engineer at Axelerated Solutions. Shown as its own block on the Axelerated role page and in the platform expertise card.

- Business model: B2C to B2B.
- Architecture: stateful to stateless services.
- Orchestration: Docker Compose to Kubernetes.
- Hosting: Hetzner to Oracle Cloud.
- Hybrid deployments for private, banking and government institutions.

**Clients (end customers you may name)**

Twelve named clients across banking, insurance, government, healthcare, retail and hospitality back up the hybrid-deployment and privacy claims. Show them as plain names under "Clients I have worked for" on Home and the relevant role pages: no links, no logos, no project details.

| Client | Role | Market | Sector |
| --- | --- | --- | --- |
| Casa Harris | Osoul | Morocco | Hospitality (restaurant-lounge) |
| Shanzoo (Tangier) | Osoul | Morocco | Hospitality (restaurant) |
| HRSD (Ministry of Human Resources and Social Development) | Axelerated Solutions | Saudi Arabia | Government |
| Tahreez | Axelerated Solutions | Saudi Arabia | Security and technology integration |
| Saudi National Bank (SNB) | Finamaze | Saudi Arabia | Banking |
| King Saud Medical City | Qalqul Engine | Saudi Arabia | Healthcare |
| Hertz | Qalqul Engine | International | Car rental |
| Crédit du Maroc (CDM) | Qalqul Engine | Morocco | Banking |
| SANLAM | Qalqul Engine | Morocco | Insurance |
| AtlantaSanad (spelling to confirm) | Qalqul Engine | Morocco | Insurance |
| CityClub | Qalqul Engine | Morocco | Fitness clubs |
| YouCan | Qalqul Engine | Morocco | E-commerce platform |

**Per-role page template**

1. Context: the company and the problem, two sentences.
2. My part: what I owned versus what the team owned.
3. Stack: chips that link to the skills section.
4. Outcome: one number or one before/after (to supply, see Open questions).
5. What I'd do differently: one honest line. Recruiters and agents both treat this as a seniority signal.

Education sits under the timeline: Diplôme d'Ingénieur d'État in Computer Science, Hassan First University, FST Settat, 2019–2022.

## Technical expertise and skills

Group skills by what you build, not by language, and tie each one to evidence (a project, role or post). Agents answering "has he done X?" need that link; a flat logo wall gives them nothing.

**Expertise areas (the four cards on the home page)**

1. **Backend and distributed systems**: multi-tenant SaaS, dual-database provisioning, API gateways, messaging (Kafka, RabbitMQ), real-time over WebSockets and SSE, push notifications, recommendation systems, ad signal infrastructure.
2. **Applied AI and LLM systems**: RAG on Milvus, MCP servers, tool-using agents with LangChain and LangGraph, local models via Ollama, OpenAI-compatible APIs, model-serving REST APIs with FastAPI, AI assistants with PII redaction and user auth propagation, familiarity with LLM evaluation tools (DeepEval, Giskard), and AI Stones, a personal AI harness for Claude.
3. **Speech and language**: Whisper large-v3 fine-tuning for Saudi dialect, call-audio data preparation, NLP/NLU engines on language servers and Duckling, Botpress v12 core, KYC document and visual verification.
4. **Security, privacy and platform**: Keycloak auth, data-retention and privacy layers, session-token design for NFC/QR tables, Kubernetes, Ansible, migrations (Docker Compose to Kubernetes, Hetzner to Oracle Cloud, stateful to stateless), hybrid deployments for banking and government institutions.

**Skills matrix (source for `/api/skills.json`)**

| Category | Skills | Evidence |
| --- | --- | --- |
| Languages | TypeScript, Go, Python, Kotlin, SQL | Osoul, Axelerated, Qalqul SDKs, archio (Go), tracking kit (Go/Gin, TypeScript) |
| Backend | NestJS, Node.js, FastAPI, Gin, gRPC, TypeORM | Osoul, RAG/MCP service, model-serving APIs, tracker |
| Data | PostgreSQL, Redis, Milvus, Neo4j, Kafka, RabbitMQ, pgvector, semantic search | Osoul, Axelerated RAG, Medium posts |
| AI / LLM | RAG, MCP, LangChain, LangGraph, Ollama, Whisper, NLLB-200, fine-tuning, embeddings, Docling, PII redaction, Claude agent harnesses, zero-shot classification, LLM evaluation and testing (DeepEval, Giskard) | Axelerated, Osoul AI assistant and recommendations, AI Stones, archio, translator, pg\_inspector, 10xJobs |
| Identity and security | Keycloak, OAuth2/OIDC, HMAC request signing, token and session design, data privacy and retention | Osoul table sessions, Axelerated MCP auth, tracking kit |
| Infra | Kubernetes, Ansible, Docker Compose, Hetzner, Oracle Cloud, hybrid deployments, object storage | archio, Axelerated |
| Front end | React, Next.js, Astro, Tailwind, React Native | Osoul Portal, Guest App and Waiter App (React Native); Finamaze; Axelerated |
| Real-time | WebSockets, SSE, push notifications, chat widgets | Qalqul, Osoul |

Show levels as words ("daily", "shipped in production", "familiar") rather than bars. Kotlin SDKs and React chat widgets from Qalqul count as front-end evidence too.

## Projects

Launch with six case studies (Osoul, AI Stones, Saudi-dialect speech-to-text, Customer Voice (RAG + MCP), Finamaze KYC, archio) and add the rest over time; Osoul is the flagship, split into deep-dive sub-cases. Employer work is written at the architecture level: the problem, your design and the trade-offs, never client data or proprietary code.

| Project | Kind | Stack | Visibility |
| --- | --- | --- | --- |
| Osoul platform | Founder, flagship | NestJS, TypeORM, PostgreSQL, Redis, Keycloak, LangChain, Next.js, React Native | Public product, private code |
| AI Stones | Open source (npm, MIT) | Node.js CLI (npx ai-stones) that detects a project's stack and conventions, then generates a tailored Claude Code setup: .claude/ hooks, skills, MCP servers, AGENT.md and ROADMAP.md | [npm package](https://www.npmjs.com/package/ai-stones) |
| Customer Voice: RAG pipeline with an MCP retriever | Axelerated | Ingests structured and unstructured sources and customer interactions; MCP server as the pipeline's main retriever; gRPC retrieval module; ai-llm module (tokens, cost, privacy); auth, privacy and retention layer | Write-up plus diagram |
| Saudi-dialect speech-to-text | Axelerated | Whisper large-v3 fine-tune, WhatsApp and Asterisk audio pipeline | Write-up, no data |
| MCP server over backend APIs | Axelerated | MCP tools on top of existing backend APIs, every request validated through Keycloak | Write-up |
| Knowledge-base search | Axelerated | Advanced search over the content loaded in Sowtek's KB module, built on Docling and zero-shot classification | Write-up |
| KYC and reconciliation | Finamaze | Document verification, visual verification, reconciliation | Write-up, no data |
| NLP/NLU engines | Qalqul Engine | Language servers, Duckling, Botpress v12 core | Write-up |
| Kotlin SDKs and React chat widgets | Qalqul Engine | Kotlin, TypeScript, React, WebSockets | Write-up plus screenshots |
| archio | Open source | Go, object storage, semantic search built on Docling | Public repo |
| Hybrid translation system ([translator](https://github.com/alouani-youssef/translator)) | Open source | FastAPI; NLLB-200 3.3B for simple text and an LLM (Gemini, Ollama or OpenRouter) above a complexity threshold; exact, normalized and semantic cache on PostgreSQL/pgvector; semantic search exposed to the LLM as a tool that fetches validated translation examples, lifting domain-specific accuracy even with local LLMs; multilingual-e5 quality scoring; S3/MinIO JSON documents | Public repo |
| [pg\_inspector](https://github.com/alouani-youssef/pg_inspector) | Open source | Python, uv; MCP server over streamable HTTP (API key) and stdio; read-only SQL, schema inspection, EXPLAIN plans, a health snapshot and 5 guided prompts | Public repo |
| Tracking kit ([tracker](https://github.com/alouani-youssef/tracker) + [tracking-sdk](https://github.com/alouani-youssef/tracking-sdk)) | Open source | Go/Gin tracking service for user recognition, plus a TypeScript wrapper for browser-based tracking; events signed with HMAC so the server only accepts requests from trusted clients | Public repos |
| 10xJobs | Founder, since Nov 2026 | Job-search automation for software engineers. Built on Apify actors; a full pipeline that finds jobs and matches them to each registered user's published profile, tuned for cost, efficiency and performance | [Live](https://10xjobs.vercel.app/) |

**Three RAG pipelines, one pattern.** Worth a short cross-link block on each case study, since agents and recruiters search for "RAG" directly:

- Customer Voice: ingests structured and unstructured sources and customer interactions; an MCP server is the pipeline's main retriever.
- translator: semantic search as an LLM tool that pulls validated translation examples, for higher domain-specific accuracy even on local LLMs.
- Knowledge-base search: Sowtek's KB module content made searchable with Docling and zero-shot classification.

**How to frame the Osoul flagship**: lead with the business, then the tech. Osoul is Revenue as a Service (RaaS), a SaaS growth engine for fine dining built around specific revenue KPIs with management tools built in: mature technologies capture data restaurants usually lose and move their KPIs. The page should open with which data, which KPIs and the before/after numbers, then show the sub-cases below as the machinery behind them.

**Osoul sub-cases (each is its own page, linked from the flagship)**

- NFC/QR table session security: tokens, credentials, session lifecycle.
- Dual-database multi-tenant provisioning with NestJS and TypeORM.
- Recommendation systems: menu data architecture, dish/beverage recommendations and meal-completion promos.
- Archetype-based B2B onboarding and tenant visual identity.
- Unified license and entitlement model: static snapshots versus dynamic usage counters.
- Ad signal infrastructure: tracking event schema, server-side CAPI events and ad-audience optimisation.
- AI assistant: LangChain, PII redaction, and the user's auth propagated through to every tool call.
- Diner identity: merging reservation and diner profiles into one guest record, the data most restaurants lose today and the base for the RaaS KPIs.
- Reservations and flow control: deposits, queues, multi-channel reminders and bots, loyalty used to smooth peak hours.
- Operations and revenue: occupancy and SLA tracking with escalations, event-based dynamic menu pricing, POS/PMS integrations.

**Osoul front ends (one page, three apps)**

- Osoul Portal: the tenant-facing web portal.
- Osoul Guest App: what diners use at the table after the NFC/QR tap.
- Osoul Waiter App: React Native mobile app for frontline staff.

**Case-study template (frontmatter fields in the content model below)**

1. Problem, in one paragraph a non-engineer can follow.
2. Constraints: scale, compliance, team size, deadline.
3. Architecture diagram (SVG in the page, Mermaid source alongside).
4. Key decisions, each with the option you rejected and why.
5. Results: metrics, or "shipped to N tenants" style facts.
6. Stack chips and links: repo, demo, related post.

**Metrics (placeholders until real numbers arrive)**

These figures are illustrative, so layouts can be built and reviewed with realistic numbers. Each one carries `placeholder: true` in the content model and shows a "sample" badge in preview builds; the production build fails while any remain, so none can go live as a claim.

| Case study | Metric | Placeholder |
| --- | --- | --- |
| Osoul | Tenants live | 2 (Casa Harris, Shanzoo), real figure |
| Osoul | Average ticket from meal-completion promos | +8% |
| Osoul | Reservation no-shows after reminders and deposits | −30% |
| Saudi-dialect speech-to-text | Word error rate, base Whisper large-v3 → fine-tuned | 38% → 19% |
| Customer Voice (RAG + MCP) | Calls processed per month | 50,000 |
| translator | Requests served by cache or NLLB instead of the LLM | 70% |
| translator | LLM cost versus LLM-only routing | −60% |
| Finamaze KYC | Manual review time per file | −40% |
| 10xJobs | Cost per matched job | $0.02 |

## Open source contributions

This is the weakest section today: [your GitHub](https://github.com/alouani-youssef) shows 8 repositories, 0 followers and no pinned work, but archio, translator, pg\_inspector and the tracking kit are strong enough to lead it once they are pinned and documented; RabbitMQ and Centrifugo contributions get listed once their links are found. The page itself should be generated at build time from the GitHub API (your repos, plus merged PRs to other people's repos), so it fills up as you contribute.

**What is public now, and what to do with it**

| Repo | Language | Action |
| --- | --- | --- |
| [ai-stones](https://www.npmjs.com/package/ai-stones) (Claude Code setup generator, on npm) | JavaScript (Node.js) | Pin first. Already on npm under MIT with CI; add a 30-second demo of npx ai-stones init to the README. Your most recent and most shareable project. |
| archio (object storage with semantic search, built on Docling) | Go | Pin first. Add a README with an architecture diagram, a quick-start, a semantic-search demo over sample PDFs and a benchmark. This is your best OSS story. |
| translator (hybrid NLLB-200 + LLM translation service) | Python | Pin. Put the routing diagram from docs/architecture.md at the top of the README, plus one table of cost and latency for NLLB versus LLM requests. |
| pg\_inspector (MCP server for PostgreSQL inspection) | Python | Pin. Add a license (none is stated), a short demo in Claude Desktop, and submit it to MCP server directories. |
| [tracker](https://github.com/alouani-youssef/tracker) + [tracking-sdk](https://github.com/alouani-youssef/tracking-sdk) (open-source tracking kit) | Go (Gin), TypeScript | Pin as one story. Add a license (none is stated), a README linking the two repos, a diagram of the HMAC signing flow from browser to Gin service, and a quick-start that sends a first signed event. Pairs naturally with the Osoul ad signal sub-case. |
| *alouani-youssef (profile README)* | *Markdown* | *Rewrite to mirror the site headline, with links to the portfolio and llms.txt.* |

**Upstream contributions**

Contributions to widely used infrastructure projects carry more weight than personal repos; list each with its PR link and one line on what it changed. Hidden on the site until the links are found.

| Project | What it is | Your contribution |
| --- | --- | --- |
| [RabbitMQ](https://github.com/rabbitmq) | Message broker | PR links and one-line summary to supply |
| [Centrifugo](https://github.com/centrifugal/centrifugo) | Real-time messaging server (WebSocket, SSE) | PR links and one-line summary to supply |

**New OSS worth extracting from work you have already done (no client code)**

- A NestJS + TypeORM multi-tenant provisioning module (your dual-database pattern).
- An MCP server starter in FastAPI-MCP and in TypeScript, with auth and data-retention hooks built in.
- An entitlements library: static license snapshots plus dynamic usage counters.
- An Astro portfolio theme with the agent layer below. The portfolio itself becomes an OSS project.

**More upstream contributions to aim for**: small, real fixes or docs in tools you use daily (NestJS, TypeORM, FastAPI-MCP, LangGraph, Ollama, Keycloak). Three merged PRs in well-known repos outweigh ten personal repos for both recruiters and agents.

## Blog

Your site becomes the canonical home for every post; Medium, dev.to and Hashnode get copies whose canonical link points back to you. Your [10 Medium posts, split across two accounts, all date from 2022–2023](https://alouani-youssef.medium.com), so the blog's real job is new writing about the work you have done since.

**Publishing rule for new posts**

1. Publish the MDX post on your site first.
2. Bring it into Medium with "Import a story", which sets the canonical link to your URL.
3. Cross-post to dev.to and Hashnode with `canonical_url` set to your URL.
4. Post a 5-line LinkedIn summary with the diagram image and the link.

**Existing Medium posts**

| Published | Post | Plan |
| --- | --- | --- |
| 22 Jul 2023 | [The Philosophy Behind Virtualization and Containerization](https://alouaniyoussef.medium.com/the-philosophy-behind-virtualization-and-containerization-c13866d74ed5) | Rewrite on your site with a part 2 from your Docker Compose to Kubernetes migration |
| 7 Jun 2023 | [The Software Development Industry](https://alouaniyoussef.medium.com/the-software-development-industry-125367526fa6) | Leave on Medium, list as external |
| 5 Apr 2023 | [The Software Dictionary](https://alouaniyoussef.medium.com/the-software-dictionary-11c92add2f0f) | Leave on Medium, list as external |
| 8 Oct 2022 | [A Vision about Software Architecture Styles](https://alouani-youssef.medium.com/a-vision-about-software-architcture-styles-3ec0666b692c) | Rewrite as a 2026 edition on your site (add modular monolith, multi-tenancy) |
| 22 Sep 2022 | [The Full Path into the API Gateway](https://alouani-youssef.medium.com/the-full-path-into-the-api-gateway-f3285c96d627) | Rewrite with your Osoul gateway and Keycloak setup |
| 8 Aug 2022 | [The Magic of Networking, part 1](https://alouani-youssef.medium.com/the-magic-of-networking-and-its-wonderful-story-part-1-6b9427fc2084) | Leave on Medium, list as external |
| 21 Jul 2022 | [Neo4j Simple Introduction](https://alouani-youssef.medium.com/neo4j-simple-introduction-2febaddfb520) | Leave on Medium, list as external |
| 13 Jul 2022 | [Apache Kafka: all I know](https://alouani-youssef.medium.com/apache-kafka-all-what-i-know-71babb86a9ac) | Rewrite with a real event-pipeline example (ad-algorithm data at Osoul) |
| 15 Jun 2022 | [Git and GitHub: master your important tool](https://alouani-youssef.medium.com/git-and-github-master-your-important-tool-as-a-developer-bf4482237d04) | Leave on Medium, list as external |
| 13 Mar 2022 | [RabbitMQ: how it works under the hood](https://alouani-youssef.medium.com/rabbitmq-understand-how-it-works-under-the-hood-895b74c37f3b) | Leave on Medium, list as external |

External posts appear in your blog index with an "on Medium" badge and `canonical` = the Medium URL, so nothing is duplicated.

**Two Medium accounts** ([alouani-youssef](https://alouani-youssef.medium.com) with the 2022 posts, [@alouaniyoussef](https://medium.com/@alouaniyoussef) with the 2023 ones) split your identity. Medium can't merge them, so give both the same name, photo and bio, link each to the other and to your site, and publish new cross-posts from one only. Both go in the JSON-LD `sameAs` list.

**New topic backlog, ordered by how rare the experience is**

- [ ] Fine-tuning Whisper large-v3 for Saudi dialect: preparing WhatsApp and Asterisk call audio
- [ ] Designing an MCP server people can trust: auth, privacy and data retention
- [ ] RAG behind MCP: splitting retrieval into a gRPC module
- [ ] Dual-database multi-tenancy with NestJS and TypeORM
- [ ] Securing NFC/QR table sessions for anonymous diners
- [ ] Licenses versus usage counters: an entitlement model for SaaS
- [ ] Menu recommendations and meal-completion promos in a restaurant platform
- [ ] Server-side ad events: a tracking schema for CAPI
- [ ] From Botpress v12 core to LLM agents: what changed in conversational AI
- [ ] How I made my portfolio readable by AI agents (publish at launch)

**Added from your recent work**

- [ ] Building AI Stones: a personal AI harness for Claude
- [ ] An AI assistant that respects auth: PII redaction and user auth propagation in LangChain
- [ ] Semantic search inside object storage: archio on top of Docling
- [ ] KYC with document and visual verification
- [ ] From Hetzner to Oracle Cloud, and Docker Compose to Kubernetes: a migration log
- [ ] Going stateless: what we changed to make services horizontally scalable
- [ ] Hybrid deployments for banks and government: what changes when the cloud is not an option
- [ ] Hybrid translation: routing between NLLB-200 and an LLM by complexity, behind a three-tier cache
- [ ] pg\_inspector: giving an AI assistant safe, read-only access to PostgreSQL over MCP
- [ ] An open-source tracking kit: HMAC-signed browser events into a Go/Gin service
- [ ] 10xJobs: a cost-aware pipeline for matching jobs to user profiles
- [ ] Exposing existing backend APIs over MCP, with Keycloak validating every request
- [ ] What I learned contributing to RabbitMQ and Centrifugo

Cadence: two posts a month is enough. Each post needs one diagram and one concrete number or code sample.

## Site spec (Astro + Tailwind)

A static Astro site at youssefalouani.com with six sections and near-zero client JavaScript: the same build serves people styled HTML and serves agents clean Markdown and JSON.

&#91;embedded content: site map · 6 sections, 3 detail page types\]

Experience, Projects and Blog each have detail pages generated from content collections; the other sections are single pages.

**Pages**

| Route | Purpose | Key content |
| --- | --- | --- |
| `/` | 10-second pitch | Headline, one-liner, 4 expertise cards, 3 featured projects, a row of client names, latest 3 posts, CTA |
| `/about` | Long bio | Long bio, education, languages spoken, three LinkedIn recommendations |
| `/experience` | Timeline | Roles newest first; each opens `/experience/[company]` |
| `/projects` | Case studies | Filterable by area (Backend, AI, Platform); each opens `/projects/[slug]` |
| `/open-source` | OSS proof | Repos and merged upstream PRs, built from the GitHub API at build time |
| `/blog` | Writing | Native MDX posts plus external Medium entries, tag filter, RSS |
| `/contact` | Reach out | Email, LinkedIn, GitHub, Calendly-style link, CV download (EN/FR) |
| `/cv` | Printable CV | Generated from the same data; prints cleanly to PDF |
| `/now` | Current focus | What you're building and writing this month (Osoul, AI Stones); dated, so people and agents can see it is current |
| `/talks` | Talks, certificates, awards | Built from the section below; hidden from navigation until it has its first entry |

**UI rules**

- Content first: system font stack or one variable font, 65–75 character line length, dark and light themes.
- Architecture diagrams as inline SVG with a Mermaid source, so both people and agents can read them.
- Command palette (Ctrl/Cmd+K) and site search with Pagefind, both static.
- Accessibility: semantic landmarks, one `h1` per page, visible focus, AA contrast, reduced-motion respected.
- Performance budget: Lighthouse 95+ on all four scores, under 50 KB of JavaScript per page, images through Astro's image pipeline.
- English and French at launch (French under `/fr/`); no Arabic version, though Arabic is listed among the languages you speak.
- Host on Cloudflare Pages or Vercel; Cloudflare also gives you AI-crawler analytics.
- An Open Graph image per page, generated at build time from the title and the page's diagram, so links shared on LinkedIn and X preview well.
- Privacy-friendly analytics (Cloudflare Web Analytics or Plausible): no cookies, no consent banner, which fits a privacy-focused engineer's site.

## AI-agent layer (static)

The parts that reliably help agents are crawlable HTML, JSON-LD, an open robots.txt and clean Markdown; llms.txt is cheap to add but unproven. As of 2026, no major AI vendor has said its crawlers read llms.txt ([Ahrefs](https://ahrefs.com/blog/llms-txt/)), and one tracking study found most llms.txt files get no AI requests at all ([PPC Land](https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/)). Coding agents and RAG tools do fetch it, so ship it, but treat structured data and Markdown twins as the real work.

| Path | Format | Contents | Main reader |
| --- | --- | --- | --- |
| Every page `<head>` | JSON-LD | `ProfilePage` + `Person` on home/about, `BlogPosting` on posts, `CreativeWork`/`SoftwareSourceCode` on projects | Search engines, AI search |
| `/robots.txt` | Text | Allow all, explicitly allow GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended; sitemap line | All crawlers |
| `/sitemap-index.xml`, `/rss.xml` | XML | Every page and post with `lastmod` | Crawlers, feed readers |
| `/<any-page>.md` | Markdown | Same content as the HTML, no nav or styling; linked via `<link rel="alternate" type="text/markdown">` | Agents fetching one page |
| `/llms.txt` | Markdown | Summary plus curated links to the `.md` twins and JSON endpoints | Coding agents, RAG tools |
| `/llms-full.txt` | Markdown | Whole site in one file: bio, experience, projects, post abstracts | Agents that want one fetch |
| `/resume.json` | [JSON Resume](https://jsonresume.org/schema) | Standard résumé schema, so ATS tools and agents parse it without guessing | ATS, recruiting agents |
| `/api/{profile,experience,projects,skills,posts}.json` | JSON | One file per collection, with a published JSON Schema at `/api/schema/*.json` | Agents and scripts |
| `/about#faq` | HTML + FAQPage JSON-LD | 6–8 plain Q&As: current role, stack, location and time zone, languages, how to reach you | AI assistants answering "who is…" questions |

**Example `/llms.txt` (\<domain> = youssefalouani.com)**

```markdown
# Youssef Alouani

> Senior backend and AI engineer in Casablanca, founder of Osoul (RaaS growth engine for fine-dining restaurants). NestJS, Go, Python; RAG, MCP servers, speech-to-text, secure multi-tenant platforms.

## Profile
- [About](https://<domain>/about.md): long bio, education, languages, recommendations
- [Experience](https://<domain>/experience.md): Osoul, Axelerated Solutions, Finamaze, Qalqul Engine
- [Résumé (JSON Resume)](https://<domain>/resume.json)

## Projects
- [Osoul platform](https://<domain>/projects/osoul.md)
- [Saudi-dialect speech-to-text](https://<domain>/projects/saudi-stt.md)
- [Customer Voice (RAG + MCP)](https://<domain>/projects/rag-mcp.md)
- [AI Stones](https://<domain>/projects/ai-stones.md)
- [archio](https://<domain>/projects/archio.md)

## Writing
- [All posts](https://<domain>/api/posts.json)

## Optional
- [Full site in one file](https://<domain>/llms-full.txt)
```

**Example JSON-LD on the home page**

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Youssef Alouani",
    "url": "https://youssefalouani.com",
    "knowsLanguage": ["en", "fr", "ar"],
    "jobTitle": "Lead Backend & AI Engineer",
    "address": { "@type": "PostalAddress", "addressLocality": "Casablanca", "addressCountry": "MA" },
    "worksFor": { "@type": "Organization", "name": "Osoul", "url": "https://osoul.io" },
    "alumniOf": { "@type": "CollegeOrUniversity", "name": "Hassan First University, FST Settat" },
    "knowsAbout": ["NestJS", "Go", "Python", "RAG", "Model Context Protocol", "Whisper fine-tuning", "Multi-tenant SaaS", "Keycloak"],
    "sameAs": [
      "https://www.linkedin.com/in/alouani-youssef",
      "https://github.com/alouani-youssef",
      "https://alouani-youssef.medium.com",
      "https://medium.com/@alouaniyoussef"
    ]
  }
}
```

**Rules that keep it trustworthy**

- One source of truth: HTML, `.md`, JSON and llms.txt are all generated from the same content collections at build time, so they never drift.
- No agent-only claims: anything in llms.txt or JSON is also visible on a page. Hidden text reads as cloaking.
- Stable URLs and IDs: slugs never change; JSON items carry `id`, `updatedAt` and a canonical `url`.
- Validate in CI: Google Rich Results test for JSON-LD, JSON Schema checks on every `/api` file, a link checker over llms.txt.
- Later, if you want it: an MCP endpoint (a Cloudflare Worker) can read the same JSON files without changing the site.
- Placeholder metrics never ship: the production build fails if any metric still has `placeholder: true`.

## Content model

Five content collections in `src/content.config.ts` drive every output: pages, `.md` twins, `/api/*.json`, `resume.json`, llms.txt and JSON-LD. The Zod schemas below double as the published JSON Schemas.

```ts
import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const skills = defineCollection({
  loader: file('src/data/skills.yaml'),
  schema: z.object({
    id: z.string(),                       // 'nestjs'
    name: z.string(),                     // 'NestJS'
    category: z.enum(['language','backend','data','ai','security','infra','frontend','realtime']),
    level: z.enum(['daily','production','familiar']),
    since: z.number().optional(),         // year
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.mdx', base: 'src/content/experience' }),
  schema: z.object({
    company: z.string(),
    alias: z.string().optional(),         // 'Sowtek AXS'
    role: z.string(),
    founding: z.boolean().default(false),  // founding engineer
    teamSize: z.number().optional(),
    start: z.coerce.date(),
    end: z.coerce.date().nullable(),      // null = current
    location: z.string(),
    url: z.string().url().optional(),
    summary: z.string().max(200),
    highlights: z.array(z.string()).max(6),
    skills: z.array(reference('skills')),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    summary: z.string().max(200),
    area: z.enum(['backend','ai','platform','frontend']),
    kind: z.enum(['founder','employer','open-source','side']),
    company: reference('experience').optional(),
    parent: reference('projects').optional(),   // Osoul sub-cases
    status: z.enum(['live','shipped','in-progress','archived']),
    featured: z.boolean().default(false),
    confidentiality: z.enum(['public','architecture-only','private']).default('public'),
    skills: z.array(reference('skills')),
    links: z.object({ repo: z.string().url(), demo: z.string().url(), post: z.string() }).partial(),
    metrics: z.array(z.object({ label: z.string(), value: z.string(), placeholder: z.boolean().default(true) })).default([]),
    cover: image().optional(),
    updatedAt: z.coerce.date(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()),
    external: z.object({ platform: z.enum(['medium','devto','hashnode']), url: z.string().url() }).optional(),
    canonical: z.string().url().optional(), // set only for external-first posts
    related: z.array(reference('projects')).default([]),
    draft: z.boolean().default(false),
  }),
});

const oss = defineCollection({
  loader: githubLoader({ user: 'alouani-youssef' }), // custom loader: repos + merged external PRs
  schema: z.object({
    repo: z.string(),
    type: z.enum(['own-repo','upstream-pr']),
    title: z.string(),
    url: z.string().url(),
    language: z.string().nullable(),
    stars: z.number(),
    mergedAt: z.coerce.date().nullable(),
  }),
});

export const collections = { skills, experience, projects, blog, oss };
```

Relations (`reference()`) are what let an agent answer "which projects used Keycloak?" from `/api/projects.json` without reading prose.

## Recommendations

Three LinkedIn recommendations, quoted word for word with a link to the full text on your LinkedIn profile: one pull quote on Home, all three on About. They stay plain HTML, not review markup.

| From | Relationship | Date | Pull quote |
| --- | --- | --- | --- |
| Mohammad Al-Ahmad, Senior Platform & DevOps Engineer | Worked on the same team | Apr 14, 2026 | "He naturally thinks like an architect, able to dive deep into complex issues, design solutions the right way, and build systems end-to-end." |
| Tareq Bareich, Software Engineer | Worked on the same team | May 21, 2024 | "He's an outstanding software engineer who can dive deep into IT topics, from low-level technical details to high-level architectural designs." |
| Tanvir Islam, Technical Lead at Technovative Solutions | Managed Youssef directly at Qalqul | May 14, 2023 | "Working at Qalqul is most challenging, and he thrived." |

## Talks, certificates and awards

Placeholder until you send entries; the `/talks` page stays out of the navigation while this table is empty.

| Type | Title | Event or issuer | Date | Link |
| --- | --- | --- | --- | --- |
| Talk | To provide |  |  |  |
| Certificate | To provide |  |  |  |
| Award | To provide |  |  |  |

## Digital presence plan

Your presence today undersells you: the strongest work (Whisper fine-tuning, MCP security, Osoul) appears nowhere public, GitHub has no pinned work, and the last post is from July 2023. The fix is one consistent identity, a personal domain as the hub, and steady proof of current work.

**Gaps found today**

| Channel | Now | Fix |
| --- | --- | --- |
| Name | "ALOUANI YOUSSEF" on GitHub, "YOUSSEF ALOUANI" on Medium | "Youssef Alouani" everywhere, same photo, same headline |
| Personal site | None found (osoul.io is the company) | youssefalouani.com as the hub every profile links to |
| GitHub | Bio "it's about the fundamentals", nothing pinned, 0 followers | Headline bio, site link, 3 pinned repos, rewritten profile README |
| Medium | 10 posts on two accounts, newest July 2023 | Cross-posts of new site posts with canonical links |
| LinkedIn | Not checked here | Same headline, Featured = 3 case studies + 1 post, About = short bio |

**Weeks 1–2: unify**

- [ ] Buy youssefalouani.com and point it at a one-page placeholder with the headline and links.
- [ ] Update headline, bio, photo and link on LinkedIn, GitHub, Medium and X/Bluesky if you use them.
- [ ] Pin archio, translator and pg\_inspector; archive or hide storage, starters, scrapper and news; rewrite the profile README.
- [ ] Set up Google Search Console and Bing Webmaster Tools (Bing's index feeds several AI search products).

**Month 1: launch**

- [ ] Ship the site with Home, About, Experience, 3 case studies and the full agent layer.
- [ ] Publish the first new post (Whisper for Saudi dialect) and cross-post it.
- [ ] Add the site to every profile's link field and to your email signature.

**Months 2–3: proof**

- [ ] Extract one OSS package from Osoul work (MCP starter or multi-tenant module).
- [ ] Land 2–3 merged PRs upstream in tools you use.
- [ ] Two posts a month from the backlog; one LinkedIn post a week (a diagram, a lesson, a number).
- [ ] Give one meetup or conference talk on MCP security or dialect speech-to-text; publish the slides on the site.

**Ongoing: measure**

- [ ] Monthly, ask ChatGPT, Claude, Perplexity and Google AI Mode "Who is Youssef Alouani?" and log the answers. Wrong or missing facts show you which page to fix.
- [ ] Watch AI-crawler hits in Cloudflare or server logs, and Search Console impressions per page.
- [ ] Keep `updatedAt` honest; refresh the About page and resume.json whenever your role changes.

## Launch scope

Ship a small v1, then add a case study a week: a live site with three strong case studies beats a complete one still in draft. The split below is a proposal; move items between releases as you like.

| Release | Includes |
| --- | --- |
| v1 | Home, About with FAQ, Experience, /now, Contact, /cv; case studies for Osoul, Saudi-dialect speech-to-text and Customer Voice (RAG + MCP); one new post; the full agent layer; English and French |
| v1.1 | AI Stones, archio and Finamaze KYC case studies; Osoul sub-cases; the two rewritten Medium posts |
| v1.2 | Open source page from the GitHub API, remaining case studies |

## Open questions

These are the facts the site still needs from you. Each one turns a vague claim into a checkable one.

- [x] **Domain**: which personal domain (for example alouani.dev or youssefalouani.com)?
- [ ] **Metrics per role**: one number each, such as WER improvement on Saudi dialect, tenants or tables live on Osoul, MCP server users, reconciliation time saved at Finamaze. Placeholder figures stand in until then (see Projects).
- [x] **Confidentiality**: what Axelerated and Finamaze work can be named publicly, and at what level of detail.
- [ ] **Hidden repos**: GitHub reports 8 repositories but only 6 are visible; are the other two worth showing?
- [ ] **Upstream contributions**: any merged PRs to other projects (Botpress, n8n, Duckling or others) that should be listed?
- [x] **Availability line**: should the site say you're open to Senior Backend / AI roles, or keep the founder framing only?
- [x] **Languages**: English and French at launch, or English first? Arabic too?
- [x] **Talks, certificates, awards**: anything to add beyond your engineering diploma?
- [ ] **Photo and visual style (photos coming)**: a current headshot, plus any brand colours you want to reuse from Osoul or keep separate.

**From the latest additions**

- [x] **AI Stones**: published; still needed: its URL and one line on what it does day to day (tools, memory, workflows).
- [x] **Migrations and hybrid deployments**: which company or companies were these at, so they attach to the right role?
- [ ] **Front ends (you'll provide)**: screenshots of Osoul Portal, Guest App and Waiter App, and of a Qalqul chat widget, if you can share them.
- [x] **10xJobs**: founder since 1 Nov 2026, live at 10xjobs.vercel.app; still needed: does "apiactors" mean Apify actors? One number on cost per match or match quality would anchor the case study.
- [ ] **Upstream PRs**: none found yet; RabbitMQ and Centrifugo stay off the site until their links turn up.

* [x] **Osoul's RaaS model**: what does RaaS stand for in your pitch, which KPIs does Osoul move, and which "lost data" does it recover? One before/after number per KPI makes the flagship page.
* [x] **Social proof**: 2–3 LinkedIn recommendations you can quote with permission, plus any talks or press mentions.
* [x] **Naming clients**: twelve clients are listed under Experience, including Casa Harris and Shanzoo (Tangier), Osoul's customers so far.

**Sources**: [GitHub profile](https://github.com/alouani-youssef) and [Medium feed](https://alouani-youssef.medium.com/feed)s (two accounts), checked 19 Nov 2026.
