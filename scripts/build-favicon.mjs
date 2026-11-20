// Builds the favicons from the portrait: a circular tab icon (.ico + PNG) and a square Apple touch icon.
// Run: node scripts/build-favicon.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const SRC = 'docs/media/personal_picture.jpg';
/** Square around the face, in source pixels (after EXIF rotation). */
const FACE = { left: 1700, top: 1880, width: 1030, height: 1030 };

const face = (size) => sharp(SRC).rotate().extract(FACE).resize(size, size);
const circle = (size) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);
const round = (size) => face(size).composite([{ input: circle(size), blend: 'dest-in' }]).png({ compressionLevel: 9 }).toBuffer();

/** ICO file whose entries are PNGs (supported by every current browser). */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const dir = pngs.map(({ size, buf }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    return e;
  });
  return Buffer.concat([header, ...dir, ...pngs.map((p) => p.buf)]);
}

const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map(async (size) => ({ size, buf: await round(size) })));
writeFileSync('public/favicon.ico', ico(pngs));
writeFileSync('public/favicon-96.png', await round(96));
await face(180).flatten({ background: '#0E0F11' }).png({ compressionLevel: 9 }).toFile('public/apple-touch-icon.png');
console.log('favicon.ico, favicon-96.png, apple-touch-icon.png written to public/');
