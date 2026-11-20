// Builds one unique 16:9 cover per project into src/assets/projects/covers/.
// Sources are redacted screenshots in src/assets, gallery images in docs/galery, or generated SVG diagrams.
// Run: npm run covers
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'src/assets/projects/covers');
const W = 1600;
const H = 900;
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

/** Fit an image into the 16:9 frame: `cover` fills (cropping from the top), `contain` pads with `bg`. */
async function frame(input, { fit = 'contain', bg = WHITE, extract, pad = 0 } = {}) {
  let img = sharp(resolve(ROOT, input));
  if (extract) img = img.extract(extract);
  if (fit === 'cover') return img.resize(W, H, { fit: 'cover', position: 'top' });
  const inner = await img.resize(W - pad * 2, H - pad * 2, { fit: 'inside' }).toBuffer();
  return sharp({ create: { width: W, height: H, channels: 4, background: bg } }).composite([{ input: inner, gravity: 'center' }]);
}

/** Phone screenshots side by side on a soft background. */
async function phones(inputs, bg) {
  const h = H - 120;
  const shots = await Promise.all(inputs.map((i) => sharp(resolve(ROOT, i)).resize({ height: h }).toBuffer({ resolveWithObject: true })));
  const gap = 48;
  const total = shots.reduce((n, s) => n + s.info.width, 0) + gap * (shots.length - 1);
  let x = Math.round((W - total) / 2);
  const layers = shots.map((s) => { const l = { input: s.data, left: x, top: 60 }; x += s.info.width + gap; return l; });
  return sharp({ create: { width: W, height: H, channels: 4, background: bg } }).composite(layers);
}

const FONT = 'Helvetica, Arial, sans-serif';
const box = (x, y, w, h, label, sub, accent = false) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${accent ? '#1d4ed8' : '#ffffff'}" stroke="${accent ? '#1d4ed8' : '#cbd5e1'}" stroke-width="3"/>
  <text x="${x + w / 2}" y="${y + h / 2 + (sub ? -6 : 12)}" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="600" fill="${accent ? '#ffffff' : '#0f172a'}">${label}</text>
  ${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 34}" text-anchor="middle" font-family="${FONT}" font-size="24" fill="${accent ? '#dbeafe' : '#64748b'}">${sub}</text>` : ''}`;
