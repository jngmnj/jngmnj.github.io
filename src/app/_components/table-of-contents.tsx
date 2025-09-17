'use client';
import type { TocItem } from '@/lib/markdownToHtml';
import cn from 'classnames';
import { useEffect, useState } from 'react';

export function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const tocElement = document.getElementById('table-of-contents');
      if (!tocElement) return;

      if (window.scrollY > 200) {
        tocElement.classList.add('fixed');
        tocElement.classList.remove('absolute');
      } else {
        tocElement.classList.remove('fixed');
        tocElement.classList.add('absolute');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      className="absolute top-20 left-1/2 col-span-1 hidden w-60 translate-x-[23rem] border bg-white p-4 text-sm lg:block dark:bg-black"
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
                  'hover:text-blue-600',
                  activeId === item.id
                    ? 'font-semibold text-blue-600'
                    : 'text-gray-600'
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
