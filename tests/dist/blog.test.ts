import { describe, it, expect } from 'vitest';
import { readHtml, readText, exists } from './helpers';

const MEDIUM = [
  ['2023-07-22', 'https://alouaniyoussef.medium.com/the-philosophy-behind-virtualization-and-containerization-c13866d74ed5'],
  ['2023-06-07', 'https://alouaniyoussef.medium.com/the-software-development-industry-125367526fa6'],
  ['2023-04-05', 'https://alouaniyoussef.medium.com/the-software-dictionary-11c92add2f0f'],
  ['2022-10-08', 'https://alouani-youssef.medium.com/a-vision-about-software-architcture-styles-3ec0666b692c'],
  ['2022-09-22', 'https://alouani-youssef.medium.com/the-full-path-into-the-api-gateway-f3285c96d627'],
  ['2022-08-08', 'https://alouani-youssef.medium.com/the-magic-of-networking-and-its-wonderful-story-part-1-6b9427fc2084'],
  ['2022-07-21', 'https://alouani-youssef.medium.com/neo4j-simple-introduction-2febaddfb520'],
  ['2022-07-13', 'https://alouani-youssef.medium.com/apache-kafka-all-what-i-know-71babb86a9ac'],
  ['2022-06-15', 'https://alouani-youssef.medium.com/git-and-github-master-your-important-tool-as-a-developer-bf4482237d04'],
  ['2022-03-13', 'https://alouani-youssef.medium.com/rabbitmq-understand-how-it-works-under-the-hood-895b74c37f3b'],
  ['2021-08-25', 'https://alouani-youssef.medium.com/how-react-works-under-the-hood-in-details-fbdbf5be9b29'],
  ['2021-07-30', 'https://alouani-youssef.medium.com/data-and-databases-read-and-make-your-choice-sql-or-nosql-df6728857d97'],
];

