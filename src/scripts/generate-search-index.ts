import { getAllPosts } from '@/lib/api';
import fs from 'fs';
import path from 'path';

function generateSearchIndex() {
  const posts = getAllPosts();

  const index = posts.map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category || null,
  }));

  const filePath = path.join(process.cwd(), 'public', 'search.json');
  fs.writeFileSync(filePath, JSON.stringify(index, null, 2));
}

generateSearchIndex();
