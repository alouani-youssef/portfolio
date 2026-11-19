import { describe, it, expect } from 'vitest';
import { readHtml, readText } from './helpers';

const DRAFTS = ['whisper-saudi-dialect', 'virtualization-part-2', 'architecture-styles-2026'] as const;
const ORIGINALS: Record<string, string> = {
  'virtualization-part-2': 'https://alouaniyoussef.medium.com/the-philosophy-behind-virtualization-and-containerization-c13866d74ed5',
  'architecture-styles-2026': 'https://alouani-youssef.medium.com/a-vision-about-software-architcture-styles-3ec0666b692c',
};

describe.each(DRAFTS)('draft %s', (slug) => {
  it('renders in preview with noindex, one h1 and a diagram', () => {
    const doc = readHtml(`/blog/${slug}`);
    expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex');
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('svg[role="img"] title')?.text.trim()).toBeTruthy();
  });
  it('stays out of every feed and agent output', () => {
    for (const f of ['rss.xml', 'llms.txt', 'llms-full.txt', 'api/posts.json', 'sitemap-0.xml', 'blog.md']) {
      expect(readText(f), f).not.toContain(slug);
    }
  });
});

describe('rewrites link their originals', () => {
  for (const [slug, url] of Object.entries(ORIGINALS)) {
    it(slug, () => expect(readHtml(`/blog/${slug}`).querySelector(`main a[href="${url}"]`)).not.toBeNull());
  }
  it('the 2026 edition links the Osoul case study', () => {
    expect(readHtml('/blog/architecture-styles-2026').querySelector('main a[href="/projects/osoul"]')).not.toBeNull();
  });
});

it('blog posts style numbered lists like the case studies', () => {
  const body = readHtml('/blog/architecture-styles-2026').querySelector('.post-body')!;
  expect(body.querySelector('ol')).not.toBeNull();
  expect(body.getAttribute('class')).toContain('[&_ol]:list-decimal');
});
