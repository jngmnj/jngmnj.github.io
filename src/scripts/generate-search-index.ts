import { getAllPosts, getAllShorts } from '@/lib/api';
import fs from 'fs';
import path from 'path';

function generateSearchIndex() {
  const posts = getAllPosts();
  const shorts = getAllShorts();

  const postsIndex = posts.map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category || null,
    type: 'post',
  }));

  const shortsIndex = shorts.map((short) => ({
    title: '',
    slug: `tech-bytes/${short.slug}`,
    excerpt: short.content.slice(0, 200),
    category: short.tags?.[0] || 'tech-bytes',
    type: 'short',
  }));

  const index = [...postsIndex, ...shortsIndex];

  const filePath = path.join(process.cwd(), 'public', 'search.json');
  fs.writeFileSync(filePath, JSON.stringify(index, null, 2));
}

generateSearchIndex();
