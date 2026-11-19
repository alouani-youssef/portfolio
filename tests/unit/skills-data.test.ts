import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { resolveIcon } from '../../src/lib/skill-icons';

const skills = parse(readFileSync('src/data/skills.yaml', 'utf8')) as Array<{ id: string; icon?: string; core?: boolean }>;

describe('skills.yaml', () => {
  it('gives every skill a resolvable icon', () => {
    for (const s of skills) {
      expect(s.icon, s.id).toBeTypeOf('string');
      expect(() => resolveIcon(s.icon!), s.id).not.toThrow();
    }
  });

  it('marks the core stack in display order', () => {
    expect(skills.filter((s) => s.core).map((s) => s.id)).toEqual([
      'typescript', 'go', 'python', 'nestjs', 'postgresql', 'redis', 'kafka', 'langgraph', 'ollama', 'kubernetes',
    ]);
  });
});
