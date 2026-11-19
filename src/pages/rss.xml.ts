import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/post-queries';
import { entrySlug } from '../lib/i18n';

export async function GET(context: APIContext) {
  const posts = await getPosts(false);
  return rss({
    title: 'Youssef Alouani',
    description: 'Writing on backend architecture, RAG, MCP and speech-to-text.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: p.data.external?.url ?? `/blog/${entrySlug(p.id)}`,
      categories: p.data.tags,
    })),
  });
}
