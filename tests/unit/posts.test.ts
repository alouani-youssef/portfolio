import { describe, it, expect } from 'vitest';
import { publishedPosts } from '../../src/lib/posts';

const post = (id: string, date: string, draft = false) => ({ id, data: { pubDate: new Date(date), draft } });
const posts = [post('en/old', '2022-01-01'), post('en/draft', '2026-11-01', true), post('en/new', '2023-07-22')];
const ids = (xs: Array<{ id: string }>) => xs.map((x) => x.id);

describe('publishedPosts', () => {
  it('drops drafts in production', () => {
    expect(ids(publishedPosts(posts, { preview: false, includeDrafts: true }))).toEqual(['en/new', 'en/old']);
  });
  it('drops drafts from feeds even in preview', () => {
    expect(ids(publishedPosts(posts, { preview: true, includeDrafts: false }))).toEqual(['en/new', 'en/old']);
  });
  it('shows drafts on preview pages, newest first', () => {
    expect(ids(publishedPosts(posts, { preview: true, includeDrafts: true }))).toEqual(['en/draft', 'en/new', 'en/old']);
  });
});
