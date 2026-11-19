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
];

describe('blog', () => {
  const doc = readHtml('/blog');
  it('lists the ten Medium posts with their dates and badges', () => {
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
    for (const t of tags) expect(exists(`${t}/index.html`), t).toBe(true);
  });
});
