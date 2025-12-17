import { PostTitle } from '@/app/_components/post-title';
import { CATEGORY_PATH } from '@/lib/constants';
import { RiArrowRightSLine } from '@remixicon/react';
import Link from 'next/link';
import Avatar from './avatar';
import CoverImage from './cover-image';
import DateFormatter from './date-formatter';

type Props = {
  title: string;
  coverImage?: string;
  date: string;
  category: string;
};

export function PostHeader({ title, coverImage, date, category }: Props) {
  return (
    <>
      <div className="mb-4 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link
          href={CATEGORY_PATH}
          className="p-1 hover:text-gray-900 hover:underline dark:hover:text-gray-200"
        >
          Blog
        </Link>
        <RiArrowRightSLine className="size-4" />
        <Link
          href={`/blog/category/${category}`}
          className="p-1 hover:text-gray-900 hover:underline dark:hover:text-gray-200"
        >
          {category}
        </Link>
      </div>
      <PostTitle>{title}</PostTitle>
      <div className="mb-8 flex flex-col gap-3">
        <Avatar />
        <p className="text-sm text-gray-400 dark:text-gray-600">
          <DateFormatter dateString={date} />
        </p>
      </div>
      <div className="mb-8 sm:mx-0 md:mb-16">
        {coverImage && <CoverImage title={title} src={coverImage} />}
      </div>
    </>
  );
}
