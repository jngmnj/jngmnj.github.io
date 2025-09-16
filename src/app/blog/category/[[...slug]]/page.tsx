import Categories from '@/app/_components/categories';
import Container from '@/app/_components/container';
import { PostList } from '@/app/_components/post-list';
import { getAllCategories, getAllPosts } from '@/lib/api';
import { DEFAULT_TITLE, HOME_OG_IMAGE_URL, SITE_URL } from '@/lib/constants';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const POSTS_PER_PAGE = 5;

export default async function PostsPage(
  props: PageProps<'/blog/category/[[...slug]]'>
) {
  // slug가 없는 경우도 [] 반환
  const { slug } = await props.params;
  const slugArray = slug || [];
  const isPageNumber = slugArray.length === 1 && /^\d+$/.test(slugArray[0]);
  const category = !isPageNumber ? slugArray[0] : undefined;
  const page = parseInt(slugArray[isPageNumber ? 0 : 1] || '1', 10);

  const allPosts = getAllPosts();

  // 카테고리 필터링
  const filteredPosts = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts;

  // 페이지네이션
  const start = (page - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

  if (paginatedPosts.length === 0) {
    return notFound();
  }

  return (
    <main>
      <Container>
        <Categories category={category} />
        <section className="mb-32">
          {paginatedPosts.length > 0 ? (
            <PostList posts={paginatedPosts} />
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
  const allPosts = getAllPosts();

  const params: { slug: string[] }[] = [];

  // 기본 페이지
  params.push({ slug: [] });

  // 페이지네이션 숫자 (예시: 최대 5페이지만 미리 생성)
  const maxPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  for (let i = 2; i <= maxPages; i++) {
    params.push({ slug: [String(i)] });
  }

  // 카테고리별
  for (const c of categories) {
    params.push({ slug: [c] });
    const catPosts = allPosts.filter((p) => p.category === c);
    const catPages = Math.ceil(catPosts.length / POSTS_PER_PAGE);
    for (let i = 2; i <= catPages; i++) {
      params.push({ slug: [c, String(i)] });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Promise<Metadata> {
  const slugArray = params.slug || [];
  const category = slugArray[0];
  const page = parseInt(slugArray[1] || '1', 10);

  const title = category
    ? `Posts in ${category} - Page ${page} | ${DEFAULT_TITLE}`
    : `All Posts - Page ${page} | ${DEFAULT_TITLE}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    openGraph: {
      title,
      images: [HOME_OG_IMAGE_URL],
    },
  };
}
