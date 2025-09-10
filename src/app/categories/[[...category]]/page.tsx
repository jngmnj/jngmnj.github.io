import Categories from '@/app/_components/categories';
import Container from '@/app/_components/container';
import { PostList } from '@/app/_components/post-list';
import { getAllCategories, getAllPosts } from '@/lib/api';
import { DEFAULT_TITLE, HOME_OG_IMAGE_URL, SITE_URL } from '@/lib/constants';
import { Metadata } from 'next';

type Props = {
  params: { category?: string[] };
};

export default async function PostsPage({ params }: Props) {
  const category = params.category?.[0];

  const allPosts = getAllPosts();

  const categoryPosts = category
    ? allPosts.filter((post) => post.category === category)
    : allPosts;

  return (
    <main>
      <Container>
        <Categories category={category} />
        <section className="mb-32">
          <h1 className="mb-8 text-3xl font-bold">
            {category ? (
              <span>Posts in “{category}”</span>
            ) : (
              <span>All Posts</span>
            )}
          </h1>
          {categoryPosts.length > 0 ? (
            <PostList posts={categoryPosts} />
          ) : (
            <p>No posts found.</p>
          )}
        </section>
      </Container>
    </main>
  );
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return [
    { category: [] }, // 👈 /categories 기본 페이지
    ...categories.map((c) => ({ category: [c] })), // 👈 /categories/react 같은 페이지
  ];
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `All Posts | ${DEFAULT_TITLE}`,
  openGraph: {
    title: `All Posts | ${DEFAULT_TITLE}`,
    images: [`${HOME_OG_IMAGE_URL}`], // 필요시 기본 OG 이미지
  },
};
