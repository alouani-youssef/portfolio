import { it, expect } from 'vitest';
import { profile, profileSchema } from '../../src/data/profile';

it('profile is valid and on-message', () => {
  expect(profileSchema.parse(profile)).toBeTruthy();
  expect(profile.headline).toBe('AI Systems Engineer with a backend foundation. I build NLP, speech, recommendation and agentic systems, and the platforms they run on.');
  expect(profile.jobTitle).toBe('AI Systems Engineer');
  expect(profile.links.medium).toBe('https://medium.com/@alouaniyoussef');
  const faq = profile.faq.map((f) => f.a).join(' ');
  expect(faq).not.toContain('full time');
  expect(faq).not.toContain('founder of 10xJobs');
  expect(faq).toContain('open to backend and AI engineering positions');
  expect(profile.oneLiner.length).toBeLessThanOrEqual(160);
  expect(profile.expertise).toHaveLength(4);
  expect(profile.faq.length).toBeGreaterThanOrEqual(6);
  expect(profile.faq.length).toBeLessThanOrEqual(8);
  expect(profile.email).toBe('hello@youssefalouani.com');
});
