import { it, expect } from 'vitest';
import { profile } from '../../src/data/profile';
import { buildVcard } from '../../src/lib/vcard';

const card = buildVcard(profile, 'https://www.alouaniyoussef.com');
const unfolded = card.replace(/\r\n /g, '');

it('is a CRLF vCard 3.0 with the public contact details', () => {
  expect(card.startsWith('BEGIN:VCARD\r\nVERSION:3.0\r\n')).toBe(true);
  expect(card.endsWith('END:VCARD\r\n')).toBe(true);
  expect(card.replace(/\r\n/g, '')).not.toContain('\n');
  expect(unfolded).toContain('FN:Youssef Alouani\r\n');
  expect(unfolded).toContain('N:Alouani;Youssef;;;\r\n');
  expect(unfolded).toContain(`EMAIL;TYPE=INTERNET,PREF:${profile.email}\r\n`);
  expect(unfolded).toContain(`URL;TYPE=schedule:${profile.links.schedule}\r\n`);
  expect(unfolded).toContain(`X-SOCIALPROFILE;TYPE=linkedin:${profile.links.linkedin}\r\n`);
});

it('folds lines at 75 octets and escapes text values', () => {
  for (const line of card.split('\r\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  const note = unfolded.split('\r\n').find((l) => l.startsWith('NOTE:'))!;
  expect(note).toContain('\\,');
  expect(note).not.toMatch(/[^\\][,;]/);
});
