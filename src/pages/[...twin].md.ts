import type { APIContext } from 'astro';
import { buildTwins } from '../lib/twins';

export async function getStaticPaths() {
  const twins = await buildTwins();
  return twins.map((t) => ({ params: { twin: t.path.replace(/^\//, '').replace(/\.md$/, '') }, props: { markdown: t.markdown } }));
}

export function GET({ props }: APIContext) {
  return new Response(props.markdown as string, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
