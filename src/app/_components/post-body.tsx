import type { TocItem } from '@/lib/markdownToHtml';
import markdownStyles from './markdown-styles.module.css';
import { TableOfContents } from './table-of-contents';

type Props = {
  content: string;
  toc: TocItem[];
};

export function PostBody({ content, toc }: Props) {
  return (
    <div className="relative">
      <div className="absolute left-[calc(100%+2rem)] hidden h-full lg:block">
        <TableOfContents toc={toc} />
      </div>
      <div className="markdown prose max-w-none">
        <div
          className={markdownStyles['markdown']}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
