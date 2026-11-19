import { it, expect } from 'vitest';
import { placeholderViolations } from '../../src/lib/metrics';

const project = (id: string, metrics: Array<{ label: string; placeholder: boolean }>) => ({ id, data: { metrics } });

it('lists each placeholder metric as "<slug>: <label>"', () => {
  expect(placeholderViolations([project('en/osoul', [
    { label: 'Average ticket', placeholder: true },
    { label: 'Venues live', placeholder: false },
  ])])).toEqual(['osoul: Average ticket']);
});

it('returns nothing when every metric is confirmed', () => {
  expect(placeholderViolations([project('en/osoul', [{ label: 'Venues live', placeholder: false }])])).toEqual([]);
});
