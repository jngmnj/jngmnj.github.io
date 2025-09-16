'use client';

import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiMoreLine,
} from '@remixicon/react';
import cn from 'classnames';
import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  category?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  category,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const basePath = category ? `/blog/category/${category}` : `/blog/category`;
  const makeHref = (page: number) =>
    page === 1 ? basePath : `${basePath}/${page}`;

  const pages: (number | string)[] = [];

  // case 1: 첫 5페이지일 때
  if (currentPage <= 4) {
    for (let i = 1; i <= Math.min(5, totalPages); i++) {
      pages.push(i);
    }
    if (totalPages > 6) {
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (totalPages > 5) {
      pages.push(totalPages);
    }
  }
  // case 2: 끝 5페이지일 때
  else if (currentPage >= totalPages - 3) {
    pages.push(1);
    if (totalPages > 6) pages.push('ellipsis');
    for (let i = totalPages - 4; i <= totalPages; i++) {
      if (i > 1) pages.push(i);
    }
  }
  // case 3: 중간
  else {
    pages.push(1);
    pages.push('ellipsis');
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push('ellipsis');
    pages.push(totalPages);
  }

  return (
    <nav className="mt-8 flex justify-center space-x-1 md:space-x-2">
      {/* 이전 */}
      {currentPage > 1 && (
        <Link
          href={makeHref(currentPage - 1)}
          className="transition-bg flex size-8 items-center justify-center rounded-full text-gray-500 duration-200 hover:bg-gray-100"
        >
          <RiArrowLeftSLine />
        </Link>
      )}

      {pages.map((p, idx) =>
        typeof p === 'string' ? (
          <span key={idx} className="px-3 py-1 text-gray-400">
            <RiMoreLine />
          </span>
        ) : (
          <Link
            key={`page-${p}`}
            href={makeHref(p)}
            className={cn(
              'transition-bg flex size-8 items-center justify-center rounded-full duration-200',
              p === currentPage
                ? 'border-primary-500 bg-gray-200 font-bold text-black'
                : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            {p}
          </Link>
        )
      )}

      {/* 다음 */}
      {currentPage < totalPages && (
        <Link
          href={makeHref(currentPage + 1)}
          className="transition-bg flex size-8 items-center justify-center rounded-full text-gray-500 duration-200 hover:bg-gray-100"
        >
          <RiArrowRightSLine />
        </Link>
      )}
    </nav>
  );
}
