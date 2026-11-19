import { describe, it, expect } from 'vitest';
import { readHtml, listHtmlPages } from './helpers';

const ENTRIES = [
  ['ai-stones', 'AI Stones', 'MIT'],
  ['archio', 'archio', 'Apache-2.0'],
  ['translator', 'translator', 'Apache-2.0'],
  ['pg-inspector', 'pg_inspector', 'Apache-2.0'],
  ['tracking-kit', 'Tracking kit', 'Apache-2.0'],
] as const;

describe('/open-source', () => {
  const doc = readHtml('/open-source');
  const cards = doc.querySelectorAll('.oss-card');

  it('lists the five entries in order', () => {
    expect(doc.querySelector('h1')!.text.trim()).toBe('Open source');
    expect(cards.map((c) => c.getAttribute('id'))).toEqual(ENTRIES.map(([id]) => id));
    expect(cards.map((c) => c.querySelector('h2')!.text.trim())).toEqual(ENTRIES.map(([, name]) => name));
  });

  it('shows the exact SPDX licence and a GitHub link on each card (Review Focus 2)', () => {
    cards.forEach((card, i) => {
      expect(card.querySelector('.license')!.text.trim()).toBe(ENTRIES[i][2]);
      expect(card.querySelector('a[href^="https://github.com/alouani-youssef/"]')).not.toBeNull();
    });
  });

  it('links AI Stones to npm and the tracking kit to both repos', () => {
    expect(cards[0].querySelector('a[href="https://www.npmjs.com/package/ai-stones"]')).not.toBeNull();
    expect(cards[4].querySelector('a[href="https://github.com/alouani-youssef/tracker"]')).not.toBeNull();
    expect(cards[4].querySelector('a[href="https://github.com/alouani-youssef/tracking-sdk"]')).not.toBeNull();
  });
});

describe('open source elsewhere', () => {
  it('is in the header nav', () => {
    expect(readHtml('/').querySelector('header a[href="/open-source"]')).not.toBeNull();
  });
  it('has a home block naming all five and linking to the page', () => {
    const block = readHtml('/').querySelector('#open-source')!;
    for (const [, name] of ENTRIES) expect(block.text).toContain(name);
    expect(block.querySelector('a[href="/open-source"]')).not.toBeNull();
  });
  it('never mentions hidden repos or star counts (Review Focus 1)', () => {
    for (const route of listHtmlPages()) {
      const text = readHtml(route).querySelector('body')!.text;
      expect(text, route).not.toMatch(/source-graph|starters|scrapper|\bstars\b/i);
    }
  });
});