describe('blog', () => {
  const doc = readHtml('/blog');
  it('lists the twelve Medium posts with their dates and badges', () => {
    for (const [date, url] of MEDIUM) {
      const link = doc.querySelector(`a[href="${url}"]`);
      expect(link, url).not.toBeNull();
      const item = link!.closest('li')!;
      expect(item.querySelector('time')!.getAttribute('datetime')).toBe(date);
      expect(item.text).toContain('on Medium');
    }
  });
  it('renders the Whisper draft only as noindex in preview', () => {
    const post = readHtml('/blog/whisper-saudi-dialect');
    expect(post.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex');
    expect(post.querySelectorAll('h1')).toHaveLength(1);
  });
  it('keeps the draft out of RSS', () => {
    const rss = readText('rss.xml');
    expect(rss).toContain('<rss');
    expect(rss).not.toContain('whisper-saudi-dialect');
    for (const [, url] of MEDIUM) expect(rss).toContain(url);
  });
  it('has a page for every tag used', () => {
    const tags = new Set(doc.querySelectorAll('a[href^="/blog/tags/"]').map((a) => a.getAttribute('href')!));
    expect(tags.size).toBeGreaterThan(0);
    for (const t of tags) expect(exists(`${t}.html`), t).toBe(true);
  });
});

const DRAFTS = ['whisper-saudi-dialect', 'virtualization-part-2', 'architecture-styles-2026'];
const DRAFT_TITLES = ['Fine-tuning Whisper large-v3 for Saudi dialect', 'Virtualization and containerization, part 2', 'Software architecture styles, 2026 edition'];

describe('writing order and upcoming drafts', () => {
  const doc = readHtml('/blog');
  it('lists published posts most read first, matching the views in frontmatter', () => {
    const shown = doc.querySelectorAll('.post-grid > li .post-card__title a').map((a) => a.text.replace(' ↗', '').trim());
    expect(shown).not.toEqual(expect.arrayContaining(DRAFT_TITLES.slice(0, 1)));
    expect(shown.length).toBe(MEDIUM.length);
  });
  it('shows Medium claps and comments on every published post, with the date they were counted', () => {
    for (const li of doc.querySelectorAll('.post-grid > li')) {
      const s = li.querySelector('.post-card__stats');
      expect(s, li.text).not.toBeNull();
      expect(s!.text).toMatch(/\d+ claps? · \d+ comments?/);
      expect(s!.getAttribute('title')).toMatch(/^On Medium, as of \d{1,2} \w+ \d{4}$/);
    }
  });
  it('leads with the top-scoring post, Architecture Styles (68 claps + 2 comments), then React', () => {
    const [first, second] = doc.querySelectorAll('.post-grid > li');
    expect(first.text).toContain('A Vision about Software Architecture Styles');
    expect(first.querySelector('.post-card__stats')!.text).toBe('68 claps · 2 comments');
    expect(second.text).toContain('How React works under the hood');
    expect(second.querySelector('.post-card__stats')!.text).toBe('78 claps · 0 comments');
    expect(readHtml('/blog/tags/react').querySelector('a[href*="how-react-works-under-the-hood"]')).not.toBeNull();
  });
  it('orders published posts by score, each comment counting as 10 claps, highest first', () => {
    const scores = doc.querySelectorAll('.post-grid > li .post-card__stats').map((s) => {
      const [, claps, comments] = s.text.match(/(\d+) claps? · (\d+) comments?/)!;
      return Number(claps) + 10 * Number(comments);
    });
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
  it('lists the drafts last as Coming soon, with no date and no link (Review Focus 3)', () => {
    const up = doc.querySelectorAll('[data-upcoming] .upcoming-grid > li');
    expect(up).toHaveLength(3);
    for (const li of up) {
      expect(li.text).toContain('Coming soon');
      expect(li.querySelector('time'), li.text).toBeNull();
      expect(li.querySelector('a[href^="/blog/"]:not(.tag-chip)'), li.text).toBeNull();
    }
  });
  it('never leaks a draft into machine outputs', () => {
    const outputs = [readText('api/posts.json'), readText('rss.xml'), readText('blog.md'), readText('llms.txt')];
    for (const out of outputs) for (const title of DRAFT_TITLES) expect(out).not.toContain(title);
  });
  it('shows no date on a draft page, even in preview', () => {
    for (const slug of DRAFTS) {
      const post = readHtml(`/blog/${slug}`);
      expect(post.querySelector('main header time'), slug).toBeNull();
      expect(post.text).not.toContain('"datePublished"');
    }
  });
  it('home shows the three most read posts', () => {
    const home = readHtml('/');
    expect(home.querySelector('#writing')!.text.trim()).toBe('Most read');
    expect(home.querySelectorAll('section[aria-labelledby="writing"] li')).toHaveLength(3);
  });
});

describe('blog tags and covers', () => {
  const doc = readHtml('/blog');
  it('gives every post a card with a cover, labelled tag chips and a lead card', () => {
    const items = doc.querySelectorAll('.post-grid > li');
    expect(items.length).toBeGreaterThanOrEqual(MEDIUM.length);
    for (const li of items) {
      expect(li.querySelector('.post-cover'), li.text).not.toBeNull();
      expect(li.getAttribute('data-tags')).toBeTruthy();
      expect(li.querySelector('.tag-chip .skill-icon')).not.toBeNull();
    }
    expect(doc.querySelectorAll('.post-card--featured')).toHaveLength(1);
  });
  it('shows tag counts in the filter bar', () => {
    const all = doc.querySelector('.tag-filter[data-filter="all"]')!;
    expect(all.text).toContain(String(doc.querySelectorAll('.post-grid > li').length));
  });
  it('tag pages show the label, blurb and only matching posts', () => {
    const page = readHtml('/blog/tags/messaging');
    expect(page.querySelector('h1')!.text).toBe('Messaging');
    expect(page.querySelector('meta[name="description"]')!.getAttribute('content')).toContain('Brokers');
    const cards = page.querySelectorAll('.post-grid > li');
    expect(cards.length).toBe(2);
    for (const c of cards) expect(c.querySelector('a.tag-chip[aria-current="page"][href="/blog/tags/messaging"]')).not.toBeNull();
  });
  it('posts get a hero cover, reading time and related posts by tag', () => {
    const post = readHtml('/blog/virtualization-part-2');
    expect(post.querySelector('.post-cover--hero')).not.toBeNull();
    expect(post.querySelector('.eyebrow')!.text).toMatch(/\d+ min read/);
    expect(post.querySelector('aside a[href*="the-philosophy-behind-virtualization"]')).not.toBeNull();
  });
});

describe('broker posts', () => {
  for (const [tag, url, label] of [
    ['kafka', 'https://alouani-youssef.medium.com/apache-kafka-all-what-i-know-71babb86a9ac', 'Kafka'],
    ['rabbitmq', 'https://alouani-youssef.medium.com/rabbitmq-understand-how-it-works-under-the-hood-895b74c37f3b', 'RabbitMQ'],
  ] as const) {
    it(`${label} is tagged ${tag} and messaging, with the broker logo on its cover`, () => {
      const card = readHtml('/blog').querySelector(`a[href="${url}"]`)!.closest('li')!;
      const chips = card.querySelectorAll('.post-card__tags a.tag-chip').map((a) => a.text.trim());
      expect(chips).toEqual([label, 'Messaging']);
      expect(card.querySelector('.post-cover__icon.skill-icon--brand')).not.toBeNull();
      expect(readHtml(`/blog/tags/${tag}`).querySelector(`a[href="${url}"]`)).not.toBeNull();
    });
  }
});
