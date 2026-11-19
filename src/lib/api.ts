import { getCollection, getEntries, getEntry } from 'astro:content';
import { profile } from '../data/profile';
import { groupClients } from './clients';
import { entrySlug } from './i18n';
import { getRoles } from './experience';
import { getProjects } from './projects';
import { getPosts } from './post-queries';
import { twinHref } from './markdown';
import type { ApiName } from './api-schemas';
import { partialDate } from './resume';
import { getOss } from './oss';

const SITE = 'https://youssefalouani.com';
const day = (d: Date) => d.toISOString().slice(0, 10);

export async function buildApi(name: ApiName): Promise<unknown> {
  switch (name) {
    case 'profile': {
      const clients = (await getCollection('clients')).map((c) => c.data);
      return {
        id: 'youssef-alouani',
        updatedAt: profile.now.updated,
        url: `${SITE}/about`,
        name: profile.name,
        jobTitle: profile.jobTitle,
        headline: profile.headline,
        summary: profile.shortBio,
        location: profile.location,
        languages: profile.languages.map((l) => l.name),
        email: profile.email,
        links: profile.links,
        expertise: profile.expertise.map(({ title, body }) => ({ title, body })),
        clients: groupClients(clients).map((g) => ({ group: g.group, label: g.label, clients: g.clients.map((c) => c.name) })),
        education: profile.education,
      };
    }
    case 'experience': {
      const clients = await getCollection('clients');
      return Promise.all((await getRoles()).map(async (r) => ({
        id: entrySlug(r.id),
        updatedAt: day(r.data.updatedAt),
        url: `${SITE}/experience/${entrySlug(r.id)}`,
        company: r.data.company,
        role: r.data.role,
        period: r.data.period,
        start: partialDate(r.data.start, r.data.precision),
        end: r.data.end ? partialDate(r.data.end, r.data.precision) : null,
        location: r.data.location,
        founding: r.data.founding,
        teamSize: r.data.teamSize ?? null,
        summary: r.data.summary,
        highlights: r.data.highlights,
        skills: r.data.skills.map((s) => s.id),
        clients: clients.filter((c) => c.data.experience.id === r.id).map((c) => c.data.name),
      })));
    }
    case 'projects':
      return Promise.all((await getProjects()).map(async (p) => {
        const company = p.data.company ? await getEntry(p.data.company) : undefined;
        const slug = entrySlug(p.id);
        return {
          id: slug,
          updatedAt: day(p.data.updatedAt),
          url: `${SITE}/projects/${slug}`,
          title: p.data.title,
          summary: p.data.summary,
          area: p.data.area,
          kind: p.data.kind,
          status: p.data.status,
          company: company?.data.company ?? null,
          skills: (await getEntries(p.data.skills)).map((s) => s.id),
          links: Object.fromEntries(Object.entries(p.data.links).filter(([, v]) => v)) as Record<string, string>,
          metrics: p.data.metrics.map((m) => ({ label: m.label, value: m.value, confirmed: !m.placeholder })),
          markdown: `${SITE}${twinHref(`/projects/${slug}`)}`,
        };
      }));
    case 'oss':
      return (await getOss()).map((o) => ({
        id: o.id,
        updatedAt: profile.now.updated,
        url: `${SITE}/open-source#${o.id}`,
        name: o.data.name,
        pitch: o.data.pitch,
        languages: o.data.languages,
        license: o.data.license,
        repos: o.data.repos,
        links: o.data.links,
        highlights: o.data.highlights,
      }));
    case 'skills':
      return (await getCollection('skills')).map((s) => ({
        id: s.id,
        updatedAt: profile.now.updated,
        url: `${SITE}/about#skill-${s.id}`,
        name: s.data.name,
        category: s.data.category,
        level: s.data.level,
        evidence: s.data.evidence,
      }));
    case 'posts':
      return (await getPosts(false)).map((p) => ({
        id: entrySlug(p.id),
        updatedAt: day(p.data.updatedDate ?? p.data.pubDate),
        url: p.data.external?.url ?? `${SITE}/blog/${entrySlug(p.id)}`,
        title: p.data.title,
        description: p.data.description,
        published: day(p.data.pubDate),
        tags: p.data.tags,
        external: Boolean(p.data.external),
      }));
  }
}
