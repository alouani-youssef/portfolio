import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { entryLang } from './i18n';
import { FOCUS_AREAS, type FocusId } from './focus';

/** English case studies in display order. */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects', (p) => entryLang(p.id) === 'en');
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Image shown on project cards: the explicit cover, else the first screenshot. */
export function projectThumb(p: CollectionEntry<'projects'>): { src: ImageMetadata; alt: string } {
  return { src: p.data.cover, alt: p.data.coverAlt };
}

export interface ProjectArea {
  id: FocusId;
  title: string;
  projects: CollectionEntry<'projects'>[];
}

/** Top-level case studies (a `focus`, no `parent`) by focus area, in FOCUS_AREAS order; empty areas dropped. */
export async function getProjectAreas(): Promise<ProjectArea[]> {
  const top = (await getProjects()).filter((p) => p.data.focus && !p.data.parent);
  return FOCUS_AREAS.map((a) => ({ id: a.id, title: a.title, projects: top.filter((p) => p.data.focus === a.id) })).filter((a) => a.projects.length > 0);
}

/** Deep dives of a case study, in display order. */
export async function getChildren(id: string): Promise<CollectionEntry<'projects'>[]> {
  return (await getProjects()).filter((p) => p.data.parent?.id === id);
}
