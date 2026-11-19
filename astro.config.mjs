// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';

/** Slugs of draft posts, kept out of the sitemap in every build. */
const draftSlugs = readdirSync('src/content/blog/en')
  .filter((f) => f.endsWith('.mdx') && /^draft:\s*true\s*$/m.test(readFileSync(`src/content/blog/en/${f}`, 'utf8')))
  .map((f) => f.replace(/\.mdx$/, ''));

export default defineConfig({
  site: 'https://youssefalouani.com',
  trailingSlash: 'ignore',
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
    sitemap({
      filter: (page) => !page.includes('/404') && !draftSlugs.some((slug) => page.includes(`/blog/${slug}`)),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
