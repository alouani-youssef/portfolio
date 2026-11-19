import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

// Claims inferred during the build (not in the content spec) must stay flagged for Youssef's review.
const FLAGGED: Record<string, string[]> = {
  'src/content/projects/en/saudi-stt.mdx': [
    'Saudi Arabic mixed with English product terms',
    'narrow-band Asterisk recordings',
    'could not go to a third-party speech API',
    'latency matters as much as accuracy',
    'Hosted APIs were weaker on Saudi dialect',
  ],
  'src/content/projects/en/customer-voice.mdx': [
    'quicker for the first consumer and wrong for the fifth',
  ],
  'src/content/projects/en/finamaze-kyc.mdx': [
    'to the cent',
    'not at month end',
    '<FinamazeKycDiagram>',
  ],
  'src/components/diagrams/FinamazeKycDiagram.astro': [
    'import LayerDiagram',
  ],
  'src/components/diagrams/OsoulAssistantDiagram.astro': ['import LayerDiagram'],
  'src/components/diagrams/OsoulRecommendationsDiagram.astro': ['import LayerDiagram'],
  'src/components/diagrams/OsoulTableSessionsDiagram.astro': ['import LayerDiagram'],
  'src/content/projects/en/osoul-ai-assistant.mdx': ['<OsoulAssistantDiagram>'],
  'src/content/projects/en/osoul-recommendations.mdx': ['<OsoulRecommendationsDiagram>', 'and so does part of the ticket'],
  'src/content/projects/en/osoul-table-sessions.mdx': ['<OsoulTableSessionsDiagram>', 'One session, two views', "sees each table's session"],
};

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

describe('inferred claims carry CHECK markers', () => {
  for (const [file, phrases] of Object.entries(FLAGGED)) {
    const lines = readFileSync(file, 'utf8').split('\n');
    for (const phrase of phrases) {
      it(`${file}: "${phrase}"`, () => {
        const line = lines.find((l) => l.includes(phrase));
        expect(line, phrase).toBeDefined();
        expect(line).toContain('CHECK');
      });
    }
  }
});
