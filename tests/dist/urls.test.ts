import { describe, it, expect } from 'vitest';
import { readHtml, readText, exists, listHtmlPages } from './helpers';

const fileFor = (path: string) => (path === '/' ? 'index.html' : `${path.replace(/\/$/, '')}.html`);

describe('URLs are served without redirects (Cloudflare Pages)', () => {
  it('every sitemap URL is a canonical URL served directly from a .html file', () => {
    const sitemap = [...readText('sitemap-0.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const canonicals = new Set(listHtmlPages().map((r) => readHtml(r).querySelector('link[rel="canonical"]')!.getAttribute('href')));
    for (const url of sitemap) {
      expect(canonicals.has(url), url).toBe(true);
      const path = new URL(url).pathname;
      expect(path === '/' || !path.endsWith('/'), url).toBe(true);
      expect(exists(fileFor(path)), url).toBe(true);
    }
  });
  it('internal nav links resolve to a .html file', () => {
    for (const a of readHtml('/').querySelectorAll('header a[href^="/"]')) {
      expect(exists(fileFor(a.getAttribute('href')!)), a.getAttribute('href')).toBe(true);
    }
  });
});

describe('diagrams stay legible on phones', () => {
  it('each diagram sits in a horizontal scroller with a minimum width', () => {
    for (const slug of ['osoul', 'saudi-stt', 'customer-voice']) {
      const svg = readHtml(`/projects/${slug}`).querySelector('svg[role="img"]')!;
      expect(svg.parentNode!.classList.contains('diagram-scroll'), slug).toBe(true);
      expect(svg.getAttribute('class') ?? '', slug).toContain('min-w-[560px]');
    }
  });
});

describe('machine dates match the displayed periods', () => {
  const api = JSON.parse(readText('api/experience.json')) as Array<{ id: string; start: string; end: string | null }>;
  const resume = JSON.parse(readText('resume.json'));
  it('resume.json links the current Medium account', () => {
    expect(resume.basics.profiles.find((p: any) => p.network === 'Medium').url).toBe('https://medium.com/@alouaniyoussef');
  });
  it('resume.json carries the bachelor degree', () => {
    expect(resume.education[0]).toMatchObject({ studyType: "Bachelor's degree", area: 'Computer Science', startDate: '2017', endDate: '2021' });
  });
  it('employment periods never overlap', () => {
    const jobs = api.filter((e) => e.id !== '10xjobs').sort((a, b) => a.start.localeCompare(b.start));
    for (let i = 1; i < jobs.length; i++) expect(jobs[i - 1].end! < jobs[i].start, `${jobs[i - 1].id} overlaps ${jobs[i].id}`).toBe(true);
  });
  it('uses year precision where only years are known', () => {
    const by = Object.fromEntries(api.map((e) => [e.id, e]));
    expect([by.finamaze.start, by.finamaze.end]).toEqual(['2023-07', '2024-01']);
    expect([by.qalqul.start, by.qalqul.end]).toEqual(['2021', '2023']);
    expect([by.axelerated.start, by.axelerated.end]).toEqual(['2024-02', '2026-05']);
    expect([by.osoul.start, by.osoul.end]).toEqual(['2026-06', null]);
    const work = Object.fromEntries(resume.work.map((w: any) => [w.name, w]));
    expect([work.Finamaze.startDate, work.Finamaze.endDate]).toEqual(['2023-07', '2024-01']);
    expect(work['10xJobs'].startDate).toBe('2026-10');
  });
});
