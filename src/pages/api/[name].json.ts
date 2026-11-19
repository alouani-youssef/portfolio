import type { APIContext } from 'astro';
import { API_NAMES, API_SCHEMAS, type ApiName } from '../../lib/api-schemas';
import { buildApi } from '../../lib/api';

export function getStaticPaths() {
  return API_NAMES.map((name) => ({ params: { name } }));
}

export async function GET({ params }: APIContext) {
  const name = params.name as ApiName;
  const data = API_SCHEMAS[name].parse(await buildApi(name)); // fail the build on drift
  return new Response(JSON.stringify(data, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
