import { getAllPosts } from './api';

export function getSearchIndex() {
  return getAllPosts().map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
  }));
}
