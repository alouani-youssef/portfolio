import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { describe, it, expect } from 'vitest';
import { redact, MANIFEST } from '../../scripts/redact-media.mjs';

const SRC = 'docs/osoul/portal_dashboard.png';
const PAYLOAD = { left: 2660, top: 1400, width: 780, height: 115 };

/** Mean absolute difference between horizontally adjacent grey pixels: high for legible text, low once blurred. */
async function edgeEnergy(file: string, box: typeof PAYLOAD) {
  const { data, info } = await sharp(file).extract(box).greyscale().raw().toBuffer({ resolveWithObject: true });
  let sum = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 1; x < info.width; x++) sum += Math.abs(data[y * info.width + x] - data[y * info.width + x - 1]);
  }
  return sum / (info.height * (info.width - 1));
}

describe('redact', () => {
  it('blurs the boxes and leaves the rest of the image untouched', async () => {
    const out = join(mkdtempSync(join(tmpdir(), 'redact-')), 'out.png');
    await redact(SRC, out, [PAYLOAD]);

    expect(await edgeEnergy(out, PAYLOAD)).toBeLessThan((await edgeEnergy(SRC, PAYLOAD)) * 0.25);

    const corner = { left: 0, top: 0, width: 400, height: 400 };
    const a = await sharp(SRC).extract(corner).raw().toBuffer();
    const b = await sharp(out).extract(corner).raw().toBuffer();
    expect(b.equals(a)).toBe(true);
  });

  it('redacts the staff name and the assistant payload on the dashboard', () => {
    const entry = MANIFEST.find((m: { output: string }) => m.output.endsWith('osoul/portal-dashboard.png'));
    expect(entry!.boxes).toEqual([
      { left: 20, top: 1780, width: 490, height: 120 },
      { left: 2660, top: 1400, width: 780, height: 115 },
    ]);
  });
});
