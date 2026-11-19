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
    expect(robots).toContain('Sitemap: https://youssefalouani.com/sitemap-index.xml');
  });
  it('sitemap excludes 404 and drafts', () => {
    expect(exists('sitemap-index.xml')).toBe(true);
    const map = readText('sitemap-0.xml');
    expect(map).toContain('https://youssefalouani.com/projects/osoul');
    expect(map).not.toContain('/404');
    expect(map).not.toContain('whisper-saudi-dialect');
  });
});
