import type { Profile } from '../data/profile';

interface LlmsInput {
  profile: Profile;
  site: string;
  roles: Array<{ slug: string; company: string }>;
  projects: Array<{ slug: string; title: string; summary: string }>;
  posts: Array<{ slug: string; title: string; external?: { url: string } }>;
  oss?: Array<{ id: string; name: string; pitch: string }>;
}

export function buildLlmsTxt({ profile, site, roles, projects, posts, oss = [] }: LlmsInput): string {
  const lines = [
    `# ${profile.name}`,
    '',
    `> ${profile.oneLiner}`,
    '',
    profile.headline,
    '',
    '## Profile',
    `- [Home](${site}/index.md): headline, expertise, featured work, clients`,
    `- [About](${site}/about.md): long bio, education, languages, skills, recommendations, FAQ`,
    `- [Experience](${site}/experience.md): ${roles.map((r) => r.company).join(', ')}`,
    ...roles.map((r) => `- [${r.company}](${site}/experience/${r.slug}.md)`),
    `- [Now](${site}/now.md): current focus`,
    `- [Contact](${site}/contact.md)`,
    `- [Résumé (JSON Resume)](${site}/resume.json)`,
    '',
    '## Projects',
    ...projects.map((p) => `- [${p.title}](${site}/projects/${p.slug}.md): ${p.summary}`),
    '',
    ...(oss.length ? ['## Open source', ...oss.map((o) => `- [${o.name}](${site}/open-source.md): ${o.pitch}`), ''] : []),
    '## Writing',
    `- [All posts](${site}/blog.md)`,
    ...posts.filter((p) => !p.external).map((p) => `- [${p.title}](${site}/blog/${p.slug}.md)`),
    '',
    '## Data',
    ...['profile', 'experience', 'projects', 'oss', 'skills', 'posts'].map((n) => `- [${n}.json](${site}/api/${n}.json) (schema: ${site}/api/schema/${n}.json)`),
    '',
    '## Optional',
    `- [Full site in one file](${site}/llms-full.txt)`,
    '',
  ];
  return lines.join('\n');
}

/** Concatenate Markdown twins into one file, separated by rules. */
export function buildLlmsFull(twins: Array<{ markdown: string }>): string {
  return twins.map((t) => t.markdown.trim()).join('\n\n---\n\n') + '\n';
}
