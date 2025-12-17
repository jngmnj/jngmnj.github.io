import Link from 'next/link';
import CoverImage from './cover-image';
import DateFormatter from './date-formatter';

type Props = {
  title: string;
  coverImage?: string;
  date: string;
  excerpt: string;
  slug: string;
};

export function PostPreview({ title, coverImage, date, excerpt, slug }: Props) {
  return (
    <div>
      <Link
        href={`/blog/${encodeURIComponent(slug)}`}
        className="group flex items-start justify-between gap-8"
      >
        <div>
          <h3 className="group-hover:text-primary-500 mb-3 text-xl leading-snug transition-all md:text-2xl">
            {title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500 md:text-base">
            {excerpt}
          </p>
          <div className="mb-4 text-sm text-gray-500">
            <DateFormatter dateString={date} />
          </div>
        </div>

        {coverImage ? (
          <div className="aspect-[4/3] w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 md:ml-8 md:w-64 lg:ml-16">
            <CoverImage title={title} src={coverImage} isThumbnail />
          </div>
        ) : null}
      </Link>
    </div>
  );
}
