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

import { isPreview } from '../../src/lib/metrics';

it('treats the dev server and preview builds as preview, production builds as not', () => {
  expect(isPreview({ DEV: true, PUBLIC_PREVIEW: undefined })).toBe(true);
  expect(isPreview({ DEV: false, PUBLIC_PREVIEW: 'true' })).toBe(true);
  expect(isPreview({ DEV: false, PUBLIC_PREVIEW: undefined })).toBe(false);
});

import { checkMarkerViolations } from '../../src/lib/metrics';

it('lists each CHECK marker as "<path>:<line>: <text>"', () => {
  expect(checkMarkerViolations([{ path: 'a.mdx', text: 'x\nfoo {/* CHECK */}' }])).toEqual(['a.mdx:2: foo {/* CHECK */}']);
});

it('trims long lines to 120 characters', () => {
  const [v] = checkMarkerViolations([{ path: 'a.mdx', text: `${'y'.repeat(200)} CHECK` }]);
  expect(v).toBe(`a.mdx:1: ${'y'.repeat(120)}`);
});

it('returns nothing for text without markers', () => {
  expect(checkMarkerViolations([{ path: 'a.mdx', text: 'all confirmed' }])).toEqual([]);
});
