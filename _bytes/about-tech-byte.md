---
date: '2026-03-05T22:35:07.322Z'
tags: ['무한스크롤', 'TanStack Query', 'Next.js']
---

## GitHub Pages에서 무한스크롤 구현

서버 없는 정적 사이트인데 무한스크롤을 가능하게 하다...

일단 **TanStack Query** 쓰고 빌드할 때 JSON 파일들을 쪼개서 만듦

TanStack Query 쓴 이유

- `useInfiniteQuery`가 무한스크롤에 최적화됨
- 이미 로드한 페이지는 자동 캐싱 (중복 요청 방지)
- `getNextPageParam`으로 다음 페이지 번호 자동 관리
- 로딩/에러 상태도 알아서 처리해줌

그래서 `fetch('/data/bytes-1.json')` 직접 쓰지 말고 TanStack Query로 감쌌더니 무한스크롤 로직이 엄청 간단해짐

`/data/bytes-1.json`, `/data/bytes-2.json` 이런 식으로

GitHub Pages는 정적 호스팅이라 서버에서 `?page=1` 이런 쿼리 처리가 안됨. 그래서 미리 빌드 타임에 `build-paginated-bytes.ts` 스크립트로

- 전체 데이터를 6개씩 쪼개고
- 각 페이지마다 JSON 파일 생성
- 마크다운도 HTML로 미리 변환해서 저장

이렇게 하니까 클라이언트에서 `/data/bytes-1.json` 요청하면 바로 렌더링 가능한 HTML이 준비됨
