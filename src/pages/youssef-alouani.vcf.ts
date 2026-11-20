import type { APIContext } from 'astro';
import { profile } from '../data/profile';
import { buildVcard } from '../lib/vcard';

export function GET({ site }: APIContext) {
  return new Response(buildVcard(profile, site!.origin), {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="youssef-alouani.vcf"',
    },
  });
}
