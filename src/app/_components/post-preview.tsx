import { type Author } from '@/interfaces/author';
import Link from 'next/link';
import CoverImage from './cover-image';
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
      <h3 className="mb-3 text-3xl leading-snug">
        <Link
          href={`/posts/${encodeURIComponent(slug)}`}
          className="hover:underline"
        >
          {title}
        </Link>
      </h3>
      <div className="mb-4 text-lg">
        <DateFormatter dateString={date} />
      </div>
      <p className="mb-4 text-lg leading-relaxed">{excerpt}</p>
      <div className="mb-5">
        <CoverImage title={title} src={coverImage} />
      </div>
    </div>
  );
}
