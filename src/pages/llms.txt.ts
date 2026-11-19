import { profile } from '../data/profile';
import { getRoles } from '../lib/experience';
import { getProjects } from '../lib/projects';
import { getPosts } from '../lib/post-queries';
import { entrySlug } from '../lib/i18n';
import { buildLlmsTxt } from '../lib/llms';

export async function GET() {
  const txt = buildLlmsTxt({
    profile,
    site: 'https://youssefalouani.com',
    roles: (await getRoles()).map((r) => ({ slug: entrySlug(r.id), company: r.data.company })),
    projects: (await getProjects()).map((p) => ({ slug: entrySlug(p.id), title: p.data.title, summary: p.data.summary })),
    posts: (await getPosts(false)).map((p) => ({ slug: entrySlug(p.id), title: p.data.title, external: p.data.external })),
  });
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
