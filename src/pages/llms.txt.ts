import { profile } from '../data/profile';
import { SITE } from '../data/site';
import { getRoles } from '../lib/experience';
import { getProjects } from '../lib/projects';
import { getPosts } from '../lib/post-queries';
import { entrySlug } from '../lib/i18n';
import { buildLlmsTxt } from '../lib/llms';
import { getOss } from '../lib/oss';

export async function GET() {
  const txt = buildLlmsTxt({
    profile,
    site: SITE,
    roles: (await getRoles()).map((r) => ({ slug: entrySlug(r.id), company: r.data.company })),
    projects: (await getProjects()).map((p) => ({ slug: entrySlug(p.id), title: p.data.title, summary: p.data.summary })),
    oss: (await getOss()).map((o) => ({ id: o.id, name: o.data.name, pitch: o.data.pitch })),
    posts: (await getPosts(false)).map((p) => ({ slug: entrySlug(p.id), title: p.data.title, external: p.data.external })),
  });
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
