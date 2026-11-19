import { describe, it, expect } from 'vitest';
import { profile } from '../../src/data/profile';
import { buildResume } from '../../src/lib/resume';
import { buildLlmsTxt } from '../../src/lib/llms';
import { API_SCHEMAS } from '../../src/lib/api-schemas';

const roles = [
  { slug: 'osoul', company: 'Osoul', role: 'Technical Founder', url: 'https://osoul.io', start: new Date('2026-06-01'), end: null, summary: 'RaaS.', highlights: ['NFC/QR ordering'] },
  { slug: 'qalqul', company: 'Qalqul Engine', role: 'Software Engineer', start: new Date('2021-01-01'), end: new Date('2022-12-31'), summary: 'Bots.', highlights: [] },
];

describe('buildResume', () => {
  const r = buildResume(profile, roles, [{ name: 'Go', category: 'language' }], [{ author: 'A', quote: 'Q' }]) as any;
  it('follows JSON Resume basics', () => {
    expect(r.$schema).toBe('https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json');
    expect(r.basics.name).toBe('Youssef Alouani');
    expect(r.basics.email).toBe('hello@youssefalouani.com');
    expect(r.basics.location).toEqual({ city: 'Casablanca', countryCode: 'MA' });
    expect(r.basics.profiles.map((p: any) => p.network)).toEqual(expect.arrayContaining(['GitHub', 'LinkedIn']));
  });
  it('maps roles to work with ISO dates and no end for current roles', () => {
    expect(r.work[0]).toMatchObject({ name: 'Osoul', position: 'Technical Founder', startDate: '2026-06-01', url: 'https://osoul.io' });
    expect(r.work[0].endDate).toBeUndefined();
    expect(r.work[1].endDate).toBe('2022-12-31');
  });
  it('includes education, skills, languages and references', () => {
    expect(r.education[0].institution).toBe('Hassan First University, FST Settat');
    expect(r.skills[0]).toEqual({ name: 'language', keywords: ['Go'] });
    expect(r.languages.map((l: any) => l.language)).toEqual(['English', 'French', 'Arabic']);
    expect(r.references[0]).toEqual({ name: 'A', reference: 'Q' });
  });
});

describe('buildLlmsTxt', () => {
  const txt = buildLlmsTxt({
    profile,
    site: 'https://youssefalouani.com',
    roles: [{ slug: 'osoul', company: 'Osoul' }],
    projects: [{ slug: 'osoul', title: 'Osoul platform', summary: 'S' }],
    posts: [{ slug: 'p', title: 'P', external: undefined }],
  });
  it('has the llms.txt structure', () => {
    expect(txt.startsWith('# Youssef Alouani\n\n> ')).toBe(true);
    for (const h of ['## Profile', '## Projects', '## Writing', '## Optional']) expect(txt).toContain(h);
    expect(txt).toContain('[Osoul platform](https://youssefalouani.com/projects/osoul.md)');
    expect(txt).toContain('(https://youssefalouani.com/llms-full.txt)');
    expect(txt).toContain('(https://youssefalouani.com/resume.json)');
  });
});

describe('API schemas', () => {
  it('cover the five collections', () => {
    expect(Object.keys(API_SCHEMAS).sort()).toEqual(['experience', 'posts', 'profile', 'projects', 'skills']);
  });
  it('reject items without id, updatedAt or url', () => {
    expect(API_SCHEMAS.skills.safeParse([{ name: 'Go' }]).success).toBe(false);
  });
});
