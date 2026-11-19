import { getCollection } from 'astro:content';
import { profile } from '../data/profile';
import { getRoles } from '../lib/experience';
import { buildResume } from '../lib/resume';

export async function GET() {
  const roles = (await getRoles()).map((r) => r.data);
  const skills = (await getCollection('skills')).map((s) => s.data);
  const recs = (await getCollection('recommendations')).map((r) => r.data);
  return new Response(JSON.stringify(buildResume(profile, roles, skills, recs), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
