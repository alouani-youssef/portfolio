import { readdirSync, readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { parse } from 'yaml';
import { FOCUS_IDS } from '../../src/lib/focus';

const DIR = 'src/content/projects/en';
const fm = Object.fromEntries(
  readdirSync(DIR).filter((f) => f.endsWith('.mdx')).map((f) => [f.replace(/\.mdx$/, ''), parse(readFileSync(`${DIR}/${f}`, 'utf8').split('---')[1]) as { focus?: string; parent?: string; featured?: boolean }]),
);
const ids = Object.keys(fm);

describe('project structure', () => {
  it('every project has exactly one of focus or parent, except archio which has neither', () => {
    for (const id of ids) {
      const { focus, parent } = fm[id];
      if (id === 'archio') expect([focus, parent], id).toEqual([undefined, undefined]);
      else expect(Boolean(focus) !== Boolean(parent), id).toBe(true);
    }
  });
  it('uses only known focus areas', () => {
    for (const id of ids) if (fm[id].focus) expect(FOCUS_IDS, id).toContain(fm[id].focus);
  });
  it('nests one level only: every parent is top-level', () => {
    for (const id of ids) if (fm[id].parent) expect(fm[fm[id].parent!.replace(/^en\//, '')].focus, id).toBeTruthy();
  });
  it('has 12 top-level case studies and 9 deep dives', () => {
    expect(ids.filter((id) => fm[id].focus)).toHaveLength(12);
    expect(ids.filter((id) => fm[id].parent)).toHaveLength(9);
  });
  it('features Osoul, Saudi STT and Customer Voice', () => {
    expect(ids.filter((id) => fm[id].featured).sort()).toEqual(['customer-voice', 'osoul', 'saudi-stt']);
  });
});
