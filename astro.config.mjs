// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { dedupeSvgs } from './src/lib/svg-sprite.ts';
import { SITE } from './src/data/site.ts';

/** Slugs of draft posts, kept out of the sitemap in every build. */
const draftSlugs = readdirSync('src/content/blog/en')
  .filter((f) => f.endsWith('.mdx') && /^draft:\s*true\s*$/m.test(readFileSync(`src/content/blog/en/${f}`, 'utf8')))
  .map((f) => f.replace(/\.mdx$/, ''));

/** '/projects/osoul' → its `updatedAt` (or a post's `updatedDate`/`pubDate`), for the sitemap's <lastmod>. */
const lastmod = new Map();
/** @type {Array<[string, string[]]>} */
const datedSections = [['projects', ['updatedAt']], ['experience', ['updatedAt']], ['blog', ['updatedDate', 'pubDate']]];
for (const [section, keys] of datedSections) {
  for (const f of readdirSync(`src/content/${section}/en`).filter((f) => f.endsWith('.mdx'))) {
    const fm = readFileSync(`src/content/${section}/en/${f}`, 'utf8');
    const date = keys.map((k) => fm.match(new RegExp(`^${k}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, 'm'))?.[1]).find(Boolean);
    if (date) lastmod.set(`/${section}/${f.replace(/\.mdx$/, '')}`, new Date(date).toISOString());
  }
}

/**
 * After the build, each page draws a repeated SVG icon once and reuses it with <use>.
 * @type {import('astro').AstroIntegration}
 */
const svgSprites = {
  name: 'svg-sprites',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const root = fileURLToPath(dir);
      for (const rel of readdirSync(root, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.html'))) {
        const file = join(root, rel);
        const html = readFileSync(file, 'utf8');
        const out = dedupeSvgs(html);
        if (out !== html) writeFileSync(file, out);
      }
    },
  },
};

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',

  // /about is served from about.html: no trailing-slash redirects on Cloudflare Pages.
  build: { format: 'file' },

  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],

  integrations: [
    mdx(),
    svgSprites,
    sitemap({
      // Tag pages are thin lists of links and carry noindex, so they stay out too.
      filter: (page) => !page.includes('/404') && !page.includes('/blog/tags/') && !draftSlugs.some((slug) => page.includes(`/blog/${slug}`)),
      serialize: (item) => {
        const date = lastmod.get(new URL(item.url).pathname);
        return date ? { ...item, lastmod: date } : item;
      },
    }),
  ],

  vite: { plugins: [tailwindcss()] },
});
