import { describe, it, expect } from 'vitest';
import { readHtml, listHtmlPages } from './helpers';
import { GROUP_LABELS, GROUP_ORDER } from '../../src/lib/clients';
import { SKILL_CATEGORIES, LEVEL_LABELS } from '../../src/lib/skill-icons';
import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

const skillCount = (parseYaml(readFileSync('src/data/skills.yaml', 'utf8')) as unknown[]).length;

const main = (route: string) => readHtml(route).querySelector('main')!;

describe('home', () => {
  const doc = readHtml('/');
  it('leads with the headline', () => {
    expect(doc.querySelector('h1')!.text.trim()).toBe('Lead Backend & AI Engineer, founder of Osoul.');
  });
  it('shows four expertise cards', () => {
    expect(doc.querySelectorAll('.expertise-card')).toHaveLength(4);
  });
  it('shows client groups in order', () => {
    const labels = doc.querySelectorAll('.client-groups h3').map((h) => h.text.trim());
    expect(labels).toEqual(GROUP_ORDER.map((g) => GROUP_LABELS[g]));
  });
  it('shows exactly one recommendation pull quote', () => {
    expect(doc.querySelectorAll('main blockquote')).toHaveLength(1);
  });
  it('links to contact and cv', () => {
    const hrefs = doc.querySelectorAll('main a').map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/contact');
    expect(hrefs).toContain('/cv');
  });
});

describe('about', () => {
  const doc = readHtml('/about');
  it('quotes all three recommendations with LinkedIn links', () => {
    const quotes = doc.querySelectorAll('main blockquote');
    expect(quotes).toHaveLength(3);
    for (const q of quotes) {
      const fig = q.parentNode;
      expect(fig!.querySelector('a[href*="linkedin.com"]')).not.toBeNull();
    }
  });
  it('has a 6–8 item FAQ', () => {
    const items = doc.querySelectorAll('#faq details');
    expect(items.length).toBeGreaterThanOrEqual(6);
    expect(items.length).toBeLessThanOrEqual(8);
  });
  it('groups skills into one card per category, in order', () => {
    const groups = doc.querySelectorAll('#skills .skill-group');
    expect(groups).toHaveLength(SKILL_CATEGORIES.length);
    expect(groups.map((g) => g.querySelector('h3')!.text.trim())).toEqual(SKILL_CATEGORIES.map((c) => c.label));
    expect(doc.querySelector('#skills table')).toBeNull();
  });
  it('shows every skill with an anchor, a hidden icon and a spoken level (Review Focus 2, 3)', () => {
    const items = doc.querySelectorAll('#skills li[id^="skill-"]');
    expect(items).toHaveLength(skillCount);
    const spoken = Object.values(LEVEL_LABELS).map((l) => `(${l})`);
    for (const li of items) {
      expect(li.querySelector('svg[aria-hidden="true"]'), li.id).not.toBeNull();
      expect(li.querySelector('svg title'), li.id).toBeNull();
      expect(spoken, li.id).toContain(li.querySelector('.sr-only')?.text.trim());
    }
  });
  it('explains the level markers in a legend', () => {
    const legend = doc.querySelector('#skills .skill-legend')!.text;
    for (const l of Object.values(LEVEL_LABELS)) expect(legend).toContain(l);
  });
});

describe('now and contact', () => {
  it('/now shows an updated date', () => {
    expect(main('/now').querySelector('time')?.getAttribute('datetime')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it('/contact shows the public email', () => {
    expect(main('/contact').querySelector('a[href="mailto:hello@youssefalouani.com"]')).not.toBeNull();
  });
});

describe('site-wide', () => {
  it('wraps every table for phone widths (Review Focus 1)', () => {
    for (const route of listHtmlPages()) {
      for (const table of readHtml(route).querySelectorAll('table')) {
        expect(table.parentNode!.classList.contains('table-scroll'), route).toBe(true);
      }
    }
  });
  it('never names hospitality venues', () => {
    for (const route of listHtmlPages()) {
      expect(readHtml(route).text, route).not.toMatch(/Casa Harris|Shanzoo/);
    }
  });
  it('every page has exactly one h1', () => {
    for (const route of listHtmlPages()) {
      expect(readHtml(route).querySelectorAll('h1'), route).toHaveLength(1);
    }
  });
});
