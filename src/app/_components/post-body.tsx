import type { TocItem } from '@/lib/markdownToHtml';
import cn from 'classnames';
import markdownStyles from './markdown-styles.module.css';

type Props = {
  content: string;
  toc: TocItem[];
};

export function PostBody({ content, toc }: Props) {
  return (
    <div className="markdown mx-auto max-w-2xl">
      {/* TOC */}
      {/* left: 100%, translateX(100%) */}
      <div className="relative">
        <aside className="fixed top-20 left-1/2 col-span-1 hidden w-60 translate-x-[23rem] border bg-white p-4 text-sm lg:block dark:bg-black">
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
                    className="text-gray-600 hover:text-blue-600"
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
      <div
        className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
