import { z } from 'astro/zod';

const item = { id: z.string(), updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), url: z.url() };

export const apiProfile = z.object({
  ...item,
  name: z.string(),
  jobTitle: z.string(),
  headline: z.string(),
  summary: z.string(),
  location: z.object({ city: z.string(), country: z.string(), timeZone: z.string() }),
  languages: z.array(z.string()),
  email: z.email(),
  links: z.record(z.string(), z.url()),
  expertise: z.array(z.object({ title: z.string(), body: z.string() })),
  clients: z.array(z.object({ group: z.string(), label: z.string(), clients: z.array(z.string()) })),
  education: z.object({ degree: z.string(), school: z.string(), start: z.number(), end: z.number() }),
});

export const apiExperience = z.array(z.object({
  ...item,
  company: z.string(),
  role: z.string(),
  period: z.string(),
  start: z.string(),
  end: z.string().nullable(),
  location: z.string(),
  founding: z.boolean(),
  teamSize: z.number().nullable(),
  summary: z.string(),
  highlights: z.array(z.string()),
  skills: z.array(z.string()),
  clients: z.array(z.string()),
}));

export const apiProjects = z.array(z.object({
  ...item,
  title: z.string(),
  summary: z.string(),
  area: z.string(),
  kind: z.string(),
  status: z.string(),
  company: z.string().nullable(),
  skills: z.array(z.string()),
  links: z.record(z.string(), z.string()),
  metrics: z.array(z.object({ label: z.string(), value: z.string(), confirmed: z.boolean() })),
  markdown: z.url(),
}));

export const apiSkills = z.array(z.object({
  ...item,
  name: z.string(),
  category: z.string(),
  level: z.enum(['daily', 'production', 'familiar']),
  evidence: z.array(z.string()),
}));

export const apiPosts = z.array(z.object({
  ...item,
  title: z.string(),
  description: z.string(),
  published: z.string(),
  tags: z.array(z.string()),
  external: z.boolean(),
}));

export const API_NAMES = ['profile', 'experience', 'projects', 'skills', 'posts'] as const;
export type ApiName = (typeof API_NAMES)[number];

export const API_SCHEMAS = {
  profile: apiProfile,
  experience: apiExperience,
  projects: apiProjects,
  skills: apiSkills,
  posts: apiPosts,
} satisfies Record<ApiName, z.ZodType>;
