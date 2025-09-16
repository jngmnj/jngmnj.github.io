import CoverImage from '@/app/_components/cover-image';
import Link from 'next/link';

type Props = {
  title: string;
  coverImage: string;
  excerpt: string;
  slug: string;
};

export function HeroPost({ title, coverImage, excerpt, slug }: Props) {
  return (
    <section>
      <Link href={`/posts/${encodeURIComponent(slug)}`} className="group">
        <div className="relative mb-8 h-80 overflow-hidden rounded-2xl sm:h-96 md:mb-16 lg:h-112 xl:h-128">
          <CoverImage title={title} src={coverImage} isThumbnail />
          <div className="group-hover:from:30% absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 from-0% via-black/20 via-20% to-transparent to-60% px-6 py-8 text-white group-hover:via-50% group-hover:to-80%">
            <h3 className="text-2xl leading-tight md:text-4xl lg:text-5xl">
              {title}
            </h3>
            <div className="mt-4 max-h-0 overflow-hidden opacity-90 transition-all duration-200 group-hover:max-h-full group-hover:opacity-100 lg:mt-6 lg:text-lg lg:leading-relaxed">
              <p className="mb-4 line-clamp-3 text-lg leading-relaxed">
                {excerpt}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
