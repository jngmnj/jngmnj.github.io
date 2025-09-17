import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const options: Options = {
  // 라이트/다크 모드 모두 지정
  theme: {
    light: 'one-light',
    dark: 'one-dark-pro',
  },
  keepBackground: true,
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = (node.properties.className || []).concat(
      'line--highlighted'
    );
  },
  onVisitHighlightedChars(node, id) {
    node.properties.className = (node.properties.className || []).concat(
      `char--highlighted ${id ?? ''}`
    );
  },

  bypassInlineCode: false,
  defaultLang: {
    block: 'javascript',
    inline: 'plaintext',
  },
};

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

function extractText(node: any): string {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(extractText).join('');
  return '';
}

export default async function markdownToHtml(markdown: string) {
  const toc: TocItem[] = [];

  const processor = unified()
    .use(remarkParse)
    .use(() => (tree: any) => {
      visit(tree, 'heading', (node: any) => {
        const text = extractText(node).trim();

        if (!text) return;

        const id = text
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[!@#$%^&*(),.?":{}|<>]/g, '');

        toc.push({ id, text, level: node.depth });

        node.data = {
          hProperties: { id },
        };
      });
    })
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, options)
    .use(rehypeStringify);

  const html = String(await processor.process(markdown));

  return { html, toc };
}
