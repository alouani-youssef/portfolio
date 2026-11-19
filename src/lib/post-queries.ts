import { getCollection, type CollectionEntry } from 'astro:content';
import { entryLang } from './i18n';
import { isPreview } from './metrics';
import { publishedPosts, upcomingPosts } from './posts';

/** English posts for the current build; pages pass includeDrafts: true, feeds false. */
export async function getPosts(includeDrafts: boolean): Promise<CollectionEntry<'blog'>[]> {
  const all = await getCollection('blog', (p) => entryLang(p.id) === 'en');
  return publishedPosts(all, { preview: isPreview(), includeDrafts });
}

/** English drafts, shown on /blog as "Coming soon" in every build. */
export async function getUpcomingPosts(): Promise<CollectionEntry<'blog'>[]> {
  return upcomingPosts(await getCollection('blog', (p) => entryLang(p.id) === 'en'));
}
