import type { Profile } from '../data/profile';

/** Public path of the downloadable contact card. */
export const VCARD_PATH = '/youssef-alouani.vcf';

/** Escapes a vCard text value (RFC 6350 §3.4). */
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

/** Folds a content line at 75 octets, continuation lines start with a space (RFC 6350 §3.2). */
function fold(line: string): string {
  const bytes = new TextEncoder();
  const out: string[] = [];
  let cur = '';
  for (const ch of line) {
    const limit = out.length === 0 ? 75 : 74;
    if (bytes.encode(cur + ch).length > limit) {
      out.push(cur);
      cur = ch;
    } else cur += ch;
  }
  out.push(cur);
  return out.join('\r\n ');
}

/** vCard 3.0, the version iOS, macOS, Android and Outlook all import. */
export function buildVcard(profile: Profile, site: string): string {
  const [given, ...rest] = profile.name.split(' ');
  const family = rest.join(' ');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(profile.name)}`,
    `TITLE:${esc(profile.jobTitle)}`,
    'ORG:Osoul',
    `EMAIL;TYPE=INTERNET,PREF:${profile.email}`,
    `URL;TYPE=WORK:${site}`,
    `ADR;TYPE=WORK:;;;${esc(profile.location.city)};;;Morocco`,
    `X-SOCIALPROFILE;TYPE=linkedin:${profile.links.linkedin}`,
    `X-SOCIALPROFILE;TYPE=github:${profile.links.github}`,
    `URL;TYPE=schedule:${profile.links.schedule}`,
    `NOTE:${esc(`${profile.oneLiner} Book a call: ${profile.links.schedule}`)}`,
    'END:VCARD',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
