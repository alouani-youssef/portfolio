import type { APIContext } from 'astro';
import { z } from 'astro/zod';
import { SITE } from '../../../data/site';
import { API_NAMES, API_SCHEMAS, type ApiName } from '../../../lib/api-schemas';

export function getStaticPaths() {
  return API_NAMES.map((name) => ({ params: { name } }));
}

export function GET({ params }: APIContext) {
  const schema = z.toJSONSchema(API_SCHEMAS[params.name as ApiName]);
  return new Response(JSON.stringify({ $id: `${SITE}/api/schema/${params.name}.json`, ...schema }, null, 2), {
    headers: { 'Content-Type': 'application/schema+json; charset=utf-8' },
  });
}
