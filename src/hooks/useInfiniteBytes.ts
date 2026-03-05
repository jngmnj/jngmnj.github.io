'use client';

import { Bytes } from '@/interfaces/bytes';
import { useInfiniteQuery } from '@tanstack/react-query';

type BytesPage = {
  data: Bytes[];
  currentPage: number;
  totalPages: number;
  nextPage: number | null;
  hasNextPage: boolean;
};

const fetchBytes = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<BytesPage> => {
  const response = await fetch(`/data/bytes-${pageParam}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch page ${pageParam}`);
  }
  return response.json();
};

export function useInfiniteBytes() {
  return useInfiniteQuery({
    queryKey: ['bytes'],
    queryFn: fetchBytes,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    retry: (failureCount, error) => {
      // 404에대해서는 재시도하지 않음
      if (
        error.message.includes('404') ||
        error.message.includes('Failed to fetch')
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
