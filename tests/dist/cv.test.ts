import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { SKILL_CATEGORIES } from '../../src/lib/skill-icons';
import { readHtml, readText } from './helpers';

describe('/cv', () => {
  const doc = readHtml('/cv');
  const text = doc.querySelector('main')!.text;

  it('is headed by the name and headline', () => {
    expect(doc.querySelector('h1')!.text.trim()).toBe('Youssef Alouani');
    expect(text).toContain('I build AI that works on real data in production, and keeps that data safe.');
    expect(text).not.toContain('Lead Backend & AI Engineer');
  });
  it('lists the five roles with their periods', () => {
    for (const s of ['10xJobs', 'Oct 2026 – now', 'Osoul', 'Jun 2026 – now', 'Axelerated Solutions', 'Feb 2024 – May 2026', 'Finamaze', 'Jul 2023 – Jan 2024', 'Qalqul Engine', 'Dec 2021 – Jul 2023']) {
      expect(text).toContain(s);
    }
    expect(doc.querySelectorAll('.cv-role')).toHaveLength(5);
  });
  it('has grouped skills and contact details, and no education', () => {
    expect(text).not.toContain('Education');
    expect(text).not.toContain('Hassan First University');
    expect(text).not.toContain('Ingénieur');
    const listed = (parse(readFileSync('src/data/skills.yaml', 'utf8')) as Array<{ name: string; category: string; level: string; core?: number }>).filter((s) => s.core !== undefined || s.level === 'expert');
    expect(doc.querySelectorAll('.cv-skills dt').map((d) => d.text.trim())).toEqual(SKILL_CATEGORIES.filter((c) => listed.some((s) => s.category === c.id)).map((c) => c.label));
    const cvSkills = doc.querySelector('.cv-skills')!.text;
    for (const s of listed) expect(cvSkills, s.name).toContain(s.name);
    for (const name of ['Ollama', 'Kotlin', 'Nginx']) expect(cvSkills, name).not.toContain(name);
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
