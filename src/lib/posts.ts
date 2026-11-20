type Stats = { claps: number; comments: number; asOf: Date };
type PostLike = { id: string; data: { pubDate: Date; draft: boolean; stats?: Stats; title?: string } };

/** A comment weighs as much as this many claps when ranking posts. */
export const CLAPS_PER_COMMENT = 10;

const score = (s?: Stats) => (s ? s.claps + CLAPS_PER_COMMENT * s.comments : -1);

/**
 * Highest score first (claps + 10 per comment), ties broken by comments;
 * posts without stats follow, newest first.
 */
export function byPopularity<T extends { data: { stats?: Stats; pubDate: Date } }>(a: T, b: T): number {
  const ka = a.data.stats?.comments ?? -1;
  const kb = b.data.stats?.comments ?? -1;
  return score(b.data.stats) - score(a.data.stats) || kb - ka || b.data.pubDate.getTime() - a.data.pubDate.getTime();
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
