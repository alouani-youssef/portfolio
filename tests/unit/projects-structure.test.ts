import { readdirSync, readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { parse } from 'yaml';
import { FOCUS_IDS } from '../../src/lib/focus';

const DIR = 'src/content/projects/en';
const fm = Object.fromEntries(
  readdirSync(DIR).filter((f) => f.endsWith('.mdx')).map((f) => [f.replace(/\.mdx$/, ''), parse(readFileSync(`${DIR}/${f}`, 'utf8').split('---')[1]) as { focus?: string[]; parent?: string; featured?: boolean }]),
);
const ids = Object.keys(fm);

describe('project structure', () => {
  it('every project has exactly one of focus or parent', () => {
    for (const id of ids) expect(Boolean(fm[id].focus) !== Boolean(fm[id].parent), id).toBe(true);
  });
  it('lists one or more known focus areas, without repeats', () => {
    for (const id of ids) {
      const { focus } = fm[id];
      if (!focus) continue;
      expect(Array.isArray(focus) && focus.length > 0, id).toBe(true);
      for (const f of focus) expect(FOCUS_IDS, id).toContain(f);
      expect(new Set(focus).size, id).toBe(focus.length);
    }
  });
  it('nests one level only: every parent is top-level', () => {
    for (const id of ids) if (fm[id].parent) expect(fm[fm[id].parent!.replace(/^en\//, '')].focus, id).toBeTruthy();
  });
  it('has 13 top-level case studies and 8 deep dives', () => {
    expect(ids.filter((id) => fm[id].focus)).toHaveLength(13);
    expect(ids.filter((id) => fm[id].parent)).toHaveLength(8);
  });
  it('features Osoul, Saudi STT and Customer Voice', () => {
    expect(ids.filter((id) => fm[id].featured).sort()).toEqual(['customer-voice', 'osoul', 'saudi-stt']);
  });
});
