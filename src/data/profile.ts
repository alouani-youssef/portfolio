import { z } from 'astro/zod';
import { FOCUS_IDS, focusTitle } from '../lib/focus';

export const profileSchema = z.object({
  name: z.string(),
  jobTitle: z.string(),
  headline: z.string(),
  oneLiner: z.string().max(160),
  shortBio: z.string(),
  /** Paragraphs, or a lead sentence followed by a bullet list. */
  longBio: z.array(z.union([z.string(), z.object({ lead: z.string(), items: z.array(z.string()).min(1) })])).min(1),
  location: z.object({ city: z.string(), country: z.string(), timeZone: z.string() }),
  languages: z.array(z.object({ code: z.string(), name: z.string() })),
  email: z.email(),
  links: z.object({
    github: z.url(),
    linkedin: z.url(),
    /** Current Medium account; the older one (alouani-youssef.medium.com) was lost but stays in sameAs. */
    medium: z.url(),
    osoul: z.url(),
    /** Google Calendar appointment schedule; each booking gets a Google Meet link. */
    schedule: z.url(),
  }),
  sameAs: z.array(z.url()),
  /** `project` is the slug of the case study that best shows the area, featured on the home page. */
  expertise: z
    .array(z.object({ id: z.enum(FOCUS_IDS), title: z.string(), body: z.string(), skills: z.array(z.string()), project: z.string() }))
    .length(6)
    .refine((xs) => xs.every((x, i) => x.id === FOCUS_IDS[i] && x.title === focusTitle(x.id)), { message: 'expertise must follow FOCUS_AREAS order and titles' }),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).min(6).max(8),
  now: z.object({ updated: z.string(), items: z.array(z.string()) }),
  knowsAbout: z.array(z.string()),
});

export type Profile = z.infer<typeof profileSchema>;

