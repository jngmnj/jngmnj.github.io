'use client';
import type { TocItem } from '@/lib/markdownToHtml';
import cn from 'classnames';
import { useEffect, useState } from 'react';

export function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) =>
            a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1
          );

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 }
    );

    headings.forEach((el) => observer.observe(el));
  }, [toc]);
  if (toc.length === 0) return null;

  return (
    <nav
      className="sticky top-100 col-span-1 hidden w-60 text-sm lg:block dark:bg-black"
      id="table-of-contents"
    >
      <ul className="space-y-1">
        {toc.map((item) => {
          return (
            <li
              key={item.id}
              className={cn({
                'ml-0': item.level === 2,
                'ml-4': item.level === 3,
                'ml-8': item.level === 4,
              })}
            >
              <a
                href={`#${item.id}`}
                className={cn(
                  'hover:text-primary-500 before:bg-primary-500 relative before:absolute before:-left-2 before:h-full before:w-1 before:opacity-0 before:transition-all before:content-[""] hover:before:opacity-100',
                  activeId === item.id
                    ? 'font-semibold text-gray-700 before:opacity-100 dark:text-gray-200'
                    : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
