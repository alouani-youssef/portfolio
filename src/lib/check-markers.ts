import { readdirSync, readFileSync } from 'node:fs';
import { checkMarkerViolations } from './metrics';

const SOURCES = ['src/content/projects/en', 'src/content/experience/en', 'src/content/blog/en', 'src/components/diagrams'];

/** CHECK markers in everything a production build publishes. Draft posts are skipped: they never ship. */
export function publishedCheckMarkers(): string[] {
  const files = SOURCES.flatMap((dir) =>
    readdirSync(dir)
      .filter((f) => /\.(mdx|astro)$/.test(f))
      .map((f) => ({ path: `${dir}/${f}`, text: readFileSync(`${dir}/${f}`, 'utf8') })),
  ).filter((f) => !/^draft:\s*true\s*$/m.test(f.text));
  return checkMarkerViolations(files);
}
