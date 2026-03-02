import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPostChunk } from './api';

export function useInfiniteBytes() {
  return useInfiniteQuery({
    queryKey: ['bytes'],
    queryFn: fetchPostChunk,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
