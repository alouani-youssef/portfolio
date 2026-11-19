import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
const font = (weight: 400 | 600) => readFileSync(require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`));
let fonts: Array<{ name: string; data: Buffer; weight: 400 | 600; style: 'normal' }> | undefined;

/** 1200×630 Open Graph card in the site's light theme. */
export async function renderOgPng({ title, subtitle }: { title: string; subtitle?: string }): Promise<Buffer> {
  fonts ??= [
    { name: 'Inter', data: font(400), weight: 400, style: 'normal' },
    { name: 'Inter', data: font(600), weight: 600, style: 'normal' },
  ];
  const el = (type: string, style: Record<string, unknown>, children: unknown) => ({ type, props: { style, children } });
  const tree = el(
    'div',
    { width: '1200px', height: '630px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px', boxSizing: 'border-box', background: '#fafaf9', color: '#111214', fontFamily: 'Inter' },
    [
      el('div', { display: 'flex', fontSize: 26, color: '#5b5f66', letterSpacing: '0.04em' }, 'YOUSSEF ALOUANI'),
      el('div', { display: 'flex', flexDirection: 'column', width: '1056px' }, [
        el('div', { display: 'flex', width: '96px', height: '4px', background: '#2b4c7e', marginBottom: '32px' }, ''),
        el('div', { display: 'flex', width: '1056px', fontSize: title.length > 48 ? 56 : 68, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em' }, title),
        ...(subtitle ? [el('div', { display: 'flex', width: '1056px', marginTop: '24px', fontSize: 28, color: '#5b5f66', lineHeight: 1.35 }, subtitle)] : []),
      ]),
      el('div', { display: 'flex', fontSize: 24, color: '#5b5f66' }, 'youssefalouani.com'),
    ],
  );
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
