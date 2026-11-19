import { describe, it, expect } from 'vitest';
import { SKILL_CATEGORIES } from '../../src/lib/skill-icons';
import { readHtml, readText } from './helpers';

describe('/cv', () => {
  const doc = readHtml('/cv');
  const text = doc.querySelector('main')!.text;

  it('is headed by the name and headline', () => {
    expect(doc.querySelector('h1')!.text.trim()).toBe('Youssef Alouani');
    expect(text).toContain('Lead Backend & AI Engineer, founder of Osoul.');
  });
  it('lists the five roles with their periods', () => {
    for (const s of ['10xJobs', 'Oct 2026 – now', 'Osoul', 'Jun 2026 – now', 'Axelerated Solutions', 'Feb 2024 – May 2026', 'Finamaze', 'Jul 2023 – Jan 2024', 'Qalqul Engine', '2021 – 2023']) {
      expect(text).toContain(s);
    }
    expect(doc.querySelectorAll('.cv-role')).toHaveLength(5);
  });
  it('has education, grouped skills and contact details', () => {
    expect(text).toContain("Bachelor's degree in Computer Science, Hassan First University, FST Settat, 2017–2021");
    expect(text).not.toContain('Ingénieur');
    expect(doc.querySelectorAll('.cv-skills dt').map((d) => d.text.trim())).toEqual(SKILL_CATEGORIES.map((c) => c.label));
    expect(text).toContain('hello@youssefalouani.com');
    expect(text).toContain('youssefalouani.com');
  });
  it('ships print styles that hide the site chrome', () => {
    const inline = doc.querySelectorAll('style').map((s) => s.text).join('\n');
    const linked = doc.querySelectorAll('link[rel="stylesheet"]').map((l) => readText(l.getAttribute('href')!)).join('\n');
    const css = inline + linked;
    expect(css).toMatch(/@media print/);
    expect(css).toMatch(/@page\s*\{[^}]*size:\s*A4/);
  });
});
