import { z } from 'astro/zod';

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
    mediumA: z.url(),
    mediumB: z.url(),
    osoul: z.url(),
  }),
  sameAs: z.array(z.url()),
  education: z.object({ degree: z.string(), school: z.string(), start: z.number(), end: z.number() }),
  /** `project` is the slug of the case study that best shows the area, featured on the home page. */
  expertise: z.array(z.object({ title: z.string(), body: z.string(), skills: z.array(z.string()), project: z.string() })).length(4),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).min(6).max(8),
  now: z.object({ updated: z.string(), items: z.array(z.string()) }),
  knowsAbout: z.array(z.string()),
});

export type Profile = z.infer<typeof profileSchema>;

export const profile: Profile = {
  name: 'Youssef Alouani',
  jobTitle: 'Lead Backend & AI Engineer',
  headline: 'Lead Backend & AI Engineer, founder of Osoul. I build multi-tenant platforms and the AI systems that run on them.',
  oneLiner: 'Casablanca-based backend and AI engineer, founder of Osoul. NestJS, Go, Python; RAG, MCP servers, speech-to-text, and secure multi-tenant SaaS.',
  shortBio:
    'Youssef Alouani is a senior backend and AI engineer in Casablanca and the technical founder of Osoul, a Revenue-as-a-Service (RaaS) growth engine for fine-dining restaurants. He has spent five years building backends, conversational AI and data pipelines at Qalqul, Finamaze and Axelerated Solutions, with a focus on security, privacy and systems that hold up in production.',
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
    mediumA: 'https://alouani-youssef.medium.com',
    mediumB: 'https://medium.com/@alouaniyoussef',
    osoul: 'https://osoul.io',
  },
  sameAs: [
    'https://www.linkedin.com/in/alouani-youssef',
    'https://github.com/alouani-youssef',
    'https://alouani-youssef.medium.com',
    'https://medium.com/@alouaniyoussef',
  ],
  education: {
    degree: "Diplôme d'Ingénieur d'État in Computer Science",
    school: 'Hassan First University, FST Settat',
    start: 2019,
    end: 2022,
  },
  expertise: [
    {
      title: 'Backend and distributed systems',
      body: 'Multi-tenant SaaS, dual-database provisioning, API gateways, messaging (Kafka, RabbitMQ), real-time over WebSockets and SSE, push notifications, recommendation systems, ad signal infrastructure.',
      skills: ['nestjs', 'typeorm', 'kafka', 'rabbitmq', 'websockets', 'sse'],
      project: 'osoul-multi-tenancy',
    },
    {
      title: 'Applied AI and LLM systems',
      body: 'RAG on Milvus, MCP servers, tool-using agents with LangChain and LangGraph, local models via Ollama, OpenAI-compatible APIs, model-serving REST APIs with FastAPI, AI assistants with PII redaction and user auth propagation, familiarity with LLM evaluation tools (DeepEval, Giskard), and AI Stones, a personal AI harness for Claude.',
      skills: ['rag', 'mcp', 'milvus', 'langchain', 'langgraph', 'ollama', 'fastapi'],
      project: 'customer-voice',
    },
    {
      title: 'Speech and language',
      body: 'Whisper large-v3 fine-tuning for Saudi dialect, call-audio data preparation, NLP/NLU engines on language servers and Duckling, Botpress v12 core, KYC document and visual verification.',
      skills: ['whisper', 'fine-tuning', 'nllb-200'],
      project: 'saudi-stt',
    },
    {
      title: 'Security, privacy and platform',
      body: 'Keycloak auth, data-retention and privacy layers, session-token design for NFC/QR tables, Kubernetes, Ansible, migrations (Docker Compose to Kubernetes, Hetzner to Oracle Cloud, stateful to stateless), hybrid deployments for banking and government institutions.',
      skills: ['keycloak', 'privacy-retention', 'token-session-design', 'kubernetes', 'ansible', 'hybrid-deployments'],
      project: 'osoul-table-sessions',
    },
  ],
  faq: [
    {
      q: 'What does Youssef Alouani do now?',
      a: 'He is the technical founder of Osoul, a Revenue-as-a-Service growth engine for fine-dining restaurants, and the founder of 10xJobs, a job-matching pipeline for software engineers. Before that he was Lead Backend Engineer and a founding engineer at Axelerated Solutions.',
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
      a: 'He is building Osoul full time and is open to conversations about senior backend and AI engineering roles.',
    },
    {
      q: 'How can I reach him?',
      a: 'By email at hello@youssefalouani.com, or on LinkedIn and GitHub (alouani-youssef).',
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
  knowsAbout: ['NestJS', 'Go', 'Python', 'RAG', 'Model Context Protocol', 'Whisper fine-tuning', 'Multi-tenant SaaS', 'Keycloak'],
};
