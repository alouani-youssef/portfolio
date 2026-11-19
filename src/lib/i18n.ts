import { z } from 'astro/zod';

export type Lang = 'en' | 'fr';
export const LANGS: Lang[] = ['en', 'fr'];

export const localized = z.object({ en: z.string(), fr: z.string().optional() });
export type Localized = z.infer<typeof localized>;

/** Resolve a localized value; falls back to English. */
export function t(value: Localized | string, lang: Lang): string {
  if (typeof value === 'string') return value;
  return value[lang] ?? value.en;
}

/** 'en/osoul' → 'osoul' */
export function entrySlug(id: string): string {
  return id.split('/').slice(1).join('/') || id;
}

/** 'fr/osoul' → 'fr' */
export function entryLang(id: string): Lang {
  const head = id.split('/')[0];
  return (LANGS as string[]).includes(head) ? (head as Lang) : 'en';
}