const arrow = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#94a3b8" stroke-width="4" marker-end="url(#a)"/>`;
const svg = (title, body) => sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#94a3b8"/></marker>
  <pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#e2e8f0"/></pattern></defs>
  <rect width="${W}" height="${H}" fill="#f8fafc"/><rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="80" y="120" font-family="${FONT}" font-size="52" font-weight="700" fill="#0f172a">${title}</text>
  ${body}</svg>`));

const botpress = svg('Bots and agents in one conversation', `
  <rect x="80" y="200" width="620" height="620" rx="28" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
  <rect x="120" y="250" width="420" height="90" rx="24" fill="#e2e8f0"/><text x="150" y="307" font-family="${FONT}" font-size="30" fill="#0f172a">Bonjour, ma carte est bloquée</text>
  <rect x="240" y="370" width="420" height="90" rx="24" fill="#1d4ed8"/><text x="270" y="427" font-family="${FONT}" font-size="30" fill="#ffffff">Bot: je vérifie votre carte…</text>
  <rect x="120" y="490" width="420" height="90" rx="24" fill="#e2e8f0"/><text x="150" y="547" font-family="${FONT}" font-size="30" fill="#0f172a">Je veux parler à quelqu'un</text>
  <rect x="240" y="610" width="420" height="90" rx="24" fill="#0f766e"/><text x="270" y="667" font-family="${FONT}" font-size="30" fill="#ffffff">Agent: je reprends la suite</text>
  <text x="120" y="780" font-family="${FONT}" font-size="24" fill="#64748b">Hand-off with the full history</text>
  ${box(860, 230, 640, 130, 'Qalqul conversation layer', 'widgets · SDKs · channels')}
  ${arrow(1180, 360, 1010, 470)}${arrow(1180, 360, 1350, 470)}
  ${box(820, 480, 360, 140, 'Botpress v12', 'bots · NLU', true)}${box(1220, 480, 300, 140, 'Agent queue', 'hand-off')}
  ${box(860, 690, 640, 110, 'Contact profile · tickets')}`);

const chatbots = svg('Public chatbots, three engines', `
  ${box(80, 230, 400, 120, 'Web chat widget')}${box(80, 400, 400, 120, 'Mobile SDKs')}${box(80, 570, 400, 120, 'WhatsApp · channels')}
  ${arrow(480, 290, 600, 440)}${arrow(480, 460, 600, 460)}${arrow(480, 630, 600, 480)}
  ${box(610, 360, 420, 200, 'Bot gateway', 'auth · rate limits · PII', true)}
  ${arrow(1030, 420, 1130, 300)}${arrow(1030, 460, 1130, 460)}${arrow(1030, 500, 1130, 620)}
  ${box(1140, 240, 380, 120, 'Botpress')}${box(1140, 400, 380, 120, 'Rasa')}${box(1140, 560, 380, 120, 'In-house engine')}
  <text x="80" y="800" font-family="${FONT}" font-size="28" fill="#64748b">One secured entry point, the right engine behind it, hand-off to agents</text>`);

const ent = (x, w, label, tag, color) => `<rect x="${x}" y="300" width="${w}" height="90" rx="14" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="3"/>
  <text x="${x + w / 2}" y="358" text-anchor="middle" font-family="${FONT}" font-size="40" fill="#0f172a">${label}</text>
  <text x="${x + w / 2}" y="440" text-anchor="middle" font-family="${FONT}" font-size="26" font-weight="600" fill="${color}">${tag}</text>`;
const nlu = svg('Classical NLU: intents and entities', `
  <text x="80" y="230" font-family="${FONT}" font-size="28" fill="#64748b">Message (Darija · French)</text>
  ${ent(80, 330, 'bghit nbloki', 'intent: block_card', '#1d4ed8')}${ent(440, 230, 'la carte', 'entity: product', '#0f766e')}
  ${ent(700, 200, 'dyali', '', '#94a3b8')}${ent(930, 240, 'ghedda', 'date: tomorrow', '#b45309')}${ent(1200, 320, '3 000 dh', 'amount: 3000 MAD', '#7c3aed')}
  ${box(80, 560, 420, 140, 'Normalisation', 'scripts · spelling')}${arrow(500, 630, 580, 630)}
  ${box(590, 560, 420, 140, 'Intent classifier', 'trained per client', true)}${arrow(1010, 630, 1090, 630)}
  ${box(1100, 560, 420, 140, 'Duckling', 'dates · amounts · numbers')}`);

const key = (x, y, w, label, color) => `<rect x="${x}" y="${y}" width="${w}" height="64" rx="12" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="3"/>
  <text x="${x + w / 2}" y="${y + 42}" text-anchor="middle" font-family="${FONT}" font-size="28" fill="#0f172a">${label}</text>`;
const bucket = (x, label, items, accent) => `<rect x="${x}" y="560" width="300" height="260" rx="18" fill="${accent ? '#dbeafe' : '#ffffff'}" stroke="${accent ? '#1d4ed8' : '#cbd5e1'}" stroke-width="${accent ? 5 : 3}"/>
  <text x="${x + 150}" y="605" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="600" fill="${accent ? '#1d4ed8' : '#64748b'}">${label}</text>
  ${items.map((t, i) => `<text x="${x + 150}" y="${655 + i * 44}" text-anchor="middle" font-family="${FONT}" font-size="26" fill="#0f172a">${t}</text>`).join('')}`;
const search = svg('Segmentation, like a hash table', `
  ${box(80, 190, 360, 120, 'New job', 'typed fields')}${arrow(440, 250, 520, 250)}
  ${key(530, 218, 230, 'AI Engineer', '#1d4ed8')}${key(770, 218, 150, 'Senior', '#0f766e')}${key(930, 218, 160, 'Remote', '#b45309')}${key(1100, 218, 90, 'EU', '#7c3aed')}
  <text x="1210" y="262" font-family="${FONT}" font-size="30" font-weight="600" fill="#0f172a">= segment key</text>
  <text x="530" y="350" font-family="${FONT}" font-size="26" fill="#64748b">hash(job) → one bucket, not a scan of every profile</text>
  ${arrow(800, 380, 800, 545)}
  ${bucket(80, 'backend · mid · onsite', ['profile 12', 'profile 40'], false)}${bucket(420, 'ios · junior · us', ['profile 7'], false)}
  ${bucket(760, 'ai-eng · senior · remote · eu', ['profile 3', 'profile 18', 'profile 25'], true)}${bucket(1100, 'data · lead · hybrid', ['profile 9', 'profile 31'], false)}
  <text x="760" y="860" font-family="${FONT}" font-size="24" fill="#1d4ed8">full check (answers · tech stack) only inside the bucket</text>`);

const COVERS = {
  chatbots: () => chatbots,
  '10xjobs-ingestion': () => frame('docs/galery/01_Data_Ingestion_Pipeline_What_Is_Data_Ingestion_Pipeline_82bab9ad91.png', { bg: { r: 44, g: 49, b: 56, alpha: 1 } }),
  '10xjobs-search': () => search,
  'osoul-multi-tenancy': () => frame('src/assets/projects/osoul/multi-tenant-platform.png', { pad: 50 }),
  'osoul-ai-assistant': () => frame('src/assets/projects/osoul/portal-dashboard.png', { extract: { left: 2600, top: 540, width: 840, height: 1230 }, bg: { r: 241, g: 245, b: 249, alpha: 1 }, pad: 40 }),
  'osoul-recommendations': () => phones(['src/assets/projects/osoul/guest-home.png', 'src/assets/projects/osoul/guest-pairings.png'], { r: 254, g: 243, b: 230, alpha: 1 }),
  'osoul-table-sessions': () => phones(['src/assets/projects/osoul/waiter-floors.png'], { r: 230, g: 240, b: 254, alpha: 1 }),
  'osoul-server-side-tracking': () => frame('docs/galery/server_side_tracking.jpeg'),
  'saudi-stt': () => frame('src/assets/projects/saudi-stt/live-transcript.png', { extract: { left: 1170, top: 228, width: 1855, height: 745 }, pad: 60 }),
  'sowtek-voip': () => frame('src/assets/projects/saudi-stt/live-transcript.png', { extract: { left: 15, top: 220, width: 1117, height: 1400 }, bg: { r: 233, g: 226, b: 250, alpha: 1 } }),
  'customer-voice': () => frame('docs/galery/rag_pipeline.png', { pad: 30 }),
  'ai-stones': () => frame('docs/galery/ai_stones.png', { pad: 80 }),
  archio: () => frame('docs/galery/archio.jpeg', { pad: 80 }),
  'finamaze-kyc': () => frame('src/assets/projects/finamaze-kyc/onboarding.png', { fit: 'cover' }),
  'finamaze-migration': () => frame('docs/galery/distrubted_systems.jpeg', { pad: 30 }),
  'sowtek-omnichannel-chat': () => frame('src/assets/experience/axelerated/inbox.jpeg', { fit: 'cover' }),
  'sowtek-flowbuilder': () => frame('src/assets/experience/axelerated/flowbuilder.jpeg', { fit: 'cover' }),
  'qalqul-botpress': () => botpress,
  'qalqul-nlu': () => nlu,
  'qalqul-realtime': () => frame('src/assets/experience/qalqul/tickets.png', { fit: 'cover' }),
};

mkdirSync(OUT, { recursive: true });
// `npm run covers -- <slug> …` builds only those covers; no arguments rebuilds all of them.
const only = process.argv.slice(2);
for (const [slug, make] of Object.entries(COVERS).filter(([s]) => only.length === 0 || only.includes(s))) {
  await (await make()).flatten({ background: '#ffffff' }).jpeg({ quality: 86, mozjpeg: true }).toFile(resolve(OUT, `${slug}.jpg`));
  console.log(`covers/${slug}.jpg`);
}
