/** The six areas the site is organised around: expertise cards, the /projects filter and each case study's `focus`. */
export const FOCUS_AREAS = [
  { id: 'agentic', title: 'Agentic systems & AI harnesses' },
  { id: 'nlp', title: 'NLP / NLU' },
  { id: 'ml', title: 'ML / DL & speech' },
  { id: 'recsys', title: 'Recommendation systems' },
  { id: 'etl', title: 'Data pipelines & ETL' },
  { id: 'backend', title: 'Backend & platform' },
] as const;

export type FocusId = (typeof FOCUS_AREAS)[number]['id'];
export const FOCUS_IDS = FOCUS_AREAS.map((a) => a.id) as [FocusId, ...FocusId[]];

export function focusTitle(id: FocusId): string {
  return FOCUS_AREAS.find((a) => a.id === id)!.title;
}
