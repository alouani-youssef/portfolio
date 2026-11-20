import { describe, it, expect } from 'vitest';
import { readHtml, readText, exists } from './helpers';
import { profile } from '../../src/data/profile';

const ld = (route: string) => readHtml(route).querySelectorAll('script[type="application/ld+json"]').map((s) => JSON.parse(s.text));
const types = (route: string) => ld(route).map((x) => x['@type']);

describe('seo', () => {
  it('home and about carry a ProfilePage', () => {
    expect(types('/')).toContain('ProfilePage');
    expect(types('/about')).toContain('ProfilePage');
  });
  it('about carries the FAQPage', () => {
    const faq = ld('/about').find((x) => x['@type'] === 'FAQPage');
    expect(faq.mainEntity.map((q: any) => q.name)).toEqual(profile.faq.map((f) => f.q));
  });
  it('case studies carry CreativeWork', () => {
    for (const s of ['osoul', 'saudi-stt', 'customer-voice']) expect(types(`/projects/${s}`)).toContain('CreativeWork');
  });
  it('robots.txt allows everyone and names the AI crawlers', () => {
    const robots = readText('robots.txt');
    expect(robots).toContain('Allow: /');
    for (const bot of ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended']) {
      expect(robots).toContain(`User-agent: ${bot}`);
    }
    expect(robots).toContain('Sitemap: https://www.alouaniyoussef.com/sitemap-index.xml');
  });
  it('sitemap excludes 404 and drafts', () => {
    expect(exists('sitemap-index.xml')).toBe(true);
    const map = readText('sitemap-0.xml');
    expect(map).toContain('https://www.alouaniyoussef.com/projects/osoul');
    expect(map).not.toContain('/404');
    expect(map).not.toContain('whisper-saudi-dialect');
    expect(map).not.toContain('/blog/tags/');
    expect(map).toMatch(/<loc>https:\/\/www\.alouaniyoussef\.com\/projects\/osoul<\/loc><lastmod>\d{4}-\d{2}-\d{2}T/);
  });
  it('home carries a WebSite tied to the Person', () => {
    const site = ld('/').find((x) => x['@type'] === 'WebSite');
    expect(site.url).toBe('https://www.alouaniyoussef.com/');
    expect(site.publisher['@id']).toBe('https://www.alouaniyoussef.com/#person');
  });
  it('nested pages carry a BreadcrumbList ending on the page', () => {
    for (const route of ['/projects/osoul', '/experience/osoul']) {
      const crumbs = ld(route).find((x) => x['@type'] === 'BreadcrumbList');
      expect(crumbs.itemListElement.map((i: any) => i.position)).toEqual([1, 2, 3]);
      expect(crumbs.itemListElement.at(-1).item).toBe(`https://www.alouaniyoussef.com${route}`);
    }
  });
  it('tag pages are noindex', () => {
    expect(readHtml('/blog/tags/kafka').querySelector('meta[name=robots]')?.getAttribute('content')).toBe('noindex');
  });
  it('every page names the site and locale for link previews', () => {
    const doc = readHtml('/about');
    expect(doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content')).toBe('Youssef Alouani');
    expect(doc.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe('en_US');
  });
  it('machine-readable twins are kept out of search results', () => {
    const headers = readText('_headers');
    for (const path of ['/*.md', '/api/*', '/resume.json', '/llms-full.txt']) expect(headers).toMatch(new RegExp(`^${path.replace(/[.*]/g, (c) => `\\${c}`)}\n  X-Robots-Tag: noindex`, 'm'));
  });
});
