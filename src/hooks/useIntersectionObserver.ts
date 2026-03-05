'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<HTMLDivElement>(null);

  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          memoizedCallback();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px',
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [memoizedCallback, options]);

  return targetRef;
}
