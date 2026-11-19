import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';
import { resolveIcon, SKILL_CATEGORIES, type Category } from './lib/skill-icons';

const skills = defineCollection({
  loader: file('src/data/skills.yaml'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    category: z.enum(SKILL_CATEGORIES.map((c) => c.id) as [Category, ...Category[]]),
    level: z.enum(['daily', 'production', 'familiar']),
    evidence: z.array(z.string()).default([]),
    icon: z.string().refine((ref) => { try { resolveIcon(ref); return true; } catch { return false; } }, { message: 'Unknown skill icon (use si:<slug> or lucide:<name>)' }),
    core: z.boolean().default(false),
  }),
});

const clients = defineCollection({
  loader: file('src/data/clients.yaml'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    group: z.enum(['government', 'banks-insurers', 'groups', 'growth']),
    order: z.number(),
    experience: reference('experience'),
    market: z.string(),
  }),
});

const recommendations = defineCollection({
  loader: file('src/data/recommendations.yaml'),
  schema: z.object({
    id: z.string(),
    author: z.string(),
    title: z.string(),
    relationship: z.string(),
    date: z.coerce.date(),
    quote: z.string(),
    url: z.url(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*/*.mdx', base: 'src/content/experience' }),
  schema: ({ image }) =>
    z.object({
      company: z.string(),
      alias: z.string().optional(),
      role: z.string(),
      founding: z.boolean().default(false),
      teamSize: z.number().optional(),
      start: z.coerce.date(),
      end: z.coerce.date().nullable(),
      period: z.string(),
      /** How precisely start/end are known; machine outputs never claim more. */
      precision: z.enum(['month', 'year']).default('year'),
      location: z.string(),
      url: z.url().optional(),
      summary: z.string().max(200),
      highlights: z.array(z.string()).max(6),
      outcome: z.string(),
      differently: z.string(),
      skills: z.array(reference('skills')),
      media: z.array(z.object({ src: image(), alt: z.string().min(1), caption: z.string(), device: z.enum(['desktop', 'phone']).default('desktop') })).default([]),
      updatedAt: z.coerce.date(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*/*.mdx', base: 'src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(200),
      area: z.enum(['backend', 'ai', 'platform', 'frontend']),
      kind: z.enum(['founder', 'employer', 'open-source', 'side']),
      company: reference('experience').optional(),
      parent: reference('projects').optional(),
      status: z.enum(['live', 'shipped', 'in-progress', 'archived']),
      featured: z.boolean().default(false),
      confidentiality: z.enum(['public', 'architecture-only', 'private']).default('public'),
      skills: z.array(reference('skills')),
      links: z.object({ repo: z.url(), demo: z.url(), post: z.string() }).partial().default({}),
      metrics: z.array(z.object({ label: z.string(), value: z.string(), placeholder: z.boolean().default(true) })).default([]),
      media: z.array(z.object({ src: image(), alt: z.string().min(1), caption: z.string(), device: z.enum(['desktop', 'phone']).default('desktop') })).default([]),
      cover: image().optional(),
      order: z.number(),
      updatedAt: z.coerce.date(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*/*.mdx', base: 'src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()),
    external: z.object({ platform: z.enum(['medium', 'devto', 'hashnode']), url: z.url() }).optional(),
    canonical: z.url().optional(),
    related: z.array(reference('projects')).default([]),
    draft: z.boolean().default(false),
  }),
});

const oss = defineCollection({
  loader: file('src/data/oss.yaml'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    order: z.number(),
    pitch: z.string().max(160),
    languages: z.array(z.string()).min(1),
    license: z.enum(['MIT', 'Apache-2.0']),
    repos: z.array(z.object({ label: z.string(), url: z.url() })).min(1),
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    highlights: z.array(z.string()).min(2).max(4),
    related: reference('projects').optional(),
  }),
});

export const collections = { skills, clients, recommendations, experience, projects, blog, oss };
