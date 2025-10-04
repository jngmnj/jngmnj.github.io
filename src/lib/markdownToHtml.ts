import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

// 커스텀 플러그인: 괄호가 포함된 굵은 글씨 처리
function remarkBoldWithParentheses() {
  return (tree: any) => {
    visit(tree, 'text', (node: any, index: number | undefined, parent: any) => {
      if (!node.value || index === undefined) return;

      // **text(inside)** 패턴을 찾아서 처리
      const boldWithParensRegex = /\*\*([^*]+\([^)]*\)[^*]*)\*\*/g;
      const matches = [...node.value.matchAll(boldWithParensRegex)];

      if (matches.length > 0) {
        const children: any[] = [];
        let lastIndex = 0;

        matches.forEach((match) => {
          const fullMatch = match[0];
          const content = match[1];
          const matchIndex = match.index!;

          // 매치 이전의 텍스트 추가
          if (matchIndex > lastIndex) {
            children.push({
              type: 'text',
              value: node.value.slice(lastIndex, matchIndex),
            });
          }

          // 굵은 글씨 노드 추가
          children.push({
            type: 'strong',
            children: [
              {
                type: 'text',
                value: content,
              },
            ],
          });

          lastIndex = matchIndex + fullMatch.length;
        });

        // 마지막 매치 이후의 텍스트 추가
        if (lastIndex < node.value.length) {
          children.push({
            type: 'text',
            value: node.value.slice(lastIndex),
          });
        }

        // 부모 노드의 children 배열을 업데이트
        parent.children.splice(index, 1, ...children);
      }
    });
  };
}

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
          .replace(/[!@#$%^&*(),.?":{}|<>]/g, '')
          .concat('-' + Math.random().toString(36).substring(2, 5));

        toc.push({ id, text, level: node.depth });

        node.data = {
          hProperties: { id },
        };
      });
    })
    .use(remarkBoldWithParentheses)
    .use(remarkRehype)
    .use(rehypePrettyCode, options)
    .use(remarkGfm)
    .use(rehypeStringify);

  const html = String(await processor.process(markdown));

  return { html, toc };
}
