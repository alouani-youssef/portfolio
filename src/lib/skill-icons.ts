import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import * as simpleIcons from 'simple-icons';

export type Category =
  | 'language' | 'backend' | 'databases' | 'messaging' | 'llm' | 'ml' | 'etl' | 'security'
  | 'infra' | 'ops' | 'cloud' | 'testing' | 'patterns' | 'lowcode' | 'frontend';

export const SKILL_CATEGORIES: ReadonlyArray<{ id: Category; label: string; icon: string }> = [
  { id: 'language', label: 'Languages', icon: 'lucide:code-xml' },
  { id: 'backend', label: 'Backend', icon: 'lucide:server' },
  { id: 'databases', label: 'Databases', icon: 'lucide:database' },
  { id: 'messaging', label: 'Brokers and protocols', icon: 'lucide:arrow-left-right' },
  { id: 'llm', label: 'LLMs and agents', icon: 'lucide:sparkles' },
  { id: 'ml', label: 'ML / DL / NLP / NLU', icon: 'lucide:brain' },
  { id: 'etl', label: 'Data and ETL', icon: 'lucide:database-zap' },
  { id: 'security', label: 'Identity and security', icon: 'lucide:shield-check' },
  { id: 'infra', label: 'Infra', icon: 'lucide:server-cog' },
  { id: 'ops', label: 'Ops', icon: 'lucide:infinity' },
  { id: 'cloud', label: 'Cloud providers', icon: 'lucide:cloud' },
  { id: 'testing', label: 'Testing', icon: 'lucide:test-tube-diagonal' },
  { id: 'patterns', label: 'Design patterns', icon: 'lucide:shapes' },
  { id: 'lowcode', label: 'Low-code', icon: 'lucide:blocks' },
  { id: 'frontend', label: 'Front end', icon: 'lucide:layout-template' },
];

export const LEVEL_LABELS = { expert: 'expert', production: 'shipped in production', familiar: 'familiar' } as const;

/** Hover colour per theme: the brand hex, or `var(--accent)` when the hex has under 3:1 contrast on that theme's background. */
export interface BrandHover { light: string; dark: string }
export interface ResolvedIcon { svg: string; brand: boolean; brandHover: BrandHover | null }

/** Page backgrounds, kept in sync with --bg in src/styles/global.css. */
const THEME_BG = { light: 'fafaf9', dark: '0e0f11' } as const;
const MIN_HOVER_CONTRAST = 3;

type SimpleIcon = { slug: string; hex: string; path: string };
const BRANDS = new Map<string, SimpleIcon>(
  (Object.values(simpleIcons) as unknown[])
    .filter((v): v is SimpleIcon => typeof v === 'object' && v !== null && 'slug' in v && 'path' in v)
    .map((i) => [i.slug, i]),
);
const require = createRequire(import.meta.url);
const cache = new Map<string, ResolvedIcon>();
const A11Y = 'aria-hidden="true" focusable="false"';

/** WCAG relative luminance of a 6-digit hex colour. */
function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function hoverFor(hex: string, bg: string): string {
  return contrast(hex, bg) >= MIN_HOVER_CONTRAST ? `#${hex}` : 'var(--accent)';
}

function brandIcon(slug: string): ResolvedIcon | null {
  const icon = BRANDS.get(slug);
  if (!icon) return null;
  return {
    svg: `<svg viewBox="0 0 24 24" fill="currentColor" ${A11Y}><path d="${icon.path}"/></svg>`,
    brand: true,
    brandHover: { light: hoverFor(icon.hex, THEME_BG.light), dark: hoverFor(icon.hex, THEME_BG.dark) },
  };
}

function lucideIcon(name: string): ResolvedIcon | null {
  if (!/^[a-z0-9-]+$/.test(name)) return null;
  let raw: string;
  try {
    raw = readFileSync(require.resolve(`lucide-static/icons/${name}.svg`), 'utf8');
  } catch {
    return null;
  }
  const svg = raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg[^>]*>/, (tag) => tag.replace(/\s(class|width|height)="[^"]*"/g, '').replace('<svg', `<svg ${A11Y}`))
    .replace(/\s+/g, ' ')
    .trim();
  return { svg, brand: false, brandHover: null };
}

/** Resolve `si:<slug>` or `lucide:<name>` to inline SVG. Throws for anything unknown. */
export function resolveIcon(ref: string): ResolvedIcon {
  const hit = cache.get(ref);
  if (hit) return hit;
  const [prefix, name = ''] = ref.split(':', 2);
  const icon = prefix === 'si' ? brandIcon(name) : prefix === 'lucide' ? lucideIcon(name) : null;
  if (!icon) throw new Error(`Unknown skill icon: ${ref}`);
  cache.set(ref, icon);
  return icon;
}
