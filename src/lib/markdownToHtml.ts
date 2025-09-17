import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';

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
};

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, options)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
