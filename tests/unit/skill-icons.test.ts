import { describe, it, expect } from 'vitest';
import { resolveIcon, SKILL_CATEGORIES } from '../../src/lib/skill-icons';

describe('resolveIcon', () => {
  it('inlines a simple-icons brand as a currentColor svg without a title', () => {
    const r = resolveIcon('si:redis');
    expect(r.brand).toBe(true);
    expect(r.brandHover).toBe('#FF4438');
    expect(r.svg).toContain('viewBox="0 0 24 24"');
    expect(r.svg).toContain('aria-hidden="true"');
    expect(r.svg).toContain('fill="currentColor"');
    expect(r.svg).not.toContain('<title');
  });

  it('drops the hover brand colour for near-black brands', () => {
    expect(resolveIcon('si:nextdotjs').brandHover).toBeNull();
    expect(resolveIcon('si:ollama').brandHover).toBeNull();
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

  it.each(['si:nope', 'lucide:nope', 'foo:bar', 'lucide:../x'])('throws for unknown icon %s', (ref) => {
    expect(() => resolveIcon(ref)).toThrow(/Unknown skill icon/);
  });
});

describe('SKILL_CATEGORIES', () => {
  it('lists the eight categories in order, each with a resolvable icon', () => {
    expect(SKILL_CATEGORIES.map((c) => c.id)).toEqual(['language', 'backend', 'data', 'ai', 'security', 'infra', 'frontend', 'realtime']);
    for (const c of SKILL_CATEGORIES) expect(() => resolveIcon(c.icon)).not.toThrow();
  });
});
