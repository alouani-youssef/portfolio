import { describe, it, expect } from 'vitest';
import { resolveIcon, SKILL_CATEGORIES } from '../../src/lib/skill-icons';

describe('resolveIcon', () => {
  it('inlines a simple-icons brand as a currentColor svg without a title', () => {
    const r = resolveIcon('si:redis');
    expect(r.brand).toBe(true);
    expect(r.brandHover).toEqual({ light: '#FF4438', dark: '#FF4438' });
    expect(r.svg).toContain('viewBox="0 0 24 24"');
    expect(r.svg).toContain('aria-hidden="true"');
    expect(r.svg).toContain('fill="currentColor"');
    expect(r.svg).not.toContain('<title');
  });

  it('falls back to accent per theme when the brand colour has under 3:1 contrast', () => {
    expect(resolveIcon('si:nextdotjs').brandHover).toEqual({ light: '#000000', dark: 'var(--accent)' });
    expect(resolveIcon('si:huggingface').brandHover).toEqual({ light: 'var(--accent)', dark: '#FFD21E' });
    expect(resolveIcon('si:react').brandHover!.light).toBe('var(--accent)');
    expect(resolveIcon('si:langgraph').brandHover!.light).toBe('var(--accent)');
    expect(resolveIcon('si:keycloak').brandHover!.dark).toBe('var(--accent)');
  });

  it('inlines a lucide icon as a stroked svg without size or comment', () => {
    const r = resolveIcon('lucide:server');
    expect(r.brand).toBe(false);
    expect(r.brandHover).toBeNull();
    expect(r.svg).toContain('stroke="currentColor"');
    expect(r.svg).toContain('aria-hidden="true"');
    expect(r.svg).not.toContain('<!--');
    expect(r.svg).not.toContain('width="24"');
  });

  it('keeps the size attributes of shapes inside a lucide icon', () => {
    const { svg } = resolveIcon('lucide:server');
    expect(svg).toMatch(/<rect[^>]*width="20"[^>]*height="8"/);
    expect(svg).not.toMatch(/<svg[^>]*\swidth=/);
  });

  it.each(['si:nope', 'lucide:nope', 'foo:bar', 'lucide:../x'])('throws for unknown icon %s', (ref) => {
    expect(() => resolveIcon(ref)).toThrow(/Unknown skill icon/);
  });
});

describe('SKILL_CATEGORIES', () => {
  it('lists the twelve sections in order, each with a resolvable icon', () => {
    expect(SKILL_CATEGORIES.map((c) => c.id)).toEqual([
      'language', 'backend', 'databases', 'messaging', 'llm', 'ml', 'etl', 'security',
      'infra', 'patterns', 'lowcode', 'frontend',
    ]);
    for (const c of SKILL_CATEGORIES) expect(() => resolveIcon(c.icon)).not.toThrow();
  });
});
