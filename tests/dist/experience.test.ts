import { describe, it, expect } from 'vitest';
import { readHtml, listHtmlPages } from './helpers';

const ROLES = [
  ['10xjobs', '10xJobs'],
  ['osoul', 'Osoul'],
  ['axelerated', 'Axelerated Solutions'],
  ['finamaze', 'Finamaze'],
  ['qalqul', 'Qalqul Engine'],
] as const;

const text = (route: string) => readHtml(route).querySelector('main')!.text;

describe('experience', () => {
  it('timeline lists the five roles newest first', () => {
    const links = readHtml('/experience')
      .querySelectorAll('main a[href^="/experience/"]')
      .map((a) => a.getAttribute('href'));
    const unique = [...new Set(links)];
    expect(unique).toEqual(ROLES.map(([slug]) => `/experience/${slug}`));
  });

  it('timeline uses each company logo as its dot', () => {
    const items = readHtml('/experience').querySelectorAll('.timeline-item');
    expect(items).toHaveLength(ROLES.length);
    for (const [i, li] of items.entries()) {
      const logo = li.querySelector('.timeline-logo img');
      expect(logo, ROLES[i][0]).not.toBeNull();
      expect(logo!.getAttribute('alt')).toBe(`${ROLES[i][1]} logo`);
    }
  });

  it('marks 10xJobs, and only 10xJobs, as a side project', () => {
    const items = readHtml('/experience').querySelectorAll('.timeline-item');
    const side = items.filter((li) => li.classList.contains('timeline-item--side'));
    expect(side).toHaveLength(1);
    expect(side[0].querySelector('a[href="/experience/10xjobs"]')).not.toBeNull();
    expect(side[0].text).toContain('Side project');
  });

  it('puts year markers on the line, newest first', () => {
    const years = readHtml('/experience').querySelectorAll('.timeline-year').map((y) => y.text.trim());
    expect(years).toEqual(['2026', '2024', '2023', '2021']);
  });

  it('describes four roles and a side project', () => {
    expect(text('/experience')).toContain('Four roles and a side project over five years');
  });

  it('timeline shows the education line', () => {
    expect(text('/experience')).toContain("Bachelor's degree in Computer Science, Hassan First University, FST Settat, 2017–2021");
  });

  for (const [slug, company] of ROLES) {
    it(`/experience/${slug} follows the role template`, () => {
      const doc = readHtml(`/experience/${slug}`);
      const h1 = doc.querySelectorAll('h1');
      expect(h1).toHaveLength(1);
      expect(h1[0].text).toContain(company);
      expect(doc.querySelector(`main header img[alt="${company} logo"]`), slug).not.toBeNull();
      expect(doc.querySelector('main header')!.text.includes('Side project'), slug).toBe(slug === '10xjobs');
      expect(doc.querySelectorAll('main h2').map((h) => h.text.trim())).toEqual([
        'Context', 'My part', 'Stack', 'Outcome', "What I'd do differently",
        `Projects at ${company}`,
      ]);
    });
  }

  it('axelerated lists the migrations and deployments', () => {
    const t = text('/experience/axelerated');
    expect(t).toContain('Migrations and deployments');
    for (const s of ['B2C to B2B', 'stateful to stateless', 'Docker Compose to Kubernetes', 'Hetzner to Oracle Cloud', 'Hybrid deployments for private, banking and government institutions']) {
      expect(t).toContain(s);
    }
  });

  for (const [slug] of ROLES) {
    it(`/experience/${slug} shows its screenshots`, () => {
      const imgs = readHtml(`/experience/${slug}`).querySelectorAll('main section[aria-label="Screenshots"] img');
      expect(imgs.length, slug).toBeGreaterThan(0);
    });
  }

  it('lists King Saud Medical City under Axelerated (Sowtek), not Qalqul', () => {
    const tiles = (slug: string) => readHtml(`/experience/${slug}`).querySelectorAll('.client-tile').map((t) => t.text);
    expect(tiles('axelerated').some((t) => t.includes('King Saud Medical City'))).toBe(true);
    expect(tiles('qalqul').some((t) => t.includes('King Saud Medical City'))).toBe(false);
  });

  it('osoul names its clients by parent group', () => {
    const t = text('/experience/osoul');
    expect(t).toContain('Barceló Group');
    expect(t).toContain('Atlas Group');
  });

  it('every experience image has alt text', () => {
    for (const route of listHtmlPages().filter((r) => r.startsWith('/experience'))) {
      for (const img of readHtml(route).querySelectorAll('img')) {
        expect(img.getAttribute('alt')?.trim(), `${route} ${img.getAttribute('src')}`).toBeTruthy();
      }
    }
  });
});
