import { describe, it, expect } from 'vitest';
import { dedupeSvgs } from '../../src/lib/svg-sprite';

const icon = (cls: string) => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${'M0 0L24 24'.repeat(30)}"/></svg>`;
const page = (body: string) => `<!doctype html><html><head></head><body class="x">${body}</body></html>`;

describe('dedupeSvgs', () => {
  it('draws a repeated icon once as a symbol and references it with <use>', () => {
    const out = dedupeSvgs(page(icon('a') + icon('b') + icon('c')));
    expect(out.match(/<path /g)).toHaveLength(1);
    expect(out.match(/<use href="#svg-s0"\/>/g)).toHaveLength(3);
    expect(out).toContain('<symbol id="svg-s0" viewBox="0 0 24 24">');
    expect(out).toMatch(/<body class="x"><svg [^>]*aria-hidden="true"[^>]*><symbol/);
  });
  it('keeps each instance\'s own attributes', () => {
    const out = dedupeSvgs(page(icon('a') + icon('b')));
    expect(out).toContain('<svg class="a" viewBox="0 0 24 24" aria-hidden="true"><use');
    expect(out).toContain('<svg class="b" viewBox="0 0 24 24" aria-hidden="true"><use');
  });
  it('leaves unique, tiny, id-bearing and nested SVGs alone', () => {
    const tiny = '<svg viewBox="0 0 1 1"><path d="M0 0"/></svg>';
    const withId = `<svg viewBox="0 0 9 9"><defs><pattern id="p1"/></defs>${'<circle r="1"/>'.repeat(30)}</svg>`;
    const html = page(icon('a') + tiny + tiny + withId + withId);
    expect(dedupeSvgs(html)).toBe(html);
  });
  it('ignores scoped-style attributes when comparing', () => {
    const a = icon('a').replace('<path', '<path data-astro-cid-abc');
    const out = dedupeSvgs(page(a + icon('b')));
    expect(out.match(/<use /g)).toHaveLength(2);
    expect(out).not.toContain('data-astro-cid-abc');
  });
});
