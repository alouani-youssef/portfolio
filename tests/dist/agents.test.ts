import { describe, it, expect } from 'vitest';
import { readText, exists, listHtmlPages, readHtml } from './helpers';
import { API_SCHEMAS, API_NAMES } from '../../src/lib/api-schemas';

const json = (f: string) => JSON.parse(readText(f));

describe('/api', () => {
  it.each(API_NAMES)('%s.json validates against its schema and publishes a JSON Schema', (name) => {
    const result = API_SCHEMAS[name].safeParse(json(`api/${name}.json`));
    expect(result.success, JSON.stringify(result.error?.issues?.slice(0, 3))).toBe(true);
    expect(json(`api/schema/${name}.json`).$schema).toMatch(/json-schema\.org/);
  });
  it('has no agent-only claims: every project and role title appears on a page', () => {
    const pagesText = listHtmlPages().map((r) => readHtml(r).text).join('\n');
    for (const p of json('api/projects.json')) expect(pagesText, p.title).toContain(p.title);
    for (const e of json('api/experience.json')) expect(pagesText, e.company).toContain(e.company);
  });
});

describe('resume.json', () => {
  it('is a JSON Resume with five roles', () => {
    const r = json('resume.json');
    expect(r.basics.name).toBe('Youssef Alouani');
    expect(r.work).toHaveLength(5);
  });
});

describe('llms.txt', () => {
  const txt = readText('llms.txt');
  it('starts with the name and a summary line', () => {
    expect(txt.startsWith('# Youssef Alouani\n\n> ')).toBe(true);
  });
  it('every site URL resolves to a built file (Review Focus 5)', () => {
    const urls = [...txt.matchAll(/https:\/\/www\.alouaniyoussef\.com(\/[^)\s]*)/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThan(8);
    for (const u of urls) expect(exists(u === '/' ? 'index.html' : u), u).toBe(true);
  });
  it('llms-full.txt bundles profile, experience and case studies', () => {
    const full = readText('llms-full.txt');
    for (const s of ['# Youssef Alouani', 'Axelerated Solutions', 'Customer Voice', 'Osoul platform']) expect(full).toContain(s);
    expect(full).not.toContain('CHECK');
  });
});

describe('drafts never reach agent outputs (Review Focus 4)', () => {
  it.each(['llms.txt', 'llms-full.txt', 'api/posts.json', 'rss.xml', 'sitemap-0.xml'])('%s', (f) => {
    expect(readText(f)).not.toContain('whisper-saudi-dialect');
  });
});
