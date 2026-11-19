import { describe, it, expect } from 'vitest';
import { profile } from '../../src/data/profile';
import { profilePageJsonLd, faqPageJsonLd, projectJsonLd, blogPostingJsonLd } from '../../src/lib/jsonld';

const SITE = 'https://youssefalouani.com';

describe('jsonld', () => {
  it('wraps the Person in a ProfilePage with all sameAs links', () => {
    const ld = profilePageJsonLd(profile, SITE) as any;
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('ProfilePage');
    expect(ld.mainEntity['@type']).toBe('Person');
    expect(ld.mainEntity.name).toBe('Youssef Alouani');
    expect(ld.mainEntity.jobTitle).toBe('Lead Backend & AI Engineer');
    expect(ld.mainEntity.knowsLanguage).toEqual(['en', 'fr', 'ar']);
    expect(ld.mainEntity.worksFor).toEqual({ '@type': 'Organization', name: 'Osoul', url: 'https://osoul.io' });
    expect(ld.mainEntity.sameAs).toEqual(expect.arrayContaining([
      'https://github.com/alouani-youssef', 'https://www.linkedin.com/in/alouani-youssef',
      'https://alouani-youssef.medium.com', 'https://medium.com/@alouaniyoussef',
    ]));
  });
  it('builds an FAQPage from the profile FAQ', () => {
    const ld = faqPageJsonLd(profile.faq) as any;
    expect(ld['@type']).toBe('FAQPage');
    expect(ld.mainEntity.map((q: any) => q.name)).toEqual(profile.faq.map((f) => f.q));
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe(profile.faq[0].a);
  });
  it('uses SoftwareSourceCode only when a repo exists', () => {
    const base = { title: 'X', summary: 'S', updatedAt: new Date('2026-11-19'), links: {} as { repo?: string } };
    expect((projectJsonLd(base, `${SITE}/projects/x`) as any)['@type']).toBe('CreativeWork');
    expect((projectJsonLd({ ...base, links: { repo: 'https://github.com/a/b' } }, `${SITE}/projects/x`) as any)['@type']).toBe('SoftwareSourceCode');
  });
  it('builds a BlogPosting with an author', () => {
    const ld = blogPostingJsonLd({ title: 'T', description: 'D', pubDate: new Date('2026-11-26') }, `${SITE}/blog/t`) as any;
    expect(ld['@type']).toBe('BlogPosting');
    expect(ld.author.name).toBe('Youssef Alouani');
    expect(ld.datePublished).toBe('2026-11-26');
  });
});
