import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { entryLang } from './i18n';

/** English case studies in display order. */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects', (p) => entryLang(p.id) === 'en');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export interface ProjectGroup {
  /** Experience entry id (e.g. `en/osoul`), or `independent` for projects without a company. */
  id: string;
  anchor: string;
  role?: CollectionEntry<'experience'>;
  projects: CollectionEntry<'projects'>[];
}

/** Projects grouped by the company they were built at, newest role first; independent work last. */
export async function getProjectGroups(): Promise<ProjectGroup[]> {
  const [projects, roles] = await Promise.all([getProjects(), getCollection('experience', (e) => entryLang(e.id) === 'en')]);
  roles.sort((a, b) => Number(a.data.sideProject) - Number(b.data.sideProject) || b.data.start.getTime() - a.data.start.getTime());
  const groups: ProjectGroup[] = roles
    .map((role) => ({ id: role.id, anchor: role.id.split('/').pop()!.replace(/^(\d)/, 'p-$1'), role, projects: projects.filter((p) => p.data.company?.id === role.id) }))
    .filter((g) => g.projects.length > 0);
  const independent = projects.filter((p) => !p.data.company);
  if (independent.length) groups.push({ id: 'independent', anchor: 'independent', projects: independent });
  return groups;
}

/** Image shown on project cards: the explicit cover, else the first screenshot. */
export function projectThumb(p: CollectionEntry<'projects'>): { src: ImageMetadata; alt: string } {
  return { src: p.data.cover, alt: p.data.coverAlt };
}
