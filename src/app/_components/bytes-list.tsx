'use client';

import { useInfiniteBytes } from '@/hooks/useInfiniteBytes';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { BytesItem } from './bytes-item';
import { BytesSkeleton } from './bytes-skeleton';

export function BytesList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteBytes();

  const loadMoreRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { threshold: 0.1, rootMargin: '200px' }
  );
  if (isLoading)
    return Array.from({ length: 6 }, (_, i) => <BytesSkeleton key={i} />);

  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="mb-4 text-red-500">데이터를 불러오는데 실패했습니다.</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {error?.message}
        </p>
      </div>
    );
  }

  const allBytes = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="grid grid-cols-1 gap-y-10 md:gap-y-12">
      {allBytes.map((byte) => (
        <BytesItem
          key={byte.slug}
          slug={byte.slug}
          content={byte.content}
          date={byte.date}
          tags={byte.tags}
        />
      ))}

      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage ? (
          <BytesSkeleton />
        ) : hasNextPage ? (
          <div className="text-sm text-gray-400">스크롤하여 더 보기</div>
        ) : allBytes.length > 0 ? (
          <div className="text-sm text-gray-400">
            모든 게시글을 불러왔습니다
          </div>
        ) : null}
      </div>
    </div>
  );
}
