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

/** Top-level case studies (a `focus`, no `parent`): featured first, then in display order. */
export async function getTopProjects(): Promise<CollectionEntry<'projects'>[]> {
  const top = (await getProjects()).filter((p) => p.data.focus && !p.data.parent);
  return top.sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.order - b.data.order);
}

/** Focus areas with how many top-level case studies carry each, in FOCUS_AREAS order; unused areas dropped. */
export function focusCounts(projects: CollectionEntry<'projects'>[]): Array<{ id: FocusId; title: string; count: number }> {
  return FOCUS_AREAS.map((a) => ({ id: a.id, title: a.title, count: projects.filter((p) => p.data.focus?.includes(a.id)).length })).filter((a) => a.count > 0);
}

/** Deep dives of a case study, in display order. */
export async function getChildren(id: string): Promise<CollectionEntry<'projects'>[]> {
  return (await getProjects()).filter((p) => p.data.parent?.id === id);
}