export const profile: Profile = {
  name: 'Youssef Alouani',
  jobTitle: 'AI Engineer',
  headline: 'I build AI that works on real data in production, and keeps that data safe. AI engineer with a backend foundation: RAG and MCP over private data, Saudi-dialect speech, recommendations and privacy-aware assistants, evaluated before they ship.',
  oneLiner: 'Casablanca-based AI engineer with a backend foundation: RAG, MCP, speech and privacy-aware assistants that work on real data in production.',
  shortBio:
    'Youssef Alouani is an AI engineer in Casablanca with a backend foundation, and the technical founder of Osoul, a Revenue-as-a-Service (RaaS) growth engine for fine-dining restaurants. He builds the systems that let models work on real data in production while keeping that data safe: conversational AI at Qalqul Engine, fintech AI at Finamaze, and Whisper fine-tuning, RAG and MCP servers at Axelerated Solutions.',
  longBio: [
    "I'm an AI engineer with a backend foundation. I build the systems that let models work on real data in production while keeping that data safe. I started in conversational AI at Qalqul Engine, working on the Botpress v12 core, NLP/NLU engines on language servers and Duckling, and no-code workflow systems. At Finamaze I applied AI to fintech: KYC with document and visual verification, reconciliation, and a robo-advisor.",
    'At Axelerated Solutions I was a founding engineer and the backend lead in a team of nine. I fine-tuned Whisper large-v3 for Saudi-dialect call transcription and owned the data preparation from WhatsApp and Asterisk audio. I also built RAG on Milvus, coding agents, tool-using chatbots and the Customer Voice RAG pipeline, which uses an MCP server as its retriever. Alongside it I built an MCP server over our backend APIs, validated through Keycloak, where I owned the auth flow and the privacy and data-retention layer. I also worked on platform migrations and hybrid deployments for banking, government and private institutions.',
    {
      lead: "Since June 2026 I've been building Osoul, a Revenue-as-a-Service (RaaS) growth engine for fine dining. AI there turns the data restaurants usually lose into better KPIs through:",
      items: [
        'personalized dish and beverage recommendations',
        'ad-signal pipelines for audience optimization',
        'a privacy-aware AI assistant built with LangChain, with PII redaction and user auth propagation',
      ],
    },
    {
      lead: 'My day-to-day stack:',
      items: [
        'Frameworks: LangChain and LangGraph',
        'Models: local models through Ollama, plus open-source and OpenAI-compatible models',
        'Serving: FastAPI and FastAPI-MCP',
        'Evaluation: DeepEval and Giskard',
      ],
    },
    'On the side I build AI Stones, a personal AI harness for Claude published on npm, and archio, object storage with semantic search built on Docling.',
    'I care about AI that works from the right data, gets evaluated before it ships, and protects user data by design.',
  ],
  location: { city: 'Casablanca', country: 'MA', timeZone: 'Africa/Casablanca (GMT+1)' },
  languages: [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'ar', name: 'Arabic' },
  ],
  email: 'hello@youssefalouani.com',
  links: {
    github: 'https://github.com/alouani-youssef',
    linkedin: 'https://www.linkedin.com/in/alouani-youssef',
    medium: 'https://medium.com/@alouaniyoussef',
    osoul: 'https://osoul.io',
    schedule: 'https://calendar.app.google/ru99z5cCrAbbu8LP9',
  },
  sameAs: [
    'https://www.linkedin.com/in/alouani-youssef',
    'https://github.com/alouani-youssef',
    'https://alouani-youssef.medium.com',
    'https://medium.com/@alouaniyoussef',
  ],
  expertise: [
    {
      id: 'agentic',
      title: focusTitle('agentic'),
      body: "RAG pipelines with an MCP server as the retriever, and assistants that act with the user's own permissions, redact personal data and ask before they write.",
      skills: ['rag', 'mcp', 'langchain', 'claude-harnesses', 'pii-redaction'],
      project: 'customer-voice',
    },
    {
      id: 'nlp',
      title: focusTitle('nlp'),
      body: 'Public chatbots on Botpress, Rasa and an in-house engine, from the backend and chat widgets to their security, plus intent and entity extraction tuned per client across Arabic, French and Darija.',
      skills: ['botpress', 'rasa', 'duckling', 'zero-shot-classification', 'nllb-200'],
      project: 'chatbots',
    },
    {
      id: 'ml',
      title: focusTitle('ml'),
      body: 'Whisper large-v3 fine-tuned for Saudi-dialect calls, from audio preparation to evaluation, serving live transcripts and voice agents.',
      skills: ['whisper', 'fine-tuning', 'python'],
      project: 'saudi-stt',
    },
    {
      id: 'recsys',
      title: focusTitle('recsys'),
      body: 'Dish and drink pairings, meal-completion promos and event-based dynamic pricing, built on one menu data model.',
      skills: ['recommendation-systems', 'postgresql', 'redis'],
      project: 'osoul-recommendations',
    },
    {
      id: 'etl',
      title: focusTitle('etl'),
      body: 'Pipelines that collect, clean, extract into type-safe LLM schemas and load: job ingestion, call-recording pipelines and signed server-side CAPI events.',
      skills: ['data-pipelines', 'docling', 'embeddings'],
      project: '10xjobs-ingestion',
    },
    {
      id: 'backend',
      title: focusTitle('backend'),
      body: 'Multi-tenant SaaS with isolated data and identity per tenant, Kafka and RabbitMQ messaging, real time over WebSockets and SSE, Keycloak, and migrations to Kubernetes.',
      skills: ['nestjs', 'postgresql', 'kafka', 'keycloak', 'kubernetes'],
      project: 'osoul',
    },
  ],
  faq: [
    {
      q: 'What does Youssef Alouani do?',
      a: 'He is an AI engineer with a backend foundation. He builds the systems that let models work on real data in production while keeping that data safe: RAG and MCP servers over private data, Saudi-dialect speech-to-text, recommendations and privacy-aware assistants. Since June 2026 he has been the technical founder of Osoul; before that he was a founding engineer and the backend lead at Axelerated Solutions.',
    },
    {
      q: 'What is Osoul, and where does AI fit in?',
      a: 'Osoul is a Revenue-as-a-Service (RaaS) growth engine for fine dining. AI turns the data restaurants usually lose into better KPIs through personalized dish and beverage recommendations, ad-signal pipelines for audience optimization, and a privacy-aware AI assistant built with LangChain, with PII redaction and user auth propagation. Its customers include venues of Barceló Group and Atlas Group.',
    },
    {
      q: 'What AI has he shipped to production?',
      a: 'At Axelerated Solutions: Whisper large-v3 fine-tuned for Saudi-dialect call transcription, with the data preparation from WhatsApp and Asterisk audio, RAG on Milvus, coding agents, tool-using chatbots and the Customer Voice RAG pipeline with an MCP server as its retriever. At Finamaze: KYC with document and visual verification, reconciliation and a robo-advisor. At Qalqul Engine: the Botpress v12 core and NLP/NLU engines on language servers and Duckling.',
    },
    {
      q: 'How does he keep user data safe in AI systems?',
      a: 'By design. He built an MCP server over backend APIs validated through Keycloak, owning the auth flow and the privacy and data-retention layer, and Osoul’s assistant redacts PII and propagates the user’s own auth. He has also worked on platform migrations and hybrid deployments for banking, government and private institutions.',
    },
    {
      q: 'What is his day-to-day AI stack?',
      a: 'LangChain and LangGraph for frameworks; local models through Ollama, plus open-source and OpenAI-compatible models; FastAPI and FastAPI-MCP for serving; DeepEval and Giskard to evaluate before anything ships.',
    },
    {
      q: 'What does he build on the side?',
      a: 'AI Stones, a personal AI harness for Claude published on npm, and archio, object storage with semantic search built on Docling.',
    },
    {
      q: 'Where is he based, and which languages does he speak?',
      a: 'Casablanca, Morocco (GMT+1). He speaks English, French and Arabic, and has worked remotely with teams and clients in Saudi Arabia and Morocco.',
    },
    {
      q: 'Is he open to new roles, and how can I reach him?',
      a: 'Yes. He is open to backend and AI engineering positions, remote or in Casablanca. Book a Google Meet call from the contact page, email hello@youssefalouani.com, or find him on LinkedIn and GitHub (alouani-youssef).',
    },
  ],
  now: {
    updated: '2026-11-19',
    items: [
      'Building Osoul: recommendation systems, reservations with deposits and the privacy-aware AI assistant for fine-dining restaurants.',
      'Running 10xJobs, a cost-tuned pipeline on Apify actors that matches new job posts to each user’s published profile.',
      'Maintaining AI Stones, an AI harness of skills, guardrail hooks and settings that protects and improves how Claude Code operates in a project.',
      'Writing about fine-tuning Whisper large-v3 for Saudi dialect.',
    ],
  },
  knowsAbout: ['AI systems', 'NLP/NLU', 'Whisper fine-tuning', 'Recommendation systems', 'ETL pipelines', 'Agentic systems', 'RAG', 'Model Context Protocol', 'NestJS', 'Python', 'Multi-tenant SaaS'],
};
