import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';

export const DIST = join(process.cwd(), 'dist');

export function exists(file: string): boolean {
  return existsSync(join(DIST, file.replace(/^\//, '')));
}

export function readText(file: string): string {
  return readFileSync(join(DIST, file.replace(/^\//, '')), 'utf8');
}

function htmlFileFor(route: string): string {
  const clean = route.replace(/^\/|\/$/g, '');
  return clean === '' ? 'index.html' : `${clean}.html`;
}

export function readHtml(route: string): HTMLElement {
  return parse(readText(htmlFileFor(route)), { comment: false });
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** Routes of every page under dist/ (e.g. '/', '/about', '/projects/osoul'); build format is 'file'. */
export function listHtmlPages(): string[] {
  return walk(DIST)
    .filter((f) => f.endsWith('.html'))
    .map((f) => {
      const rel = relative(DIST, f).split(sep).join('/').replace(/\.html$/, '');
      return rel === 'index' ? '/' : `/${rel}`;
    })
    .filter((r) => !r.startsWith('/pagefind') && !r.startsWith('/og'))
    .sort();
}
