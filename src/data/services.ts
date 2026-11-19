/**
 * Services shown on /contact. Each one carries the email template a visitor
 * starts from when they pick it, so the first message arrives with the
 * details needed to answer it.
 */
export interface Service {
  id: string;
  title: string;
  icon: string;
  summary: string;
  points: string[];
  template: { subject: string; body: string };
}

const sign = '\n\nThanks,\n[Your name]\n[Company / role]';

export const services: Service[] = [
  {
    id: 'role',
    title: 'Backend & AI positions',
    icon: 'lucide:briefcase',
    summary: 'Open to backend and AI engineering positions, remote or in Casablanca.',
    points: ['AI systems / backend engineer', 'Lead or founding engineer', 'Remote or Casablanca-based'],
    template: {
      subject: 'Role: [title] at [company]',
      body:
        'Hi Youssef,\n\nI am reaching out about a [title] role at [company].\n\n' +
        'Team and product: [short description]\n' +
        'Location / remote: [details]\n' +
        'Compensation range: [range]\n' +
        'Link to the job description: [URL]' + sign,
    },
  },
  {
    id: 'backend',
    title: 'Backend & multi-tenant SaaS',
    icon: 'lucide:server',
    summary: 'Design and build backends that stay fast and correct as tenants, traffic and teams grow.',
    points: ['NestJS, Go and Python services', 'Multi-tenant data isolation', 'Kafka, RabbitMQ, WebSockets and SSE'],
    template: {
      subject: 'Backend project: [short description]',
      body:
        'Hi Youssef,\n\nI am working on [product / platform] and would like your help with the backend.\n\n' +
        'What we have today: [stack, scale, team size]\n' +
        'What we need: [new service / multi-tenancy / performance / architecture review]\n' +
        'Timeline: [dates]\n' +
        'Engagement: [freelance / contract / advisory]' + sign,
    },
  },
  {
    id: 'ai',
    title: 'Applied AI & LLM systems',
    icon: 'lucide:sparkles',
    summary: 'Ship AI features that are grounded in your data, measurable, and safe to put in front of users.',
    points: ['RAG on Milvus and PostgreSQL', 'MCP servers and tool-using agents', 'PII redaction and auth propagation'],
    template: {
      subject: 'AI system: [use case]',
      body:
        'Hi Youssef,\n\nWe want to build [assistant / RAG search / agent / MCP server] for [users].\n\n' +
        'Data sources: [documents, databases, APIs]\n' +
        'Constraints: [privacy, hosting, models allowed]\n' +
        'Where we are: [idea / prototype / in production]\n' +
        'Timeline: [dates]' + sign,
    },
  },
  {
    id: 'speech',
    title: 'Speech & language',
    icon: 'lucide:audio-lines',
    summary: 'Speech-to-text and NLU tuned for real calls, dialects and the languages your users speak.',
    points: ['Whisper fine-tuning for dialects', 'Call-audio data preparation', 'Arabic, French and English NLU'],
    template: {
      subject: 'Speech / NLU project: [language or dialect]',
      body:
        'Hi Youssef,\n\nWe need [transcription / NLU / voice analytics] for [language or dialect].\n\n' +
        'Audio we have: [hours, quality, labelled or not]\n' +
        'Target: [accuracy, latency, on-prem or cloud]\n' +
        'Timeline: [dates]' + sign,
    },
  },
  {
    id: 'platform',
    title: 'Security, identity & platform',
    icon: 'lucide:shield-check',
    summary: 'Keycloak, privacy and data-retention layers, and migrations that do not take production down.',
    points: ['Keycloak SSO and multi-tenant auth', 'Kubernetes and Ansible', 'Cloud and on-prem migrations'],
    template: {
      subject: 'Platform / security work: [topic]',
      body:
        'Hi Youssef,\n\nWe are looking for help with [Keycloak / migration / Kubernetes / privacy and retention].\n\n' +
        'Current setup: [hosting, stack]\n' +
        'Goal: [what should change]\n' +
        'Regulatory context: [banking, government, GDPR, none]\n' +
        'Timeline: [dates]' + sign,
    },
  },
];

export function mailtoHref(email: string, t: { subject: string; body: string }): string {
  return `mailto:${email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.body)}`;
}
