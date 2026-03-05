import Container from '@/app/_components/container';
import RelativeDateFormatter from '@/app/_components/relative-date-formatter';
import { getAllShorts, getShortBySlug } from '@/lib/api';
import { ABOUT_PATH, DEFAULT_TITLE, SITE_URL } from '@/lib/constants';
import markdownToHtml from '@/lib/markdownToHtml';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BytePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const byte = getShortBySlug(slug);
    const { html } = await markdownToHtml(byte.content || '');

    return (
      <main>
        <Container narrow>
          <article className="mb-32">
            {/* Header with profile info */}
            <div className="mb-8 flex items-center gap-4 border-b border-gray-200 pb-6 dark:border-gray-700">
              <div className="size-12 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/assets/common/profile.png"
                  alt="Profile Image"
                  width={48}
                  height={48}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  <Link
                    href={ABOUT_PATH}
                    className="hover:underline"
                    target="_blank"
                  >
                    @jngmnj
                  </Link>
                </div>
                <RelativeDateFormatter
                  dateString={byte.date}
                  className="text-sm text-gray-500 dark:text-gray-400"
                />
              </div>
            </div>

            {/* Content */}
            <div className="tech-bytes markdown prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>

            {/* Tags */}
            {byte.tags && byte.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-gray-200 pt-6 dark:border-gray-700">
                {byte.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        </Container>
      </main>
    );
  } catch (error) {
    return notFound();
  }
}

export async function generateStaticParams() {
  const bytes = getAllShorts();
  return bytes.map((byte) => ({
    slug: byte.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const byte = getShortBySlug(slug);
    const title = `tech-bytes | ${DEFAULT_TITLE}`;
    const description = byte.content.slice(0, 160) + '...';

    return {
      metadataBase: new URL(SITE_URL),
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
      },
    };
  } catch (error) {
    return {
      title: 'tech-bytes Not Found',
      description: 'The requested tech-bytes could not be found.',
    };
  }
}
