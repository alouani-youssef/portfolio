import { getCollection, type CollectionEntry } from 'astro:content';
import { entryLang } from './i18n';

/** English roles, newest first. */
export async function getRoles(): Promise<CollectionEntry<'experience'>[]> {
  const all = await getCollection('experience', (e) => entryLang(e.id) === 'en');
  return all.sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
}
