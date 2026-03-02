import { ABOUT_PATH } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import RelativeDateFormatter from './relative-date-formatter';

interface BytesItemProps {
  date: string;
  content: string;
  tags?: string[];
}

export function BytesItem({ content, date, tags }: BytesItemProps) {
  return (
    <div className="flex w-full gap-2 md:gap-4">
      <div className="size-10 flex-shrink-0 overflow-hidden rounded-full md:size-16">
        <Image
          src="/assets/common/profile.png"
          alt="Profile Image"
          className=""
          width={60}
          height={60}
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
        <div className="tech-bytes markdown prose mb-4 max-w-none rounded-xl border border-b-2 border-gray-200 p-6 dark:border-gray-700">
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
