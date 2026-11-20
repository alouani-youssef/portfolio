import { describe, it, expect } from 'vitest';
import { initials, avatarHue, splitHighlight } from '../../src/lib/recommendations';

describe('recommendation helpers', () => {
  it('builds initials from first and last name', () => {
    expect(initials('Mohammad Al-Ahmad')).toBe('MA');
    expect(initials('Tanvir Islam')).toBe('TI');
    expect(initials('Cher')).toBe('C');
  });
  it('gives each name a stable hue', () => {
    expect(avatarHue('Tareq Bareich')).toBe(avatarHue('Tareq Bareich'));
    expect(avatarHue('Tareq Bareich')).toBeLessThan(360);
  });
  it('splits a quote around its highlight', () => {
    expect(splitHighlight('Working is hard, and he thrived.', 'he thrived')).toEqual(['Working is hard, and ', 'he thrived', '.']);
    expect(splitHighlight('No match here', 'absent')).toEqual(['No match here', '', '']);
    expect(splitHighlight('No highlight')).toEqual(['No highlight', '', '']);
  });
});

import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

describe('recommendations.yaml', () => {
  const recs = parse(readFileSync('src/data/recommendations.yaml', 'utf8')) as Array<{ id: string; experience?: string }>;
  it('ties Tareq Bareich to Finamaze', () => {
    expect(recs.find((r) => r.id === 'tareq-bareich')!.experience).toBe('en/finamaze');
  });
});
