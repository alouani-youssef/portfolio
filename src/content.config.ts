import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';
import { resolveIcon, SKILL_CATEGORIES, type Category } from './lib/skill-icons';
import { TAG_IDS } from './lib/tags';
import { FOCUS_IDS } from './lib/focus';

const skills = defineCollection({
  loader: file('src/data/skills.yaml'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    category: z.enum(SKILL_CATEGORIES.map((c) => c.id) as [Category, ...Category[]]),
    level: z.enum(['expert', 'production', 'familiar']),
    evidence: z.array(z.string()).default([]),
    icon: z.string().refine((ref) => { try { resolveIcon(ref); return true; } catch { return false; } }, { message: 'Unknown skill icon (use si:<slug> or lucide:<name>)' }),
    core: z.number().int().positive().optional(),
  }),
});

const clients = defineCollection({
  loader: file('src/data/clients.yaml'),
  schema: ({ image }) => z.object({
    id: z.string(),
    name: z.string(),
    group: z.enum(['government', 'banks-insurers', 'groups', 'growth']),
    order: z.number(),
    experience: reference('experience'),
    market: z.string(),
    /** Official website, confirmed by hand. Omitted when there is no trustworthy site. */
    url: z.url().optional(),
    logo: image().optional(),
    /** Tile behind the logo: `dark` for logos that are published only in white. */
    logoBg: z.enum(['light', 'dark']).default('light'),
  }),
});

const recommendations = defineCollection({
  loader: file('src/data/recommendations.yaml'),
  schema: z.object({
    id: z.string(),
    author: z.string(),
    title: z.string(),
    relationship: z.string(),
    /** Who they were to me; drives the badge on the card. */
    kind: z.enum(['manager', 'peer', 'report', 'client']),
    /** The role we worked together in; links the card to that role. Omit when unsure. */
    experience: reference('experience').optional(),
    date: z.coerce.date(),
    quote: z.string(),
    /** Exact phrase from the quote to emphasise. */
    highlight: z.string().optional(),
    url: z.url(),
  }).refine((r) => !r.highlight || r.quote.includes(r.highlight), { message: 'highlight must be an exact phrase from the quote', path: ['highlight'] }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*/*.mdx', base: 'src/content/experience' }),
  schema: ({ image }) =>
    z.object({
      company: z.string(),
      alias: z.string().optional(),
      role: z.string(),
      founding: z.boolean().default(false),
      /** Shown as a side project, not a job: its own lane on the timeline. */
      sideProject: z.boolean().default(false),
      logo: image(),
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
      /** Focus areas of a top-level case study, main one first; they drive the /projects filter. Deep dives set `parent` instead. */
      focus: z.array(z.enum(FOCUS_IDS)).min(1).optional(),
      parent: reference('projects').optional(),
      status: z.enum(['live', 'shipped', 'in-progress', 'archived']),
      featured: z.boolean().default(false),
      confidentiality: z.enum(['public', 'architecture-only', 'private']).default('public'),
      skills: z.array(reference('skills')),
      links: z.object({ repo: z.url(), demo: z.url(), post: z.string() }).partial().default({}),
      metrics: z.array(z.object({ label: z.string(), value: z.string(), placeholder: z.boolean().default(true) })).default([]),
      media: z.array(z.object({ src: image(), alt: z.string().min(1), caption: z.string(), device: z.enum(['desktop', 'phone']).default('desktop') })).default([]),
      /** Card and header image, unique per project. */
      cover: image(),
      coverAlt: z.string().min(1),
      order: z.number(),
      updatedAt: z.coerce.date(),
    }).refine((p) => !p.focus !== !p.parent, { message: 'a case study needs exactly one of `focus` (top level) or `parent` (deep dive)', path: ['focus'] }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*/*.mdx', base: 'src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Ids from src/lib/tags.ts; the first one sets the generated cover's colour and icon. */
    tags: z.array(z.enum(TAG_IDS)).min(1),
    /** Optional real cover; without one, the post gets a generated cover from its tags. */
    cover: z.object({ src: image(), alt: z.string().min(1) }).optional(),
    external: z.object({ platform: z.enum(['medium', 'devto', 'hashnode']), url: z.url() }).optional(),
    canonical: z.url().optional(),
    related: z.array(reference('projects')).default([]),
    draft: z.boolean().default(false),
    /** Public Medium counts, copied by hand on `asOf`; they order the blog by popularity. */
    stats: z.object({ claps: z.number().int().nonnegative(), comments: z.number().int().nonnegative(), asOf: z.coerce.date() }).optional(),
  }),
});

const oss = defineCollection({
  loader: file('src/data/oss.yaml'),
  schema: ({ image }) => z.object({
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
    logo: image(),
    /** Illustrations shown above the architecture diagram. */
    media: z.array(z.object({ src: image(), alt: z.string().min(1) })).default([]),
    /** Shown as a badge; only set when the project runs in production. */
    status: z.literal('Used in production').optional(),
  }),
});

export const collections = { skills, clients, recommendations, experience, projects, blog, oss };
