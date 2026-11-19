import { describe, it, expect } from 'vitest';
import type { HTMLElement, Node } from 'node-html-parser';
import { readHtml, listHtmlPages } from './helpers';

const CASES = ['osoul', 'saudi-stt', 'customer-voice', 'ai-stones', 'archio', 'finamaze-kyc'] as const;
const H2 = ['Problem', 'Constraints', 'Architecture', 'Key decisions', 'Results', 'Stack and links'];

describe('projects index', () => {
  it('links every case study with Osoul first as flagship', () => {
    const doc = readHtml('/projects');
    const hrefs = [...new Set(doc.querySelectorAll('main a[href^="/projects/"]').map((a) => a.getAttribute('href')))];
    expect(hrefs).toEqual(CASES.map((c) => `/projects/${c}`));
    expect(doc.querySelector('main a[href="/projects/osoul"]')!.text).toContain('Flagship');
  });
  it('home features the three case studies', () => {
    expect(readHtml('/').querySelectorAll('.featured-project')).toHaveLength(3);
  });
});

describe.each(CASES)('/projects/%s', (slug) => {
  const doc = readHtml(`/projects/${slug}`);
  it('follows the case-study template', () => {
    expect(doc.querySelectorAll('main h2').map((h) => h.text.trim())).toEqual(H2);
  });
  it('shows each stack chip with an icon, linking to its skill', () => {
    const chips = doc.querySelectorAll('ul[aria-label="Stack"] a.chip');
    expect(chips.length).toBeGreaterThan(0);
    for (const a of chips) {
      expect(a.getAttribute('href')).toMatch(/^\/about#skill-[a-z0-9-]+$/);
      expect(a.querySelector('svg[aria-hidden="true"]'), a.text).not.toBeNull();
    }
  });
  it('has an accessible diagram with its Mermaid source', () => {
    expect(doc.querySelector('svg[role="img"] title')?.text.trim()).toBeTruthy();
    const source = doc.querySelectorAll('main details').find((d) => d.text.includes('Diagram source'));
    expect(source?.text).toMatch(/flowchart|graph/);
  });
  it('diagram colours come from the theme (Review Focus 2)', () => {
    for (const el of doc.querySelectorAll('svg[role="img"] *')) {
      for (const attr of ['fill', 'stroke', 'style']) {
        expect(el.getAttribute(attr) ?? '', `${slug} <${el.tagName}> ${attr}`).not.toMatch(/#[0-9a-f]{3,6}\b/i);
      }
    }
  });
  it('marks placeholder metrics as samples in preview', () => {
    for (const m of doc.querySelectorAll('.metric')) {
      const isConfirmed = ['Venues live', 'Latest version on npm'].some((l) => m.text.includes(l));
      expect(m.querySelector('.badge') === null, m.text).toBe(isConfirmed);
    }
  });
  it('gives every image alt text and never uses excluded media', () => {
    for (const img of doc.querySelectorAll('main img')) {
      expect(img.getAttribute('alt')?.trim()).toBeTruthy();
      expect(img.getAttribute('src')).not.toMatch(/voice_customer|personal_picture/);
    }
  });
});

it('image counts match the media plan', () => {
  const count = (slug: string) => readHtml(`/projects/${slug}`).querySelectorAll('main picture').length;
  expect(count('osoul')).toBe(4);
  expect(count('saudi-stt')).toBe(1);
  expect(count('customer-voice')).toBe(0);
  expect(count('ai-stones')).toBe(0);
  expect(count('archio')).toBe(0);
  expect(count('finamaze-kyc')).toBe(2);
});

it('open-source case studies link their repositories and the open-source page links back', () => {
  expect(readHtml('/projects/ai-stones').querySelector('a[href="https://github.com/alouani-youssef/stones"]')).not.toBeNull();
  expect(readHtml('/projects/archio').querySelector('a[href="https://github.com/alouani-youssef/archio"]')).not.toBeNull();
  const oss = readHtml('/open-source');
  expect(oss.querySelector('#ai-stones a[href="/projects/ai-stones"]')).not.toBeNull();
  expect(oss.querySelector('#archio a[href="/projects/archio"]')).not.toBeNull();
});

it('archio presents the HA cluster and Docling semantic search as built, matching its open-source card', () => {
  const doc = readHtml('/projects/archio');
  const h3 = doc.querySelectorAll('main h3').map((h) => h.text.trim());
  expect(h3.some((h) => /^What.s next$/.test(h))).toBe(false);
  const text = doc.querySelector('main')!.text;
  expect(text).toMatch(/multi-node/i);
  expect(text).toMatch(/Docling/);
  const svg = doc.querySelector('svg[role="img"]')!.text;
  expect(svg).toMatch(/Docling/);
  expect(svg).toMatch(/Cluster/i);
});

it('marks Arabic text with lang="ar" and dir="rtl" (Review Focus 3)', () => {
  const ARABIC = /[؀-ۿ]/;
  const check = (node: Node, route: string) => {
    if (node.nodeType === 3 && ARABIC.test(node.rawText)) {
      let el = node.parentNode as HTMLElement | null;
      while (el && el.getAttribute?.('lang') !== 'ar') el = el.parentNode as HTMLElement | null;
      expect(el, `${route}: "${node.rawText.trim().slice(0, 40)}"`).not.toBeNull();
      expect(el!.getAttribute('dir')).toBe('rtl');
    }
    node.childNodes.forEach((c) => check(c, route));
  };
  for (const route of listHtmlPages()) check(readHtml(route).querySelector('body')!, route);
});
