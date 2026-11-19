import { getCollection, type CollectionEntry } from 'astro:content';
import { entryLang } from './i18n';

/** English case studies in display order. */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects', (p) => entryLang(p.id) === 'en');
  return all.sort((a, b) => a.data.order - b.data.order);
}
