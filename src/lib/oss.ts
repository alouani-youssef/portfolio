import { getCollection, type CollectionEntry } from 'astro:content';

/** Curated open-source entries in display order. */
export async function getOss(): Promise<CollectionEntry<'oss'>[]> {
  return (await getCollection('oss')).sort((a, b) => a.data.order - b.data.order);
}
