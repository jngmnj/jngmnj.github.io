import { ABOUT_PATH } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import RelativeDateFormatter from './relative-date-formatter';

interface BytesItemProps {
  slug: string;
  date: string;
  content: string;
  tags?: string[];
}

export function BytesItem({ slug, content, date, tags }: BytesItemProps) {
  return (
    <div className="flex w-full gap-2 md:gap-4">
      <div className="relative size-10 flex-shrink-0 overflow-hidden rounded-full md:size-16">
        <Image
          src="/assets/common/profile.png"
          alt="Profile Image"
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          sizes="(max-width: 768px) 40px, 64px"
        />
      </div>
      <div className="flex-1 transition-shadow">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          <Link href={ABOUT_PATH} className="hover:underline" target="_blank">
            @jngmnj
          </Link>
          <RelativeDateFormatter
            dateString={date}
            className="text-sm text-gray-500 dark:text-gray-400"
          />
        </div>
        {/* <Link href={`/tech-bytes/${slug}`} className="block">
          <div className="tech-bytes markdown prose mb-4 max-w-none cursor-pointer rounded-xl border border-b-2 border-gray-200 p-6 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-gray-600">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </Link> */}
        <div className="tech-bytes markdown prose mb-4 max-w-none cursor-pointer rounded-xl border border-b-2 border-gray-200 p-6 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-gray-600">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <div className="mb-4 flex items-center justify-between">
          {tags && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
