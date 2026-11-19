// Copies case-study screenshots from docs/ into src/assets/projects/, blurring personal data.
// Originals in docs/ are never modified. Run: npm run media
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Boxes are in original pixels: { left, top, width, height }. */
export const MANIFEST = [
  {
    input: 'docs/osoul/portal_dashboard.png',
    output: 'src/assets/projects/osoul/portal-dashboard.png',
    boxes: [
      { left: 20, top: 1780, width: 490, height: 120 }, // staff member's name and role
      { left: 2660, top: 1400, width: 780, height: 115 }, // assistant payload with guest phone number
    ],
  },
  { input: 'docs/osoul/recommendations.png', output: 'src/assets/projects/osoul/guest-home.png', boxes: [] },
  { input: 'docs/osoul/dish_paring.png', output: 'src/assets/projects/osoul/guest-pairings.png', boxes: [] },
  { input: 'docs/osoul/mobile_app.png', output: 'src/assets/projects/osoul/waiter-floors.png', boxes: [] },
  { input: 'docs/sowtek/saudi_dialect.png', output: 'src/assets/projects/saudi-stt/live-transcript.png', boxes: [] },
];

export async function redact(input, output, boxes) {
  mkdirSync(dirname(output), { recursive: true });
  const base = sharp(input);
  const overlays = await Promise.all(
    boxes.map(async (box) => ({
      input: await sharp(input).extract(box).blur(24).toBuffer(),
      left: box.left,
      top: box.top,
    })),
  );
  await base.composite(overlays).png().toFile(output);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const m of MANIFEST) {
    await redact(resolve(ROOT, m.input), resolve(ROOT, m.output), m.boxes);
    console.log(`${m.output}${m.boxes.length ? ` (${m.boxes.length} redacted)` : ''}`);
  }
}
