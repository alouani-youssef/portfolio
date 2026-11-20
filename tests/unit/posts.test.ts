import { describe, it, expect } from 'vitest';
import { publishedPosts, upcomingPosts, byPopularity } from '../../src/lib/posts';

type P = { id: string; data: { pubDate: Date; draft: boolean; stats?: { claps: number; comments: number; asOf: Date }; title: string } };
const post = (id: string, date: string, opts: { draft?: boolean; views?: number; comments?: number } = {}): P => ({
  id,
  data: { pubDate: new Date(date), draft: opts.draft ?? false, title: id, stats: opts.views === undefined ? undefined : { claps: opts.views, comments: opts.comments ?? 0, asOf: new Date('2026-11-19') } },
});
const ids = (xs: Array<{ id: string }>) => xs.map((x) => x.id);

describe('byPopularity', () => {
  it('sorts by claps, then posts without stats newest first (Review Focus 2)', () => {
    const xs = [post('ten', '2022-01-01', { views: 10 }), post('fifty', '2021-01-01', { views: 50 }), post('none-2023', '2023-01-01'), post('none-2024', '2024-01-01')];
    expect(ids([...xs].sort(byPopularity))).toEqual(['fifty', 'ten', 'none-2024', 'none-2023']);
  });
  it('breaks equal claps by comments', () => {
    expect(ids([post('quiet', '2023-01-01', { views: 5, comments: 0 }), post('talked', '2022-01-01', { views: 5, comments: 4 })].sort(byPopularity))).toEqual(['talked', 'quiet']);
  });
  it('breaks equal claps and comments by date', () => {
    expect(ids([post('old', '2022-01-01', { views: 5 }), post('new', '2023-01-01', { views: 5 })].sort(byPopularity))).toEqual(['new', 'old']);
  });
});

describe('publishedPosts', () => {
  const posts = [post('en/old', '2022-01-01', { views: 900 }), post('en/draft', '2026-11-01', { draft: true }), post('en/new', '2023-07-22', { views: 100 })];
  it('drops drafts in production, most read first', () => {
    expect(ids(publishedPosts(posts, { preview: false, includeDrafts: true }))).toEqual(['en/old', 'en/new']);
  });
  it('drops drafts from feeds even in preview', () => {
    expect(ids(publishedPosts(posts, { preview: true, includeDrafts: false }))).toEqual(['en/old', 'en/new']);
  });
  it('shows drafts on preview pages', () => {
    expect(ids(publishedPosts(posts, { preview: true, includeDrafts: true }))).toContain('en/draft');
  });
});

describe('upcomingPosts', () => {
  it('returns only drafts, by title', () => {
    const xs = [post('b', '2026-12-01', { draft: true }), post('pub', '2022-01-01'), post('a', '2026-12-10', { draft: true })];
    expect(ids(upcomingPosts(xs))).toEqual(['a', 'b']);
  });
});
