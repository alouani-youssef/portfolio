import { buildTwins } from '../lib/twins';
import { buildLlmsFull } from '../lib/llms';

const ORDER = ['/index.md', '/about.md', '/experience.md'];

export async function GET() {
  const twins = await buildTwins();
  const pick = twins.filter((t) => ORDER.includes(t.path) || t.path.startsWith('/experience/') || t.path.startsWith('/projects/') || t.path === '/blog.md' || t.path.startsWith('/blog/'));
  pick.sort((a, b) => {
    const rank = (p: string) => (ORDER.includes(p) ? ORDER.indexOf(p) : p.startsWith('/experience/') ? 3 : p.startsWith('/projects/') ? 4 : 5);
    return rank(a.path) - rank(b.path);
  });
  return new Response(buildLlmsFull(pick), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
