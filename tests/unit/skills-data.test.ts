import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { resolveIcon } from '../../src/lib/skill-icons';

const skills = parse(readFileSync('src/data/skills.yaml', 'utf8')) as Array<{ id: string; icon?: string; core?: number }>;

describe('skills.yaml', () => {
  it('gives every skill a resolvable icon', () => {
    for (const s of skills) {
      expect(s.icon, s.id).toBeTypeOf('string');
      expect(() => resolveIcon(s.icon!), s.id).not.toThrow();
    }
  });

  it('ranks the core stack with unique positions', () => {
    const core = skills.filter((s) => s.core !== undefined).sort((a, b) => a.core! - b.core!);
    expect(core.map((s) => s.core)).toEqual(core.map((_, i) => i + 1));
    expect(core.map((s) => s.id)).toEqual([
      'typescript', 'go', 'python', 'nestjs', 'postgresql', 'redis', 'kafka', 'langgraph', 'ollama', 'kubernetes',
    ]);
  });
});
