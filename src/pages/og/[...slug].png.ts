import type { APIContext } from 'astro';
import { getOgPages, type OgPage } from '../../lib/og-pages';
import { renderOgPng } from '../../lib/og';

export async function getStaticPaths() {
  return (await getOgPages()).map((page) => ({ params: { slug: page.slug }, props: { page } }));
}

export async function GET({ props }: APIContext) {
  const png = await renderOgPng(props.page as OgPage);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
