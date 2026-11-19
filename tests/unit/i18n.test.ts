import { it, expect } from 'vitest';
import { t, entrySlug, entryLang } from '../../src/lib/i18n';

it('falls back to en', () => expect(t({ en: 'Hi' }, 'fr')).toBe('Hi'));
it('returns plain strings unchanged', () => expect(t('Hi', 'en')).toBe('Hi'));
it('parses entry ids', () => {
  expect(entrySlug('en/osoul')).toBe('osoul');
  expect(entryLang('fr/osoul')).toBe('fr');
});
