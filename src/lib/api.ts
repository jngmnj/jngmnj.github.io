import { Bytes } from '@/interfaces/bytes';
import { Post } from '@/interfaces/post';
import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

const postsDirectory = join(process.cwd(), '_posts');
const shortsDirectory = join(process.cwd(), '_bytes');

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));
}

export function getShortSlugs() {
  if (!fs.existsSync(shortsDirectory)) return [];
  return fs.readdirSync(shortsDirectory).filter((file) => file.endsWith('.md'));
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const decodedSlug = decodeURIComponent(realSlug);
  const fullPath = join(postsDirectory, `${decodedSlug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`❌ Post not found: ${decodedSlug}.md`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { ...data, slug: decodedSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getShortBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const decodedSlug = decodeURIComponent(realSlug);
  const fullPath = join(shortsDirectory, `${decodedSlug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`❌ Short not found: ${decodedSlug}.md`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { ...data, slug: decodedSlug, content } as Bytes;
}

export function getAllShorts(): Bytes[] {
  const slugs = getShortSlugs();
  const shorts = slugs
    .map((slug) => getShortBySlug(slug))
    // sort shorts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return shorts;
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter((post) => post.category === category);
}

export function getAllCategories() {
  const posts = getAllPosts();
  const categories = posts.map((post) => post.category);
  return Array.from(new Set(categories));
}

export const fetchPostChunk = async ({ pageParam = 1 }) => {
  const res = await fetch(`/data/bytes/posts-${pageParam}.json`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};
