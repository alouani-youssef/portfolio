import { describe, it, expect } from 'vitest';
import { mdxToMarkdown, twinHref } from '../../src/lib/markdown';

const SAMPLE = [
  "import Figure from '../../components/Figure.astro';",
  "export const x = 1;",
  '',
  '<Figure src={x} alt="a" />',
  '',
  'A paragraph with a [link](/x). {/* CHECK: verify */}',
  '',
  '<OsoulDiagram>',
  '<details>',
  '<summary>Diagram source (Mermaid)</summary>',
  '',
  '```mermaid',
  'flowchart TB',
  '  a[<b>keep</b>] --> b',
  '```',
  '',
  '</details>',
  '</OsoulDiagram>',
  '',
  '',
  '',
  '<p>In Arabic <span lang="ar" dir="rtl">«طلبي»</span> here.</p>',
].join('\n');

describe('mdxToMarkdown', () => {
  const out = mdxToMarkdown(SAMPLE);
  it('drops imports, exports, components and comments', () => {
    expect(out).not.toMatch(/import |export |<Figure|OsoulDiagram|CHECK|<details>|<summary>/);
  });
  it('keeps prose, links and mermaid fences untouched', () => {
    expect(out).toContain('A paragraph with a [link](/x).');
    expect(out).toContain('```mermaid\nflowchart TB\n  a[<b>keep</b>] --> b\n```');
  });
  it('strips inline HTML tags outside code but keeps their text', () => {
    expect(out).toContain('In Arabic «طلبي» here.');
  });
  it('does not indent text pulled out of HTML blocks', () => {
    expect(mdxToMarkdown('Intro.\n\n<p>\n    Indented text inside a block.\n</p>')).toBe('Intro.\n\nIndented text inside a block.\n');
  });
  it('collapses runs of blank lines', () => {
    expect(out).not.toMatch(/\n{3,}/);
  });
});

describe('twinHref', () => {
  it('maps routes to .md twins', () => {
    expect(twinHref('/')).toBe('/index.md');
    expect(twinHref('/projects/osoul')).toBe('/projects/osoul.md');
  });
});
