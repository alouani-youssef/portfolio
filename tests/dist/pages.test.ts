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
    expect(doc.querySelector('h1')!.text.trim()).toBe('AI Systems Engineer with a backend foundation.');
    expect(doc.querySelector('title')!.text).toBe('Youssef Alouani · AI Systems Engineer');
  });
  it('shows six focus-area expertise cards', () => {
    expect(doc.querySelectorAll('.expertise-card')).toHaveLength(6);
    const tops = doc.querySelectorAll('.expertise-card a.expertise-project').map((a) => a.getAttribute('href'));
    expect(tops).toEqual(['/projects/customer-voice', '/projects/chatbots', '/projects/saudi-stt', '/projects/osoul-recommendations', '/projects/10xjobs-ingestion', '/projects/osoul']);
    expect(doc.querySelector('section[aria-labelledby="expertise"] a[href="/projects"]')).not.toBeNull();
  });
  it('offers an All filter plus one per group, in order, with counts', () => {
    const buttons = doc.querySelectorAll('.client-filter button');
    expect(buttons.map((b) => b.getAttribute('data-filter'))).toEqual(['all', ...GROUP_ORDER]);
    expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false', 'false', 'false']);
    expect(buttons[0].text).toContain('12');
    expect(buttons[1].text).toContain('2');
    for (const [i, g] of GROUP_ORDER.entries()) expect(buttons[i + 1].getAttribute('title')).toBe(GROUP_LABELS[g]);
  });
  it('hides the filter until its script runs, so the full list shows without JavaScript', () => {
    expect(doc.querySelector('.client-filter')!.hasAttribute('hidden')).toBe(true);
  });
  it('tags every tile with its group', () => {
    const groups = doc.querySelectorAll('.client-groups li[data-group]').map((li) => li.getAttribute('data-group'));
    expect(groups).toHaveLength(12);
    expect(new Set(groups)).toEqual(new Set(GROUP_ORDER));
  });
  it('shows every client as a logo tile, linking out where a site is known', () => {
    const tiles = doc.querySelectorAll('.client-groups .client-tile');
    expect(tiles).toHaveLength(12);
    const byName = (n: string) => tiles.find((t) => t.text.includes(n))!;
    const hertz = byName('Hertz Morocco');
    expect(hertz.tagName).toBe('A');
    expect(hertz.getAttribute('href')).toBe('https://www.hertz.com');
    expect(hertz.getAttribute('target')).toBe('_blank');
    expect(hertz.getAttribute('rel')).toContain('noopener');
    expect(hertz.querySelector('img[alt="Hertz Morocco logo"]')).not.toBeNull();
    expect(byName('CityClub').tagName).not.toBe('A');
    expect(byName('Saudi National Bank').querySelector('img[alt="Saudi National Bank logo"]')).not.toBeNull();
    expect(byName('Atlas Group').classList.contains('client-tile--dark')).toBe(true);
  });
  it('shows exactly one recommendation pull quote, with the others linking to the full list', () => {
    expect(doc.querySelectorAll('main blockquote')).toHaveLength(1);
    expect(doc.querySelector('main blockquote mark')!.text).toBe('thinks like an architect');
    expect(doc.querySelectorAll('.rec-others a[href="/about#recommendations"]')).toHaveLength(2);
  });
  it('shows the core stack strip with icons, linking to all skills', () => {
    const section = doc.querySelector('section[aria-labelledby="core-stack-h"]')!;
    expect(section.querySelector('h2')!.text.trim()).toBe('Core stack');
    const items = section.querySelectorAll('.core-stack li');
    expect(items.map((li) => li.text.trim())).toEqual(['RAG', 'MCP', 'LangGraph', 'LangChain', 'Whisper', 'Fine-tuning', 'Python', 'FastAPI', 'NestJS', 'Go', 'TypeScript', 'PostgreSQL', 'Redis', 'Kafka']);
    for (const li of items) expect(li.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    expect(section.querySelector('a[href="/about#skills"]')).not.toBeNull();
  });
  it('does not emit skill anchors (Review Focus 4)', () => {
    expect(doc.querySelectorAll('[id^="skill-"]')).toHaveLength(0);
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
      expect(fig!.querySelector('.rec__avatar')!.text.trim()).toMatch(/^[A-Z]{2}$/);
    }
    expect(doc.querySelector('#recommendations .rec--lg')).not.toBeNull();
    expect(doc.querySelector('#recommendations a.rec__role[href="/experience/qalqul"]')).not.toBeNull();
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
  it('/contact leads with backend and AI positions', () => {
    const m = main('/contact');
    expect(m.text).toContain('Open to backend & AI positions');
    expect(m.text).not.toContain('senior backend & AI conversations');
    expect(m.querySelector('#services h3')!.text.trim()).toBe('Backend & AI positions');
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
