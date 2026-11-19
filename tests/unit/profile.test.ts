import { it, expect } from 'vitest';
import { profile, profileSchema } from '../../src/data/profile';

it('profile is valid and on-message', () => {
  expect(profileSchema.parse(profile)).toBeTruthy();
  expect(profile.headline).toBe('Lead Backend & AI Engineer, founder of Osoul. I build multi-tenant platforms and the AI systems that run on them.');
  expect(profile.oneLiner.length).toBeLessThanOrEqual(160);
  expect(profile.expertise).toHaveLength(4);
  expect(profile.faq.length).toBeGreaterThanOrEqual(6);
  expect(profile.faq.length).toBeLessThanOrEqual(8);
  expect(profile.email).toBe('hello@youssefalouani.com');
});
