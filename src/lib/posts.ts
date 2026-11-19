type PostLike = { id: string; data: { pubDate: Date; draft: boolean; views?: number; title?: string } };

/** Most read first; posts without a view count follow, newest first. */
export function byPopularity<T extends { data: { views?: number; pubDate: Date } }>(a: T, b: T): number {
  const va = a.data.views ?? -1;
  const vb = b.data.views ?? -1;
  return vb - va || b.data.pubDate.getTime() - a.data.pubDate.getTime();
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
