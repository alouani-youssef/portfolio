import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

// Claims inferred during the build (not in the content spec) must stay flagged for Youssef's review.
const FLAGGED: Record<string, string[]> = {
  'src/content/projects/en/saudi-stt.mdx': [
    'Saudi Arabic mixed with English product terms',
    'narrow-band Asterisk recordings',
    'could not go to a third-party speech API',
    'latency matters as much as accuracy',
    'Hosted APIs were weaker on Saudi dialect',
  ],
  'src/content/projects/en/customer-voice.mdx': [
    'quicker for the first consumer and wrong for the fifth',
  ],
};

describe('inferred claims carry CHECK markers', () => {
  for (const [file, phrases] of Object.entries(FLAGGED)) {
    const lines = readFileSync(file, 'utf8').split('\n');
    for (const phrase of phrases) {
      it(`${file}: "${phrase}"`, () => {
        const line = lines.find((l) => l.includes(phrase));
        expect(line, phrase).toBeDefined();
        expect(line).toContain('CHECK');
      });
    }
  }
});
