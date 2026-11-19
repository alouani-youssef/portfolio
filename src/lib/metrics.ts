import { entrySlug } from './i18n';

/**
 * Preview mode: the dev server and `npm run build:preview`. Only a production build
 * (`npm run build`) hides drafts and refuses placeholder metrics.
 */
export function isPreview(env: { DEV?: boolean; PUBLIC_PREVIEW?: string } = import.meta.env): boolean {
  return env.DEV === true || env.PUBLIC_PREVIEW === 'true';
}

type WithMetrics = { id: string; data: { metrics: Array<{ label: string; placeholder: boolean }> } };

/** One "<slug>: <label>" line per metric that is still a placeholder. */
export function placeholderViolations(projects: WithMetrics[]): string[] {
  return projects.flatMap((p) => p.data.metrics.filter((m) => m.placeholder).map((m) => `${entrySlug(p.id)}: ${m.label}`));
}

/** One "<path>:<line>: <text>" entry per line still carrying a CHECK marker (an unconfirmed claim). */
export function checkMarkerViolations(files: Array<{ path: string; text: string }>): string[] {
  return files.flatMap(({ path, text }) =>
    text.split('\n').flatMap((line, i) => (line.includes('CHECK') ? [`${path}:${i + 1}: ${line.trim().slice(0, 120)}`] : [])),
  );
}
