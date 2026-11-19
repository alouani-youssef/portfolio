type PostLike = { id: string; data: { pubDate: Date; draft: boolean } };

/**
 * Posts visible in a given context, newest first. Drafts appear only on preview pages
 * (preview && includeDrafts); feeds, sitemap, /api and llms*.txt pass includeDrafts: false.
 */
export function publishedPosts<T extends PostLike>(posts: T[], opts: { preview: boolean; includeDrafts?: boolean }): T[] {
  const showDrafts = opts.preview && opts.includeDrafts === true;
  return posts
    .filter((p) => showDrafts || !p.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
