import { getCollection, getEntries, getEntry } from 'astro:content';
import { profile } from '../data/profile';
import { groupClients } from './clients';
import { entrySlug } from './i18n';
import { getRoles } from './experience';
import { getProjects } from './projects';
import { getPosts } from './post-queries';
import { isPreview } from './metrics';
import { mdxToMarkdown, twinHref } from './markdown';

const SITE = 'https://youssefalouani.com';

export interface Twin { path: string; markdown: string }

function page(route: string, title: string, sections: string[]): Twin {
  const body = [`# ${title}`, `Source: ${SITE}${route === '/' ? '/' : route}`, ...sections.filter(Boolean)].join('\n\n');
  return { path: twinHref(route), markdown: body.replace(/\n{3,}/g, '\n\n').trim() + '\n' };
}

const list = (items: string[]) => items.map((i) => `- ${i}`).join('\n');
const date = (d: Date) => d.toISOString().slice(0, 10);

async function clientsSection(experienceId?: string): Promise<string> {
  const all = (await getCollection('clients')).map((c) => c.data).filter((c) => !experienceId || c.experience.id === experienceId);
  return groupClients(all).map((g) => `### ${g.label}\n\n${list(g.clients.map((c) => c.name))}`).join('\n\n');
}

export async function buildTwins(): Promise<Twin[]> {
  const roles = await getRoles();
  const projects = await getProjects();
  const posts = await getPosts(false);
  const recs = await getCollection('recommendations');
  const skills = await getCollection('skills');
  const preview = isPreview();
  const twins: Twin[] = [];

  twins.push(page('/', profile.name, [
    `**${profile.headline}**`,
    profile.oneLiner,
    `## What I build\n\n${profile.expertise.map((e) => `### ${e.title}\n\n${e.body}`).join('\n\n')}`,
    `## Featured case studies\n\n${list(projects.filter((p) => p.data.featured).map((p) => `[${p.data.title}](${SITE}${twinHref(`/projects/${entrySlug(p.id)}`)}): ${p.data.summary}`))}`,
    `## Clients I have worked for\n\n${await clientsSection()}`,
    `## Elsewhere\n\n${list([`Email: ${profile.email}`, `GitHub: ${profile.links.github}`, `LinkedIn: ${profile.links.linkedin}`, `Résumé (JSON Resume): ${SITE}/resume.json`])}`,
  ]));

  twins.push(page('/about', 'About', [
    profile.longBio.join('\n\n'),
    `## Education\n\n${profile.education.degree}, ${profile.education.school}, ${profile.education.start}–${profile.education.end}`,
    `## Languages\n\n${profile.languages.map((l) => l.name).join(', ')}`,
    `## Skills\n\n${list([...new Set(skills.map((s) => s.data.category))].map((cat) => `${cat}: ${skills.filter((s) => s.data.category === cat).map((s) => `${s.data.name} (${s.data.level})`).join(', ')}`))}`,
    `## Recommendations\n\n${recs.map((r) => `> ${r.data.quote}\n\n${r.data.author}, ${r.data.title} (${r.data.relationship}, ${date(r.data.date)}). ${r.data.url}`).join('\n\n')}`,
    `## FAQ\n\n${profile.faq.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}`,
  ]));

  twins.push(page('/experience', 'Experience', [
    list(roles.map((r) => `${r.data.period}: [${r.data.company}](${SITE}${twinHref(`/experience/${entrySlug(r.id)}`)}), ${r.data.role}. ${r.data.summary}`)),
    `## Education\n\n${profile.education.degree}, ${profile.education.school}, ${profile.education.start}–${profile.education.end}`,
  ]));

  for (const r of roles) {
    const d = r.data;
    const stack = (await getEntries(d.skills)).map((s) => s.data.name).join(', ');
    twins.push(page(`/experience/${entrySlug(r.id)}`, `${d.company}: ${d.role}`, [
      list([`Period: ${d.period}`, `Location: ${d.location}`, ...(d.founding ? ['Founding engineer'] : []), ...(d.teamSize ? [`Team size: ${d.teamSize}`] : []), ...(d.url ? [`Website: ${d.url}`] : [])]),
      d.summary,
      mdxToMarkdown(r.body ?? ''),
      `## Stack\n\n${stack}`,
      `## Outcome\n\n${d.outcome}`,
      `## What I'd do differently\n\n${d.differently}`,
      `## Clients\n\n${await clientsSection(r.id)}`,
    ]));
  }

  twins.push(page('/projects', 'Projects', [
    list(projects.map((p) => `[${p.data.title}](${SITE}${twinHref(`/projects/${entrySlug(p.id)}`)}) (${p.data.area}): ${p.data.summary}`)),
  ]));

  for (const p of projects) {
    const d = p.data;
    const stack = (await getEntries(d.skills)).map((s) => s.data.name).join(', ');
    const company = d.company ? await getEntry(d.company) : undefined;
    const metrics = d.metrics.filter((m) => preview || !m.placeholder);
    twins.push(page(`/projects/${entrySlug(p.id)}`, d.title, [
      list([`Kind: ${d.kind}`, `Status: ${d.status}`, ...(company ? [`Company: ${company.data.company}`] : []), `Updated: ${date(d.updatedAt)}`]),
      d.summary,
      mdxToMarkdown(p.body ?? ''),
      d.media.length ? `## Screenshots\n\n${list(d.media.map((m) => `${m.alt}. ${m.caption}`))}` : '',
      `## Results\n\n${metrics.length ? list(metrics.map((m) => `${m.label}: ${m.value}${m.placeholder ? ' (sample figure, not yet confirmed)' : ''}`)) : 'Numbers to come.'}`,
      `## Stack and links\n\n${stack}${d.links.repo ? `\n\nRepository: ${d.links.repo}` : ''}${d.links.demo ? `\n\nLive product: ${d.links.demo}` : ''}`,
    ]));
  }

  twins.push(page('/blog', 'Blog', [
    list(posts.map((p) => `${date(p.data.pubDate)}: [${p.data.title}](${p.data.external ? p.data.external.url : `${SITE}${twinHref(`/blog/${entrySlug(p.id)}`)}`})${p.data.external ? ' (on Medium)' : ''}. ${p.data.description}`)),
  ]));

  for (const p of posts.filter((x) => !x.data.external)) {
    twins.push(page(`/blog/${entrySlug(p.id)}`, p.data.title, [
      list([`Published: ${date(p.data.pubDate)}`, `Tags: ${p.data.tags.join(', ')}`]),
      p.data.description,
      mdxToMarkdown(p.body ?? ''),
    ]));
  }

  twins.push(page('/now', 'Now', [`Updated: ${profile.now.updated}`, list(profile.now.items)]));
  twins.push(page('/contact', 'Contact', [list([`Email: ${profile.email}`, `LinkedIn: ${profile.links.linkedin}`, `GitHub: ${profile.links.github}`, `CV: ${SITE}/cv`])]));
  twins.push(page('/cv', `${profile.name}: CV`, [
    profile.headline,
    profile.shortBio,
    `## Experience\n\n${roles.map((r) => `### ${r.data.company}, ${r.data.role} (${r.data.period})\n\n${r.data.summary}\n\n${list(r.data.highlights)}`).join('\n\n')}`,
    `## Education\n\n${profile.education.degree}, ${profile.education.school}, ${profile.education.start}–${profile.education.end}`,
    `## Contact\n\n${profile.email}`,
  ]));

  return twins;
}
