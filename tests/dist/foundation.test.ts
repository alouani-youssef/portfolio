import { describe, it, expect } from 'vitest';
import { readHtml, listHtmlPages } from './helpers';

describe('foundation', () => {
  it('home has exactly one h1 and lang=en', () => {
    const doc = readHtml('/');
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('html')!.getAttribute('lang')).toBe('en');
  });

  it('theme script runs before any stylesheet to avoid a flash', () => {
    const head = readHtml('/').querySelector('head')!.innerHTML;
    expect(head.indexOf('data-theme')).toBeGreaterThan(-1);
    expect(head.indexOf('data-theme')).toBeLessThan(head.indexOf('rel="stylesheet"'));
  });

  it('every page has a canonical URL on youssefalouani.com', () => {
    for (const route of listHtmlPages()) {
      const href = readHtml(route).querySelector('link[rel="canonical"]')?.getAttribute('href');
      expect(href, route).toMatch(/^https:\/\/youssefalouani\.com\//);
    }
  });

  it('declares en and x-default hreflang alternates', () => {
    const doc = readHtml('/');
    expect(doc.querySelector('link[rel="alternate"][hreflang="en"]')).not.toBeNull();
    expect(doc.querySelector('link[rel="alternate"][hreflang="x-default"]')).not.toBeNull();
  });
});
