/** Initials for the monogram avatar: first and last name, e.g. "Mohammad Al-Ahmad" → "MA". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** Stable OKLCH hue per person, so an avatar keeps its colour across builds. */
export function avatarHue(name: string): number {
  return [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 11) % 360;
}

/** Split a quote around its highlight so the page can wrap it in <mark>. */
export function splitHighlight(quote: string, highlight?: string): [string, string, string] {
  const i = highlight ? quote.indexOf(highlight) : -1;
  if (i < 0) return [quote, '', ''];
  return [quote.slice(0, i), highlight!, quote.slice(i + highlight!.length)];
}

export const KIND_LABELS = { manager: 'Manager', peer: 'Teammate', report: 'Reported to me', client: 'Client' } as const;
