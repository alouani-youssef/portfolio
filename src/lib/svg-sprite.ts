const SVG = /<svg\b([^>]*)>([\s\S]*?)<\/svg>/g;
const CID = / data-astro-cid-[a-z0-9]+(="[^"]*")?/g;
/** Below this, a <use> reference saves too little to be worth it. */
const MIN_BYTES = 200;

/**
 * Moves SVG bodies that repeat on a page into one hidden sprite of <symbol>s and
 * points each copy at it with <use>. Each copy keeps its own attributes (class, size,
 * aria), so styling and accessibility are unchanged. SVGs that declare ids
 * (patterns, gradients) or nest other SVGs are left alone: ids must stay unique.
 */
export function dedupeSvgs(html: string): string {
  const counts = new Map<string, number>();
  for (const [, , inner] of html.matchAll(SVG)) {
    const key = inner.replace(CID, '');
    if (eligible(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const ids = new Map<string, string>();
  const symbols: string[] = [];
  const out = html.replace(SVG, (whole, attrs: string, inner: string) => {
    const key = inner.replace(CID, '');
    if ((counts.get(key) ?? 0) < 2) return whole;
    let id = ids.get(key);
    if (!id) {
      id = `svg-s${ids.size}`;
      ids.set(key, id);
      const viewBox = attrs.match(/\sviewBox="([^"]*)"/)?.[1];
      symbols.push(`<symbol id="${id}"${viewBox ? ` viewBox="${viewBox}"` : ''}>${key}</symbol>`);
    }
    return `<svg${attrs}><use href="#${id}"/></svg>`;
  });
  if (symbols.length === 0) return html;
  const sprite = `<svg aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">${symbols.join('')}</svg>`;
  return out.replace(/<body\b[^>]*>/, (body) => body + sprite);
}

function eligible(inner: string): boolean {
  return inner.length >= MIN_BYTES && !inner.includes('<svg') && !inner.includes('<use') && !/\sid="/.test(inner);
}
