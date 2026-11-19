/** Route → its Markdown twin URL. */
export function twinHref(path: string): string {
  return path === '/' ? '/index.md' : `${path.replace(/\/$/, '')}.md`;
}

/**
 * Turn an MDX body into plain Markdown for agents: drops import/export lines, component
 * tags, MDX comments and HTML tags (keeping their text); leaves fenced code untouched.
 */
export function mdxToMarkdown(body: string): string {
  const out: string[] = [];
  let inFence = false;
  let htmlDepth = 0; // inside a raw HTML block, where indentation is layout, not Markdown
  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    if (/^\s*(import|export)\s/.test(line)) continue;
    if (/^\s*<\/?[A-Z][\w.]*(\s[^>]*)?\/?>\s*$/.test(line)) continue; // component open/close/self-closing
    if (/^\s*<\/?(details|summary)\b[^>]*>.*$/.test(line) && !/[^<>]*<\/summary>\s*\S/.test(line)) continue;
    const opens = (line.match(/<(p|div|section|figure)\b[^>]*>/g) ?? []).length;
    const closes = (line.match(/<\/(p|div|section|figure)>/g) ?? []).length;
    let cleaned = line
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+$/, '');
    if (htmlDepth > 0 || opens > 0) cleaned = cleaned.trimStart();
    htmlDepth = Math.max(0, htmlDepth + opens - closes);
    out.push(cleaned);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
