import Container from '@/app/_components/container';
import { DEFAULT_TITLE, HOME_OG_IMAGE_URL, SITE_URL } from '@/lib/constants';
import { Metadata } from 'next';
import { BytesList } from '@/app/_components/bytes-list';

export default function ShortsPage() {
  return (
    <main>
      <Container narrow>
        <div className="mb-8">
          <h1 className="text-2xl leading-tight font-bold tracking-tighter md:pr-8 md:text-4xl">
            tech-bytes
          </h1>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            take a bite! <br />
            짧게 정리한 기술 관련 글 모음입니다.
          </p>
        </div>

        <section>
          <BytesList />
        </section>
      </Container>
    </main>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `짧은 글 | ${DEFAULT_TITLE}`,
  description: '빠르게 읽을 수 있는 짧은 글 모음',
  openGraph: {
    title: `짧은 글 | ${DEFAULT_TITLE}`,
    description: '빠르게 읽을 수 있는 짧은 글 모음',
    images: [HOME_OG_IMAGE_URL],
  },
};
