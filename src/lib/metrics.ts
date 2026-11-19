import { entrySlug } from './i18n';

export function isPreview(): boolean {
  return import.meta.env.PUBLIC_PREVIEW === 'true';
}

type WithMetrics = { id: string; data: { metrics: Array<{ label: string; placeholder: boolean }> } };

/** One "<slug>: <label>" line per metric that is still a placeholder. */
export function placeholderViolations(projects: WithMetrics[]): string[] {
  return projects.flatMap((p) => p.data.metrics.filter((m) => m.placeholder).map((m) => `${entrySlug(p.id)}: ${m.label}`));
}
