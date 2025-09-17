---
title: '마크다운, 코드 하이라이팅'
excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus.'
# coverImage: '/assets/blog/hello-world/cover.jpg'
date: '2020-03-16T05:35:07.322Z'
category: 'develop'
author:
  name: Tim Neutkens
  picture: '/assets/blog/authors/tim.jpeg'
ogImage:
  # url: '/assets/blog/hello-world/cover.jpg'
---

# 마크다운, 코드 하이라이팅

## 선택지 2가지

### 1. **remark + rehype + rehype-highlight**

- 가장 간단히 “코드 블록 하이라이팅”을 붙일 수 있는 조합.
- `rehype-highlight`는 [highlight.js](https://highlightjs.org/) 기반.

```bash title="제목"
npm install remark remark-html rehype-highlight

```

변환 함수(`markdownToHtml.ts`) 수정:

```tsx showLineNumbers
import { remark } from 'remark';
import html from 'remark-html';
import rehypeHighlight from 'rehype-highlight';

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(html, { sanitize: false })
    .use(rehypeHighlight) // 코드블록 하이라이팅
    .process(markdown);
  return result.toString();
}
```

추가: CSS도 필요합니다 → highlight.js 테마 (예: github-dark.css)

```tsx
import 'highlight.js/styles/github-dark.css';
```

---

### 2. **rehype-pretty-code (Shiki 기반)**

- Next.js 블로그에서 제일 많이 쓰는 방식.
- [Shiki](https://shiki.style/)를 써서, VSCode와 똑같은 문법 하이라이팅 지원.

```bash
npm install rehype-pretty-code shiki
```

```tsx
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: 'github-dark', // "vscode-dark-plus" 같은 테마도 가능
    })
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
```

CSS는 따로 작성해서 코드 블록 margin, padding, border-radius 등을 다듬으면 됩니다.
