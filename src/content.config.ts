import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

const skills = defineCollection({
  loader: file('src/data/skills.yaml'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    category: z.enum(['language', 'backend', 'data', 'ai', 'security', 'infra', 'frontend', 'realtime']),
    level: z.enum(['daily', 'production', 'familiar']),
    evidence: z.array(z.string()).default([]),
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
    url: z.string().url(),
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
      location: z.string(),
      url: z.string().url().optional(),
      summary: z.string().max(200),
      highlights: z.array(z.string()).max(6),
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
      links: z.object({ repo: z.string().url(), demo: z.string().url(), post: z.string() }).partial().default({}),
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
    external: z.object({ platform: z.enum(['medium', 'devto', 'hashnode']), url: z.string().url() }).optional(),
    canonical: z.string().url().optional(),
    related: z.array(reference('projects')).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { skills, clients, recommendations, experience, projects, blog };
