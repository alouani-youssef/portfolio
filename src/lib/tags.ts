/**
 * Blog tag registry. Every tag a post uses must be listed here (the content schema
 * enforces it), so each tag has a label, an icon, a colour and a one-line blurb.
 * `hue` is an OKLCH hue in degrees; covers and chips derive both theme colours from it.
 */
export interface TagMeta { label: string; icon: string; hue: number; blurb: string }

export const TAGS = {
  architecture: { label: 'Architecture', icon: 'lucide:layers', hue: 255, blurb: 'How systems are split, connected and kept changeable.' },
  'api-gateway': { label: 'API gateway', icon: 'lucide:route', hue: 230, blurb: 'The front door of a backend: routing, auth and rate limits.' },
  messaging: { label: 'Messaging', icon: 'lucide:arrow-left-right', hue: 25, blurb: 'Brokers, queues and event streams.' },
  kafka: { label: 'Kafka', icon: 'si:apachekafka', hue: 265, blurb: 'Apache Kafka: topics, partitions and consumer groups.' },
  rabbitmq: { label: 'RabbitMQ', icon: 'si:rabbitmq', hue: 45, blurb: 'RabbitMQ: exchanges, queues, bindings and acks.' },
  databases: { label: 'Databases', icon: 'lucide:database', hue: 150, blurb: 'Storing and querying data, relational and otherwise.' },
  networking: { label: 'Networking', icon: 'lucide:network', hue: 200, blurb: 'How machines find and talk to each other.' },
  git: { label: 'Git', icon: 'si:git', hue: 15, blurb: 'Version control and the workflows around it.' },
  career: { label: 'Career', icon: 'lucide:briefcase', hue: 75, blurb: 'The software industry and working in it.' },
  containers: { label: 'Containers', icon: 'si:docker', hue: 215, blurb: 'Virtual machines, containers and what each isolates.' },
  infrastructure: { label: 'Infrastructure', icon: 'lucide:server-cog', hue: 180, blurb: 'Servers, clusters and running software on them.' },
  kubernetes: { label: 'Kubernetes', icon: 'si:kubernetes', hue: 240, blurb: 'Orchestrating containers in production.' },
  ai: { label: 'AI', icon: 'lucide:sparkles', hue: 295, blurb: 'Machine learning and LLM systems in production.' },
  'speech-to-text': { label: 'Speech to text', icon: 'lucide:audio-lines', hue: 320, blurb: 'Turning call and voice-note audio into text.' },
  whisper: { label: 'Whisper', icon: 'lucide:audio-waveform', hue: 310, blurb: 'Working with OpenAI Whisper models.' },
  'fine-tuning': { label: 'Fine-tuning', icon: 'lucide:sliders-horizontal', hue: 280, blurb: 'Adapting pretrained models to a domain.' },
} as const satisfies Record<string, TagMeta>;

export type TagId = keyof typeof TAGS;
export const TAG_IDS = Object.keys(TAGS) as [TagId, ...TagId[]];

export function tagMeta(id: string): TagMeta {
  const meta = (TAGS as Record<string, TagMeta>)[id];
  if (!meta) throw new Error(`Unknown blog tag: ${id}`);
  return meta;
}

/** Tags in use with their post counts, most used first, then alphabetical by label. */
export function tagCounts(posts: Array<{ data: { tags: readonly string[] } }>): Array<{ id: TagId; count: number }> {
  const counts = new Map<TagId, number>();
  for (const p of posts) for (const t of p.data.tags) counts.set(t as TagId, (counts.get(t as TagId) ?? 0) + 1);
  return [...counts]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count || tagMeta(a.id).label.localeCompare(tagMeta(b.id).label));
}

/** Posts sharing the most tags with `post`, newest first on ties; never the post itself. */
export function relatedByTags<T extends { id: string; data: { tags: readonly string[]; pubDate: Date } }>(post: T, posts: T[], limit = 3): T[] {
  const own = new Set(post.data.tags);
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, shared: p.data.tags.filter((t) => own.has(t)).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || b.p.data.pubDate.getTime() - a.p.data.pubDate.getTime())
    .slice(0, limit)
    .map((x) => x.p);
}

/** Minutes to read at 230 words a minute, ignoring MDX imports, JSX comments and tags. */
export function readingMinutes(body: string): number {
  const text = body
    .replace(/^import .*$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return Math.max(1, Math.round(words / 230));
}
