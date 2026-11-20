import { it, expect } from 'vitest';
import { profile, profileSchema } from '../../src/data/profile';
import { FOCUS_AREAS } from '../../src/lib/focus';

it('profile is valid and on-message', () => {
  expect(profileSchema.parse(profile)).toBeTruthy();
  expect(profile.headline).toBe('I build AI that works on real data in production, and keeps that data safe. AI engineer with a backend foundation: RAG and MCP over private data, Saudi-dialect speech, recommendations and privacy-aware assistants, evaluated before they ship.');
  expect(profile.jobTitle).toBe('AI Engineer');
  expect(profile.links.medium).toBe('https://medium.com/@alouaniyoussef');
  const faq = profile.faq.map((f) => f.a).join(' ');
  expect(faq).not.toContain('full time');
  expect(faq).not.toContain('founder of 10xJobs');
  expect(faq).toContain('open to backend and AI engineering positions');
  expect(profile.oneLiner.length).toBeLessThanOrEqual(160);
  expect(profile.expertise.map((e) => e.id)).toEqual(FOCUS_AREAS.map((a) => a.id));
  expect(profile.expertise.map((e) => e.title)).toEqual(FOCUS_AREAS.map((a) => a.title));
  for (const e of profile.expertise) {
    for (const bad of ['KYC', 'DeepEval', 'Giskard', 'familiarity', 'AI Stones']) expect(e.body, `${e.id}: ${bad}`).not.toContain(bad);
  }
  expect(profile.faq.length).toBeGreaterThanOrEqual(6);
  expect(profile.faq.length).toBeLessThanOrEqual(8);
  expect(profile.email).toBe('hello@youssefalouani.com');
  expect(profile.links.schedule).toBe('https://calendar.app.google/ru99z5cCrAbbu8LP9');
});
