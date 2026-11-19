import type { Profile } from '../data/profile';

interface RoleIn { company: string; role: string; url?: string; start: Date; end: Date | null; precision?: 'month' | 'year'; summary: string; highlights: string[] }

/** ISO 8601 date truncated to what is actually known: '2023' or '2026-06'. */
export function partialDate(d: Date, precision: 'month' | 'year' = 'year'): string {
  return d.toISOString().slice(0, precision === 'month' ? 7 : 4);
}

/** JSON Resume v1.0.0 document. */
export function buildResume(
  profile: Profile,
  roles: RoleIn[],
  skills: Array<{ name: string; category: string }>,
  recommendations: Array<{ author: string; quote: string }>,
  oss: Array<{ name: string; pitch: string; languages: string[]; repos: Array<{ url: string }> }> = [],
): object {
  const categories = [...new Set(skills.map((s) => s.category))];
  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: profile.name,
      label: profile.jobTitle,
      email: profile.email,
      url: 'https://youssefalouani.com',
      summary: profile.shortBio,
      location: { city: profile.location.city, countryCode: profile.location.country },
      profiles: [
        { network: 'GitHub', username: 'alouani-youssef', url: profile.links.github },
        { network: 'LinkedIn', username: 'alouani-youssef', url: profile.links.linkedin },
        { network: 'Medium', url: profile.links.mediumA },
      ],
    },
    work: roles.map((r) => ({
      name: r.company,
      position: r.role,
      ...(r.url ? { url: r.url } : {}),
      startDate: partialDate(r.start, r.precision),
      ...(r.end ? { endDate: partialDate(r.end, r.precision) } : {}),
      summary: r.summary,
      highlights: r.highlights,
    })),
    education: [{
      institution: profile.education.school,
      area: 'Computer Science',
      studyType: "Diplôme d'Ingénieur d'État",
      startDate: String(profile.education.start),
      endDate: String(profile.education.end),
    }],
    skills: categories.map((c) => ({ name: c, keywords: skills.filter((s) => s.category === c).map((s) => s.name) })),
    languages: profile.languages.map((l) => ({ language: l.name })),
    references: recommendations.map((r) => ({ name: r.author, reference: r.quote })),
    ...(oss.length ? { projects: oss.map((o) => ({ name: o.name, description: o.pitch, url: o.repos[0].url, keywords: o.languages })) } : {}),
  };
}
