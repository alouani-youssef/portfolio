import { readFileSync, readdirSync } from 'node:fs';
import { publishedCheckMarkers } from '../../src/lib/check-markers';
import { describe, it, expect } from 'vitest';

// Claims the public code contradicts must not ship at all.
const FORBIDDEN: Record<string, string[]> = {
  'src/components/diagrams/ArchioDiagram.astro': ['hot path'],
  'src/components/diagrams/FinamazeKycDiagram.astro': ['custodian'],
  'src/content/projects/en/osoul-ai-assistant.mdx': ['keycloak', 'the draft expires after 31 minutes'],
  'src/content/projects/en/osoul-table-sessions.mdx': ['redis', 'keycloak'],
  'src/content/projects/en/osoul-recommendations.mdx': ['embeddings'],
};

describe('claims contradicted by the source are absent', () => {
  for (const [file, phrases] of Object.entries(FORBIDDEN)) {
    for (const phrase of phrases) {
      it(`${file}: no "${phrase}"`, () => expect(readFileSync(file, 'utf8')).not.toContain(phrase));
    }
  }
});

describe('every published claim is confirmed', () => {
  it('no CHECK markers remain outside draft posts', () => {
    expect(publishedCheckMarkers()).toEqual([]);
  });
  it('no placeholder metrics remain', () => {
    for (const f of readdirSync('src/content/projects/en')) expect(readFileSync(`src/content/projects/en/${f}`, 'utf8'), f).not.toContain('placeholder: true');
  });
});
