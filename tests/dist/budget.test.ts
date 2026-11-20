import { describe, it, expect } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
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

  it('keeps every og image a palette PNG under 35 KB', () => {
    for (const route of listHtmlPages()) {
      const content = readHtml(route).querySelector('meta[property="og:image"]')!.getAttribute('content')!;
      const buf = readFileSync(join(DIST, new URL(content).pathname));
      expect(buf.length, route).toBeLessThan(35 * 1024);
      expect(buf[25], `${route}: colour type`).toBe(3); // PNG colour type 3 = indexed palette
    }
  });

  it('draws each repeated SVG icon once per page', () => {
    for (const route of listHtmlPages()) {
      const html = readFileSync(join(DIST, route === '/' ? 'index.html' : `${route.slice(1)}.html`), 'utf8');
      const seen = new Map<string, number>();
      for (const m of html.matchAll(/<svg\b[^>]*>([\s\S]*?)<\/svg>/g)) {
        const inner = m[1].replace(/ data-astro-cid-[a-z0-9]+(="[^"]*")?/g, '');
        if (inner.length < 200 || inner.includes('<use') || /\sid="/.test(inner)) continue;
        seen.set(inner, (seen.get(inner) ?? 0) + 1);
      }
      const dupes = [...seen.values()].filter((n) => n > 1).length;
      expect(dupes, route).toBe(0);
    }
  });

  it('keeps the blog index under 14 KB on the wire (gzip)', () => {
    expect(gzipSync(readFileSync(join(DIST, 'blog.html')), { level: 9 }).length).toBeLessThan(14 * 1024);
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
