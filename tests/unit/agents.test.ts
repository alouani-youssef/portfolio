import { describe, it, expect } from 'vitest';
import { profile } from '../../src/data/profile';
import { buildResume } from '../../src/lib/resume';
import { buildLlmsTxt } from '../../src/lib/llms';
import { API_SCHEMAS } from '../../src/lib/api-schemas';
import { ossJsonLd } from '../../src/lib/jsonld';

const OSS = [{ id: 'ai-stones', name: 'AI Stones', pitch: 'CLI.', languages: ['JavaScript'], license: 'MIT' as const, repos: [{ label: 'GitHub', url: 'https://github.com/alouani-youssef/stones' }], links: [], highlights: ['a', 'b'] }];

const roles = [
  { slug: 'osoul', company: 'Osoul', role: 'Technical Founder', url: 'https://osoul.io', start: new Date('2026-06-01'), end: null, precision: 'month' as const, summary: 'RaaS.', highlights: ['NFC/QR ordering'] },
  { slug: 'qalqul', company: 'Qalqul Engine', role: 'Software Engineer', start: new Date('2021-01-01'), end: new Date('2022-12-31'), summary: 'Bots.', highlights: [] },
];

describe('buildResume', () => {
  const r = buildResume(profile, roles, [{ name: 'Go', category: 'language' }], [{ author: 'A', quote: 'Q' }]) as any;
  it('follows JSON Resume basics', () => {
    expect(r.$schema).toBe('https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json');
    expect(r.basics.name).toBe('Youssef Alouani');
    expect(r.basics.email).toBe('hello@alouaniyoussef.com');
    expect(r.basics.location).toEqual({ city: 'Casablanca', countryCode: 'MA' });
    expect(r.basics.profiles.map((p: any) => p.network)).toEqual(expect.arrayContaining(['GitHub', 'LinkedIn']));
  });
  it('maps roles to work with ISO dates and no end for current roles', () => {
    expect(r.work[0]).toMatchObject({ name: 'Osoul', position: 'Technical Founder', startDate: '2026-06', url: 'https://osoul.io' });
    expect(r.work[0].endDate).toBeUndefined();
    expect(r.work[1].endDate).toBe('2022');
  });
  it('lists open-source work as projects', () => {
    const withOss = buildResume(profile, roles, [], [], OSS) as any;
    expect(withOss.projects).toEqual([{ name: 'AI Stones', description: 'CLI.', url: 'https://github.com/alouani-youssef/stones', keywords: ['JavaScript'] }]);
  });
  it('includes skills, languages and references, and no education', () => {
    expect(r.education).toBeUndefined();
    expect(r.skills[0]).toEqual({ name: 'language', keywords: ['Go'] });
    expect(r.languages.map((l: any) => l.language)).toEqual(['English', 'French', 'Arabic']);
    expect(r.references[0]).toEqual({ name: 'A', reference: 'Q' });
  });
});

describe('buildLlmsTxt', () => {
  const txt = buildLlmsTxt({
    profile,
    site: 'https://www.alouaniyoussef.com',
    roles: [{ slug: 'osoul', company: 'Osoul' }],
    projects: [{ slug: 'osoul', title: 'Osoul platform', summary: 'S' }],
    posts: [{ slug: 'p', title: 'P', external: undefined }],
    oss: [{ id: 'ai-stones', name: 'AI Stones', pitch: 'CLI.' }],
  });
  it('has the llms.txt structure', () => {
    expect(txt.startsWith('# Youssef Alouani\n\n> ')).toBe(true);
    for (const h of ['## Profile', '## Projects', '## Writing', '## Optional']) expect(txt).toContain(h);
    expect(txt).toContain('[Osoul platform](https://www.alouaniyoussef.com/projects/osoul.md)');
    expect(txt).toContain('(https://www.alouaniyoussef.com/llms-full.txt)');
    expect(txt).toContain('(https://www.alouaniyoussef.com/resume.json)');
    expect(txt).toContain('## Open source\n- [AI Stones](https://www.alouaniyoussef.com/open-source.md): CLI.');
  });
});

describe('API schemas', () => {
  it('cover the five collections', () => {
    expect(Object.keys(API_SCHEMAS).sort()).toEqual(['experience', 'oss', 'posts', 'profile', 'projects', 'skills']);
  });
  it('require a licence on open-source items', () => {
    expect(API_SCHEMAS.oss.safeParse([{ id: 'x', updatedAt: '2026-11-19', url: 'https://www.alouaniyoussef.com/open-source#x', name: 'X', pitch: 'p', languages: ['Go'], repos: [], links: [], highlights: [] }]).success).toBe(false);
  });
  it('reject items without id, updatedAt or url', () => {
    expect(API_SCHEMAS.skills.safeParse([{ name: 'Go' }]).success).toBe(false);
  });
});

describe('ossJsonLd', () => {
  it('describes a repo as SoftwareSourceCode with an SPDX licence URL', () => {
    const ld = ossJsonLd(OSS[0]) as any;
    expect(ld['@type']).toBe('SoftwareSourceCode');
    expect(ld.codeRepository).toBe('https://github.com/alouani-youssef/stones');
    expect(ld.license).toBe('https://spdx.org/licenses/MIT.html');
    expect(ld.programmingLanguage).toEqual(['JavaScript']);
  });
});
