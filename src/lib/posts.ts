type Stats = { claps: number; comments: number; asOf: Date };
type PostLike = { id: string; data: { pubDate: Date; draft: boolean; stats?: Stats; title?: string } };

/** Most clapped first, then most commented; posts without stats follow, newest first. */
export function byPopularity<T extends { data: { stats?: Stats; pubDate: Date } }>(a: T, b: T): number {
  const ca = a.data.stats?.claps ?? -1;
  const cb = b.data.stats?.claps ?? -1;
  const ka = a.data.stats?.comments ?? -1;
  const kb = b.data.stats?.comments ?? -1;
  return cb - ca || kb - ka || b.data.pubDate.getTime() - a.data.pubDate.getTime();
}

/**
 * Posts visible in a given context, most read first. Drafts appear only on preview pages
 * (preview && includeDrafts); feeds, sitemap, /api and llms*.txt pass includeDrafts: false.
 */
export function publishedPosts<T extends PostLike>(posts: T[], opts: { preview: boolean; includeDrafts?: boolean }): T[] {
  const showDrafts = opts.preview && opts.includeDrafts === true;
  return posts.filter((p) => showDrafts || !p.data.draft).sort(byPopularity);
}

/** Drafts, listed on /blog as "Coming soon" in every build: no date, no link. */
export function upcomingPosts<T extends PostLike>(posts: T[]): T[] {
  return posts.filter((p) => p.data.draft).sort((a, b) => (a.data.title ?? a.id).localeCompare(b.data.title ?? b.id));
}
