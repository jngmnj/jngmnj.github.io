export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage?: string;
  category: string;
  excerpt: string;
  ogImage?: {
    url: string;
  };
  content: string;
  preview?: boolean;
};
