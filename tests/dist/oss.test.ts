import { describe, it, expect } from 'vitest';
import { readHtml, listHtmlPages } from './helpers';

const ENTRIES = [
  ['ai-stones', 'AI Stones', 'MIT'],
  ['archio', 'archio', 'Apache-2.0'],
  ['translator', 'translator', 'Apache-2.0'],
  ['tracking-kit', 'Tracking kit', 'Apache-2.0'],
  ['pg-inspector', 'pg_inspector', 'Apache-2.0'],
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
    expect(cards[3].querySelector('a[href="https://github.com/alouani-youssef/tracker"]')).not.toBeNull();
    expect(cards[3].querySelector('a[href="https://github.com/alouani-youssef/tracking-sdk"]')).not.toBeNull();
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

import { readText, exists } from './helpers';

describe('open source in agent outputs and the CV', () => {
  const names = ['AI Stones', 'archio', 'translator', 'Tracking kit', 'pg_inspector'];
  it('has a markdown twin and an llms.txt section', () => {
    expect(exists('open-source.md')).toBe(true);
    const md = readText('open-source.md');
    for (const n of names) expect(md).toContain(`## ${n}`);
    expect(readText('llms.txt')).toContain('## Open source');
    expect(readText('llms-full.txt')).toContain('# Open source');
  });
  it('publishes api/oss.json and resume projects', () => {
    expect(JSON.parse(readText('api/oss.json'))).toHaveLength(5);
    expect(JSON.parse(readText('resume.json')).projects.map((p: any) => p.name)).toEqual(names);
  });
  it('carries SoftwareSourceCode JSON-LD for each entry', () => {
    const ld = readHtml('/open-source').querySelectorAll('script[type="application/ld+json"]').map((s) => JSON.parse(s.text));
    const items = ld.filter((x) => x['@type'] === 'SoftwareSourceCode');
    expect(items).toHaveLength(5);
    for (const i of items) expect(i.license).toMatch(/^https:\/\/spdx\.org\/licenses\/(MIT|Apache-2\.0)\.html$/);
  });
  it('lists open source on the CV', () => {
    const cv = readHtml('/cv').querySelector('main')!.text;
    expect(cv).toContain('Open source');
    for (const n of names) expect(cv).toContain(n);
  });
  it('keeps hidden repos out of every agent output', () => {
    for (const f of ['llms.txt', 'llms-full.txt', 'api/oss.json', 'api/projects.json', 'resume.json', 'open-source.md', 'index.md']) {
      expect(readText(f), f).not.toMatch(/source-graph|starters|scrapper/);
    }
  });
});
