import { describe, it, expect } from 'vitest';
import { readHtml, readText } from './helpers';

const DIVES = ['osoul-multi-tenancy', 'osoul-table-sessions'] as const;
/** Osoul work promoted to top-level case studies in their own focus area. */
const PROMOTED = ['osoul-ai-assistant', 'osoul-recommendations', 'osoul-server-side-tracking'] as const;
const H2 = ['Problem', 'Constraints', 'Architecture', 'Key decisions', 'Results', 'Stack and links'];

describe.each(DIVES)('/projects/%s', (slug) => {
  const doc = readHtml(`/projects/${slug}`);
  it('follows the case-study template and links back to Osoul', () => {
    expect(doc.querySelectorAll('main h2').map((h) => h.text.trim())).toEqual(H2);
    const back = doc.querySelector('main article > a');
    expect(back?.getAttribute('href')).toBe('/projects/osoul');
    expect(back?.text.trim()).toBe('← Osoul platform');
    expect(doc.querySelector('svg[role="img"] title')?.text.trim()).toBeTruthy();
  });
  it('is labelled as a deep dive, not the flagship', () => {
    const eyebrow = doc.querySelector('main header .eyebrow')!.text;
    expect(eyebrow).not.toContain('Flagship');
    expect(eyebrow).toContain('Deep dive');
  });
  it('has alt text on every screenshot', () => {
    const imgs = doc.querySelectorAll('main img');
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) expect(img.getAttribute('alt')?.trim()).toBeTruthy();
  });
});

describe.each(PROMOTED)('/projects/%s', (slug) => {
  const doc = readHtml(`/projects/${slug}`);
  it('is a top-level Osoul case study, not a deep dive', () => {
    const eyebrow = doc.querySelector('main header .eyebrow')!.text;
    expect(eyebrow).toContain('Osoul');
    expect(eyebrow).not.toContain('Deep dive');
    expect(doc.querySelector('h1')!.text).not.toMatch(/deep-dive/i);
  });
});

describe('deep-dive navigation', () => {
  it('the Osoul case study links every deep-dive', () => {
    const osoul = readHtml('/projects/osoul');
    for (const slug of DIVES) expect(osoul.querySelector(`main a[href="/projects/${slug}"]`), slug).not.toBeNull();
  });
  it('deep-dive link titles start with a capital letter', () => {
    const links = readHtml('/projects/osoul').querySelectorAll('main h3 + ul a');
    expect(links.length).toBe(DIVES.length);
    for (const a of links) expect(a.text.trim()).toMatch(/^[A-Z]/);
  });
  it('the projects index lists every deep-dive under Osoul', () => {
    const idx = readHtml('/projects');
    for (const slug of DIVES) expect(idx.querySelector(`[data-parent="osoul"] a[href="/projects/${slug}"]`), slug).not.toBeNull();
  });
  it('agents can reach them through llms.txt', () => {
    const llms = readText('llms.txt');
    for (const slug of [...DIVES, ...PROMOTED]) expect(llms).toContain(`/projects/${slug}.md`);
  });
});
