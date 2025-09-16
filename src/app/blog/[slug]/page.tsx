import Container from '@/app/_components/container';
import { PostBody } from '@/app/_components/post-body';
import { PostHeader } from '@/app/_components/post-header';
import { getAllPosts, getPostBySlug } from '@/lib/api';
import { DEFAULT_TITLE, SITE_URL } from '@/lib/constants';
import markdownToHtml from '@/lib/markdownToHtml';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || '');

  return (
    <main>
      <Container>
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | ${DEFAULT_TITLE}`;
  const ogImage =
    post.ogImage?.url ||
    post.coverImage ||
    '/assets/common/opengraph-image.png';
  return {
    metadataBase: new URL(SITE_URL),
    title,
    openGraph: {
      title,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: encodeURIComponent(post.slug.replace(/\.md$/, '')),
  }));
}
