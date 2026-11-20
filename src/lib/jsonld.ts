import type { Profile } from '../data/profile';
import { SITE } from '../data/site';

const CTX = 'https://schema.org';

export function personJsonLd(profile: Profile, site: string): object {
  return {
    '@type': 'Person',
    '@id': `${site}/#person`,
    name: profile.name,
    url: site,
    image: `${site}/og/index.png`,
    email: `mailto:${profile.email}`,
    jobTitle: profile.jobTitle,
    description: profile.oneLiner,
    knowsLanguage: profile.languages.map((l) => l.code),
    address: { '@type': 'PostalAddress', addressLocality: profile.location.city, addressCountry: profile.location.country },
    worksFor: { '@type': 'Organization', name: 'Osoul', url: profile.links.osoul },
    knowsAbout: profile.knowsAbout,
    sameAs: profile.sameAs,
  };
}

export function profilePageJsonLd(profile: Profile, site: string): object {
  return { '@context': CTX, '@type': 'ProfilePage', url: site, mainEntity: personJsonLd(profile, site) };
}

export function webSiteJsonLd(profile: Profile, site: string): object {
  return { '@context': CTX, '@type': 'WebSite', '@id': `${site}/#website`, url: `${site}/`, name: profile.name, inLanguage: 'en', publisher: { '@id': `${site}/#person` } };
}

const SECTIONS: Record<string, string> = { projects: 'Projects', experience: 'Experience', blog: 'Blog' };

/** Home › Section › Page for pages nested under a listed section; null elsewhere. */
export function breadcrumbJsonLd(path: string, title: string, site: string): object | null {
  const [section, ...rest] = path.split('/').filter(Boolean);
  if (!SECTIONS[section] || rest.length !== 1) return null;
  const items = [
    { name: 'Home', item: `${site}/` },
    { name: SECTIONS[section], item: `${site}/${section}` },
    { name: title, item: `${site}${path}` },
  ];
  return { '@context': CTX, '@type': 'BreadcrumbList', itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, ...x })) };
}

export function faqPageJsonLd(faq: Array<{ q: string; a: string }>): object {
  return {
    '@context': CTX,
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

const author = { '@type': 'Person', name: 'Youssef Alouani', url: SITE };

export function projectJsonLd(
  project: { title: string; summary: string; updatedAt: Date; links: { repo?: string } },
  url: string,
): object {
  return {
    '@context': CTX,
    '@type': project.links.repo ? 'SoftwareSourceCode' : 'CreativeWork',
    name: project.title,
    description: project.summary,
    url,
    dateModified: project.updatedAt.toISOString().slice(0, 10),
    author,
    ...(project.links.repo ? { codeRepository: project.links.repo } : {}),
  };
}

export function blogPostingJsonLd(post: { title: string; description: string; pubDate: Date; updatedDate?: Date; tags?: readonly string[]; draft?: boolean }, url: string): object {
  return {
    '@context': CTX,
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    image: `${url.replace('/blog/', '/og/blog/')}.png`,
    // A draft has no publication date yet: its pubDate is only a plan.
    ...(post.draft ? {} : { datePublished: post.pubDate.toISOString().slice(0, 10), dateModified: (post.updatedDate ?? post.pubDate).toISOString().slice(0, 10) }),
    ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
    author,
  };
}

export function ossJsonLd(entry: { name: string; pitch: string; languages: string[]; license: string; repos: Array<{ url: string }> }): object {
  return {
    '@context': CTX,
    '@type': 'SoftwareSourceCode',
    name: entry.name,
    description: entry.pitch,
    codeRepository: entry.repos[0].url,
    programmingLanguage: entry.languages,
    license: `https://spdx.org/licenses/${entry.license}.html`,
    author,
  };
}
