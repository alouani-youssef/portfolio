import { describe, it, expect } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { readHtml, exists, listHtmlPages, DIST } from './helpers';

describe('search, og images and budget', () => {
  it('ships a Pagefind index', () => {
    expect(exists('pagefind/pagefind.js')).toBe(true);
  });

  it('every page has a 1200×630 PNG og:image that exists', () => {
    for (const route of listHtmlPages()) {
      const content = readHtml(route).querySelector('meta[property="og:image"]')?.getAttribute('content');
      expect(content, route).toMatch(/^https:\/\/youssefalouani\.com\/og\/.+\.png$/);
      const file = join(DIST, new URL(content!).pathname);
      const buf = readFileSync(file);
      expect(buf.subarray(1, 4).toString(), route).toBe('PNG');
      expect([buf.readUInt32BE(16), buf.readUInt32BE(20)], route).toEqual([1200, 630]);
    }
  });

  it('keeps JavaScript under 50 KB per page', () => {
    for (const route of listHtmlPages()) {
      const doc = readHtml(route);
      let bytes = 0;
      for (const s of doc.querySelectorAll('script')) {
        const src = s.getAttribute('src');
        if (s.getAttribute('type') === 'application/ld+json') continue;
        if (src) {
          if (src.startsWith('http')) continue;
          bytes += statSync(join(DIST, src)).size;
        } else bytes += Buffer.byteLength(s.text);
      }
      expect(bytes, route).toBeLessThan(51200);
    }
  });

  it('offers the command palette on every page', () => {
    for (const route of ['/', '/projects/osoul']) {
      expect(readHtml(route).querySelector('dialog#palette'), route).not.toBeNull();
    }
  });
});
