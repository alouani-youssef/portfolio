import { describe, it, expect } from 'vitest';
import { readHtml, readText, exists, listHtmlPages } from './helpers';

describe('markdown twins', () => {
  it('every page that links a twin points at a file that exists (Review Focus 5)', () => {
    let linked = 0;
    for (const route of listHtmlPages()) {
      const href = readHtml(route).querySelector('link[rel="alternate"][type="text/markdown"]')?.getAttribute('href');
      if (!href) continue;
      linked++;
      expect(exists(href), `${route} → ${href}`).toBe(true);
    }
    expect(linked).toBeGreaterThanOrEqual(15);
  });
  it('core pages all have twins', () => {
    for (const r of ['/', '/about', '/experience', '/experience/osoul', '/projects', '/projects/osoul', '/blog', '/now', '/contact', '/cv']) {
      expect(readHtml(r).querySelector('link[rel="alternate"][type="text/markdown"]'), r).not.toBeNull();
    }
  });
  it('the Osoul twin carries the content and the diagram source, not components', () => {
    const md = readText('projects/osoul.md');
    expect(md.startsWith('# Osoul platform')).toBe(true);
    expect(md).toContain('Source: https://youssefalouani.com/projects/osoul');
    expect(md).toContain('Revenue');
    expect(md).toContain('```mermaid');
    expect(md).not.toContain('<Gallery');
  });
  it('no twin leaks review markers or drafts', () => {
    for (const f of ['index.md', 'about.md', 'projects/osoul.md', 'projects/saudi-stt.md', 'projects/customer-voice.md', 'experience/osoul.md']) {
      expect(readText(f), f).not.toContain('CHECK');
    }
    expect(exists('blog/whisper-saudi-dialect.md')).toBe(false);
  });
});
