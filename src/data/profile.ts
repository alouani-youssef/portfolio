import { z } from 'astro/zod';
import { FOCUS_IDS, focusTitle } from '../lib/focus';

export const profileSchema = z.object({
  name: z.string(),
  jobTitle: z.string(),
  headline: z.string(),
  oneLiner: z.string().max(160),
  shortBio: z.string(),
  longBio: z.array(z.string()).min(1),
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
  education: z.object({ degree: z.string(), school: z.string(), start: z.number(), end: z.number() }),
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
  jobTitle: 'AI Systems Engineer',
  headline: 'AI Systems Engineer with a backend foundation. I build NLP, speech, recommendation and agentic systems, and the platforms they run on.',
  oneLiner: 'Casablanca-based AI systems engineer and founder of Osoul: NLP/NLU, speech, recommendations, ETL and agentic systems on a solid backend.',
  shortBio:
    'Youssef Alouani is an AI systems engineer in Casablanca with five years of backend experience, and the technical founder of Osoul, a Revenue-as-a-Service (RaaS) growth engine for fine-dining restaurants. He has built backends, NLP/NLU engines, speech-to-text, recommendation systems and data pipelines at Qalqul, Finamaze and Axelerated Solutions, with a focus on security, privacy and systems that hold up in production.',
  longBio: [
    "I'm a backend engineer who ended up deep in AI because the interesting problems kept landing there. I started at Qalqul Engine working on Botpress v12 core, NLP/NLU engines on language servers and Duckling, and no-code workflow systems, while shipping portals, Kotlin SDKs and React chat widgets. At Finamaze I worked on reconciliation and on KYC with document and visual verification, alongside AI for a robo-advisor. At Axelerated Solutions I was a founding engineer and the backend lead in a team of nine. I fine-tuned Whisper large-v3 for Saudi-dialect call transcription, built RAG on Milvus, coding agents, and the Customer Voice RAG pipeline with an MCP server as its retriever, plus an MCP server over our backend APIs validated through Keycloak, where I owned the auth flow and the privacy and data-retention layer.",
    "Since June 2026 I've been building Osoul, a Revenue-as-a-Service (RaaS) growth engine for fine dining: a SaaS built around specific revenue KPIs, with management tools built in. It uses mature technologies to capture the data restaurants usually lose and turn it into better KPIs. Under the hood: NFC/QR table ordering, reservations, recommendation systems, ad signal infrastructure and a privacy-aware AI assistant for restaurants, on NestJS, PostgreSQL, Redis and Keycloak. I've also worked on platform migrations and hybrid deployments for banking and government institutions. I care about fundamentals, clean architecture, and AI that respects user data.",
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
  education: {
    degree: "Bachelor's degree in Computer Science",
    school: 'Hassan First University, FST Settat',
    start: 2017,
    end: 2021,
  },
  expertise: [
    {
      id: 'agentic',
      title: focusTitle('agentic'),
      body: "RAG pipelines with an MCP server as the retriever, and assistants that act with the user's own permissions, redact personal data and ask before they write.",
      skills: ['rag', 'mcp', 'langgraph', 'langchain', 'claude-harnesses'],
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
      skills: ['whisper', 'fine-tuning', 'huggingface-transformers'],
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
      skills: ['data-pipelines', 'docling', 'clickhouse'],
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
      q: 'What does Youssef Alouani do now?',
      a: 'He is the technical founder of Osoul, a Revenue-as-a-Service growth engine for fine-dining restaurants, and runs 10xJobs, a job-matching pipeline for software engineers, as a side project. Before that he was Lead Backend Engineer and a founding engineer at Axelerated Solutions.',
    },
    {
      q: 'What is his main stack?',
      a: 'TypeScript with NestJS, Go and Python on the backend; PostgreSQL, Redis, Milvus and Kafka for data; RAG, MCP servers, LangChain and Whisper for AI; Keycloak and Kubernetes for identity and platform.',
    },
    {
      q: 'Where is he based, and in which time zone?',
      a: 'Casablanca, Morocco (GMT+1). He has worked remotely with teams and clients in Saudi Arabia and Morocco.',
    },
    {
      q: 'Which languages does he speak?',
      a: 'English, French and Arabic.',
    },
    {
      q: 'What is Osoul?',
      a: 'Osoul is a SaaS growth engine for fine dining built around specific revenue KPIs, with management tools built in: NFC/QR table ordering, reservations, recommendations, ad signal infrastructure and a privacy-aware AI assistant. Its customers include venues of Barceló Group and Atlas Group.',
    },
    {
      q: 'Is he open to new roles?',
      a: 'Yes. He is open to backend and AI engineering positions, remote or in Casablanca.',
    },
    {
      q: 'How can I reach him?',
      a: 'Book a Google Meet call from the contact page, email hello@youssefalouani.com, or find him on LinkedIn and GitHub (alouani-youssef).',
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
