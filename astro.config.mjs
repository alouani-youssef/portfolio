// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { dedupeSvgs } from './src/lib/svg-sprite.ts';

/** Slugs of draft posts, kept out of the sitemap in every build. */
const draftSlugs = readdirSync('src/content/blog/en')
  .filter((f) => f.endsWith('.mdx') && /^draft:\s*true\s*$/m.test(readFileSync(`src/content/blog/en/${f}`, 'utf8')))
  .map((f) => f.replace(/\.mdx$/, ''));

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
  site: 'https://youssefalouani.com',
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
      filter: (page) => !page.includes('/404') && !draftSlugs.some((slug) => page.includes(`/blog/${slug}`)),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
