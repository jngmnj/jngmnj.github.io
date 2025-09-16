import { type Author } from '@/interfaces/author';
import Image from 'next/image';
import Link from 'next/link';
import DateFormatter from './date-formatter';

type Props = {
  title: string;
  coverImage?: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

export function PostPreview({ title, coverImage, date, excerpt, slug }: Props) {
  return (
    <div>
      <Link
        href={`/posts/${encodeURIComponent(slug)}`}
        className="group flex items-start gap-8"
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

        {coverImage ?  (
          <div className="aspect-[4/3] w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 md:ml-8 md:w-64 lg:ml-16">
            <Image
              src={coverImage}
              alt={`Cover Image for ${title}`}
              className="h-full w-full object-cover duration-200 group-hover:scale-105 group-hover:transition-transform"
              width={1300}
              height={630}
            />
          </div>
        ): null}
      </Link>
    </div>
  );
}
