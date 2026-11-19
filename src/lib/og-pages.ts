import { profile } from '../data/profile';
import { entrySlug } from './i18n';
import { getRoles } from './experience';
import { getProjects } from './projects';
import { getPosts } from './post-queries';
import { tagMeta } from './tags';

export interface OgPage { slug: string; title: string; subtitle?: string }

/** Route → OG image slug: '/' → 'index', '/projects/osoul' → 'projects/osoul'. */
export function ogSlug(path: string): string {
  return path === '/' ? 'index' : path.replace(/^\/|\/$/g, '');
}

export async function getOgPages(): Promise<OgPage[]> {
  const posts = await getPosts(true);
  const tags = [...new Set(posts.flatMap((p) => p.data.tags))];
  const clip = (s: string) => (s.length > 140 ? `${s.slice(0, 137)}…` : s);
  return [
    { slug: 'index', title: 'Lead Backend & AI Engineer, founder of Osoul.', subtitle: 'I build multi-tenant platforms and the AI systems that run on them.' },
    { slug: 'about', title: 'About', subtitle: clip(profile.oneLiner) },
    { slug: 'experience', title: 'Experience', subtitle: 'Four roles and a side project over five years, each with an AI thread.' },
    { slug: 'projects', title: 'Projects', subtitle: 'Case studies at the architecture level.' },
    { slug: 'open-source', title: 'Open source', subtitle: 'AI Stones, archio, translator, a tracking kit and pg_inspector.' },
    { slug: 'blog', title: 'Blog', subtitle: 'Backend architecture, RAG, MCP and speech-to-text.' },
    { slug: 'now', title: 'Now', subtitle: 'What I am building and writing this month.' },
    { slug: 'contact', title: 'Contact', subtitle: profile.email },
    { slug: 'cv', title: 'CV', subtitle: profile.jobTitle },
    { slug: '404', title: 'Page not found' },
    ...(await getRoles()).map((r) => ({ slug: `experience/${entrySlug(r.id)}`, title: r.data.company, subtitle: `${r.data.role} · ${r.data.period}` })),
    ...(await getProjects()).map((p) => ({ slug: `projects/${entrySlug(p.id)}`, title: p.data.title, subtitle: clip(p.data.summary) })),
    ...posts.filter((p) => !p.data.external).map((p) => ({ slug: `blog/${entrySlug(p.id)}`, title: p.data.title, subtitle: clip(p.data.description) })),
    ...tags.map((t) => ({ slug: `blog/tags/${t}`, title: `Writing on ${tagMeta(t).label}`, subtitle: tagMeta(t).blurb })),
  ];
}
