---
title: 'Next.js 정적 블로그에 검색 기능 구현하기'
excerpt: 'GitHub Pages로 호스팅되는 Next.js 정적 블로그에 클라이언트 사이드 검색 기능을 구현한 과정을 소개합니다.'
date: '2025-10-04'
category: 'develop'
---

GitHub Pages로 배포된 Next.js 블로그는 **정적 웹사이트(Static Website)**의 특성을 가집니다. 이는 빌드 시점에 모든 HTML, CSS, JavaScript 파일이 생성되며, 서버 측 로직(예: Next.js API Routes, 데이터베이스 연동)은 직접 실행할 수 없다는 것을 의미합니다. 이러한 제약 조건 때문에 전통적인 서버 사이드 검색은 불가능하며, 모든 동적인 처리는 클라이언트 사이드 JavaScript에 위임해야 합니다.

이번 글에서는 Next.js로 구축된 정적 블로그에 효율적인 검색 기능을 구현한 과정을 공유해보겠습니다.

## 왜 클라이언트 사이드 검색을 선택했나?

정적 사이트에서 검색을 구현하는 방법은 크게 세 가지가 있습니다.

1. **외부 검색 서비스** (Algolia, Elasticsearch 등)
2. **서버리스 함수** (Vercel Functions, Netlify Functions 등)
3. **클라이언트 사이드 검색**

외부 서비스는 비용이 발생하고, 서버리스 함수는 복잡도가 높아집니다. 반면 클라이언트 사이드 검색은 구현이 간단하고 비용이 없으며, 정적 사이트의 특성에 잘 맞습니다. 포스트 수가 많지 않은 개인 블로그라면 충분히 실용적인 선택이라고 생각합니다.

## 구현 방식

### 1. 검색 인덱스 생성

먼저 빌드 시점에 모든 포스트의 메타데이터를 추출하여 검색 인덱스를 생성합니다.

```typescript
// src/scripts/generate-search-index.ts
import { getAllPosts } from '@/lib/api';
import fs from 'fs';
import path from 'path';

function generateSearchIndex() {
  const posts = getAllPosts();

  const index = posts.map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category || null,
  }));

  const filePath = path.join(process.cwd(), 'public', 'search.json');
  fs.writeFileSync(filePath, JSON.stringify(index, null, 2));
}

generateSearchIndex();
```

이 스크립트는 `_posts` 폴더의 모든 마크다운 파일을 읽어서 제목, 슬러그, 요약, 카테고리 정보만 추출합니다. 전체 내용을 포함하지 않는 이유는 파일 크기를 최소화하고 검색 성능을 높이기 위함입니다.

### 2. 빌드 프로세스 통합

검색 인덱스 생성을 빌드 프로세스에 통합합니다.

```json
// package.json
{
  "scripts": {
    "build": "npm run generate-search-index && next build",
    "generate-search-index": "tsx src/scripts/generate-search-index.ts"
  }
}
```

이렇게 하면 `npm run build` 실행 시 자동으로 검색 인덱스가 생성되고, 포스트가 추가되거나 수정될 때마다 인덱스가 업데이트됩니다.

### 3. 검색 컴포넌트 구현

클라이언트에서 검색 인덱스를 로드하고 실시간 검색을 수행하는 컴포넌트를 구현합니다.

```typescript
// src/app/_components/search.tsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { RiSearch2Line, RiCloseLine } from '@remixicon/react';

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [index, setIndex] = useState<SearchResult[]>([]);

  // 검색 인덱스 로드
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/search.json');
      const data = await response.json();
      setIndex(data);
    };
    fetchData();
  }, []);

  // 실시간 검색
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const filteredResults = index.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );

    // 제목 매치 우선순위 정렬
    const sortedResults = filteredResults.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(q);
      const bTitleMatch = b.title.toLowerCase().includes(q);

      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });

    setResults(sortedResults);
  }, [query, index]);

  // 키보드 단축키 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // ... 나머지 컴포넌트 코드
}
```

## 주요 특징

- 실시간 검색
  - 사용자가 타이핑하는 즉시 검색 결과가 표시됩니다. `useEffect`를 사용하여 쿼리가 변경될 때마다 필터링을 수행합니다.
- 스마트 정렬
  - 제목에 검색어가 포함된 결과를 우선순위로 정렬하여 사용자가 원하는 결과를 쉽게 찾을 수 있도록 합니다.
- 키보드 단축키
  - `Ctrl+K` (Windows/Linux) 또는 `Cmd+K` (Mac)로 검색 모달을 열 수 있어 사용자 경험이 향상됩니다.

- 모던한 UI/UX
  - 다크모드 지원
  - 반응형 디자인
  - 로딩 상태 표시
  - 검색 결과 미리보기 (제목, 요약, 카테고리)

## 성능 최적화

- 파일 크기 최적화
  - 전체 포스트 내용이 아닌 메타데이터만 인덱스에 포함하여 파일 크기를 최소화했습니다.
- 메모리 캐싱
  - 검색 인덱스를 한 번 로드한 후 메모리에 저장하여 네트워크 요청 없이 빠른 검색을 제공합니다.
- 정적 배포 최적화
  - 서버 의존성 없이 순수 클라이언트 사이드에서 동작하여 GitHub Pages와 같은 정적 호스팅에 최적화되어 있습니다.

## 한계점과 개선 방향

현재 구현의 한계점은 다음과 같습니다.

1. **전체 텍스트 검색 불가**: 제목, 요약, 카테고리에서만 검색 가능
2. **한국어 형태소 분석 미지원**: 정확한 매칭만 가능
3. **포스트 수 증가 시 성능 저하**: 모든 데이터를 메모리에 로드

이러한 한계점을 개선하려면 다음과 같은 방법을 고려할 수 있습니다.

1. **전체 텍스트 검색**: 포스트 내용도 인덱스에 포함
2. **외부 검색 서비스 도입**: Algolia, Elasticsearch 등
3. **서버리스 함수 활용**: 검색 로직을 서버리스 함수로 분리

## 마무리

정적 블로그에 검색 기능을 구현하는 것은 생각보다 복잡하지 않습니다. 적절한 설계와 최적화를 통해 사용자에게 좋은 경험을 제공할 수 있습니다.

현재 구현된 검색 기능은 포스트 수가 많지 않은 개인 블로그에 적합하며, 향후 블로그가 성장한다면 더 고도화된 검색 솔루션을 고려해볼 수 있습니다.
