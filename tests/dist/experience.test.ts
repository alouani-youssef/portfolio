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

  it('timeline shows the education line', () => {
    expect(text('/experience')).toContain("Diplôme d'Ingénieur d'État in Computer Science, Hassan First University, FST Settat, 2019–2022");
  });

  for (const [slug, company] of ROLES) {
    it(`/experience/${slug} follows the role template`, () => {
      const doc = readHtml(`/experience/${slug}`);
      const h1 = doc.querySelectorAll('h1');
      expect(h1).toHaveLength(1);
      expect(h1[0].text).toContain(company);
      expect(doc.querySelectorAll('main h2').map((h) => h.text.trim())).toEqual([
        'Context', 'My part', 'Stack', 'Outcome', "What I'd do differently",
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
