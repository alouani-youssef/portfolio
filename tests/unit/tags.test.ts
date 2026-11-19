import { describe, it, expect } from 'vitest';
import { TAGS, tagMeta, tagCounts, relatedByTags, readingMinutes } from '../../src/lib/tags';
import { resolveIcon } from '../../src/lib/skill-icons';

const post = (id: string, date: string, tags: string[]) => ({ id, data: { tags, pubDate: new Date(date) } });

describe('tag registry', () => {
  it('every tag has a resolvable icon, a hue and a blurb', () => {
    for (const [id, m] of Object.entries(TAGS)) {
      expect(() => resolveIcon(m.icon), id).not.toThrow();
      expect(m.hue, id).toBeGreaterThanOrEqual(0);
      expect(m.hue, id).toBeLessThan(360);
      expect(m.blurb.length, id).toBeGreaterThan(10);
    }
  });
  it('rejects unknown tags', () => expect(() => tagMeta('nope')).toThrow(/Unknown blog tag/));
});

describe('tagCounts', () => {
  it('orders by count, then label', () => {
    const counts = tagCounts([post('a', '2022-01-01', ['git', 'ai']), post('b', '2022-01-01', ['ai']), post('c', '2022-01-01', ['career'])]);
    expect(counts).toEqual([{ id: 'ai', count: 2 }, { id: 'career', count: 1 }, { id: 'git', count: 1 }]);
  });
});

describe('relatedByTags', () => {
  const me = post('me', '2023-01-01', ['containers', 'infrastructure']);
  const all = [me, post('one', '2024-01-01', ['containers']), post('two', '2022-01-01', ['containers', 'infrastructure']), post('none', '2025-01-01', ['git'])];
  it('ranks by shared tags, excludes self and unrelated posts', () => {
    expect(relatedByTags(me, all).map((p) => p.id)).toEqual(['two', 'one']);
  });
});

describe('readingMinutes', () => {
  it('ignores imports, comments and tags, with a one-minute floor', () => {
    expect(readingMinutes("import X from './x';\n<X />\n{/* CHECK */} short")).toBe(1);
    expect(readingMinutes('word '.repeat(690))).toBe(3);
  });
});
