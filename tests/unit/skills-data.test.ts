import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { resolveIcon, SKILL_CATEGORIES } from '../../src/lib/skill-icons';

const skills = parse(readFileSync('src/data/skills.yaml', 'utf8')) as Array<{ id: string; category: string; level: string; icon?: string; core?: number; evidence?: string[] }>;
const slugs = (dir: string) => readdirSync(dir).filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''));
const ossIds = (parse(readFileSync('src/data/oss.yaml', 'utf8')) as Array<{ id: string }>).map((o) => o.id);
const KNOWN = new Set([...slugs('src/content/projects/en'), ...slugs('src/content/experience/en'), ...ossIds]);
const level = (id: string) => skills.find((s) => s.id === id)!.level;

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
      'rag', 'mcp', 'langgraph', 'langchain', 'whisper', 'fine-tuning', 'python', 'fastapi', 'nestjs', 'go', 'typescript', 'postgresql', 'redis', 'kafka',
    ]);
  });

  const inCat = (cat: string) => skills.filter((s) => s.category === cat).map((s) => s.id).sort();

  it('puts every skill in a known, non-empty section', () => {
    const ids = SKILL_CATEGORIES.map((c) => c.id) as string[];
    for (const s of skills) expect(ids, s.id).toContain(s.category);
    for (const id of ids) expect(inCat(id).length, id).toBeGreaterThan(0);
  });

  it('splits databases from brokers and protocols', () => {
    expect(inCat('databases')).toEqual(['milvus', 'neo4j', 'pgvector', 'postgresql', 'redis']);
    expect(inCat('messaging')).toEqual(['grpc', 'kafka', 'push-notifications', 'rabbitmq', 'sse', 'websockets']);
  });

  it('splits LLMs from ML / DL / NLP / NLU', () => {
    expect(inCat('llm')).toEqual(['claude-harnesses', 'embeddings', 'langchain', 'langgraph', 'mcp', 'ollama', 'rag', 'semantic-search']);
    expect(inCat('ml')).toEqual(['duckling', 'fine-tuning', 'huggingface-transformers', 'nllb-200', 'recommendation-systems', 'whisper', 'zero-shot-classification']);
  });

  it('has testing, design patterns, low-code, ETL, ops and infra sections', () => {
    expect(inCat('testing')).toEqual(['deepeval', 'giskard', 'jest', 'pytest', 'robot-framework', 'testcontainers', 'unit-tests']);
    expect(inCat('patterns')).toEqual(['clean-architecture', 'event-driven', 'microservices']);
    expect(inCat('lowcode')).toEqual(['botpress', 'n8n']);
    expect(inCat('etl')).toEqual(['clickhouse', 'data-pipelines', 'docling']);
    expect(inCat('ops')).toEqual(['ansible', 'argocd', 'github-actions', 'gitlab-ci', 'grafana', 'nginx', 'prometheus', 'terraform']);
    expect(inCat('infra')).toEqual(['docker-compose', 'hybrid-deployments', 'kubernetes', 'object-storage']);
  });

  it('lists Hetzner and GCP as familiar cloud providers and drops Oracle', () => {
    expect(inCat('cloud')).toEqual(['gcp', 'hetzner', 'private-data-centers']);
    for (const id of ['gcp', 'hetzner']) expect(skills.find((s) => s.id === id)!.level, id).toBe('familiar');
    expect(skills.find((s) => s.id === 'oracle-cloud')).toBeUndefined();
  });

  it('adds Cloudflare and PII redaction to security, chat widgets to front end', () => {
    expect(inCat('security')).toContain('cloudflare');
    expect(inCat('security')).toContain('pii-redaction');
    expect(inCat('frontend')).toContain('chat-widgets');
  });

  it('marks at most 12 skills as expert, FastAPI among them', () => {
    expect(skills.filter((s) => s.level === 'expert').length).toBeLessThanOrEqual(12);
    expect(level('fastapi')).toBe('expert');
    expect(skills.filter((s) => s.level === 'daily')).toEqual([]);
  });

  it('marks tools used lightly as familiar', () => {
    for (const id of ['terraform', 'prometheus', 'grafana', 'gcp', 'robot-framework', 'neo4j', 'deepeval', 'giskard', 'argocd', 'ollama', 'clickhouse']) expect(level(id), id).toBe('familiar');
  });

  it('points every evidence id at a real project, role or open-source entry', () => {
    for (const s of skills) for (const e of s.evidence ?? []) expect(KNOWN.has(e), `${s.id}: ${e}`).toBe(true);
  });

  it('uses evidence that matches the work, not a copied list', () => {
    expect(skills.find((s) => s.id === 'nllb-200')!.evidence).toEqual(['translator']);
    for (const id of ['duckling', 'botpress']) expect(skills.find((s) => s.id === id)!.evidence, id).toContain('qalqul');
  });
});
