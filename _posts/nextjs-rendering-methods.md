---
title: 'Next.js 렌더링 방식: SSG, SSR, ISR, Streaming'
excerpt: 'Page Router부터 App Router까지, Next.js의 렌더링 방식(SSG, SSR, ISR, Streaming)을 흐름으로 정리하고 언제 어떤 방식을 쓰면 좋을지 정리해봅니다.'
date: '2025-12-15'
category: 'develop'
---

Next.js의 렌더링 방식은 **SSG → SSR → ISR → Streaming**으로 진화해 왔습니다.  
표면적으로는 옵션과 API 이름이 달라진 것처럼 보이지만, **핵심은 "언제 렌더링하느냐"에서 "어떻게 쪼개서, 병렬로 전달하느냐"로 이동했다**는 점입니다.

Page Router 시절에는 `getStaticProps`, `getServerSideProps`, `getStaticPaths`처럼 **개발자가 직접 렌더링 방식을 선택**해야 했습니다.  
App Router 이후에는 **Server Component + cache + dynamic API** 조합으로, 우리가 작성한 코드의 성격에 따라 **Next.js가 렌더링 방식을 자동으로 결정**합니다.

이 글에서는,

- SSG / SSR / ISR / Streaming이 **어떻게 등장했고**
- App Router에서는 **어떻게 자동으로 결정되며**
- 실제로는 **언제 무엇을 쓰면 좋은지**

에 대해서 알아보겠습니다.

---

## 1. 전체 그림부터 보기

먼저 각 렌더링 방식을 한눈에 정리해보면 다음과 같습니다.

| 방식          | 언제 HTML을 만드나?       | 대표 키워드               | Page Router                     | App Router 관점                            |
| ------------- | ------------------------- | ------------------------- | ------------------------------- | ------------------------------------------ |
| **SSG**       | 빌드 타임                 | 정적, 캐시, 가장 빠름     | `getStaticProps`                | 기본값 (static할 수 있으면 자동 SSG)       |
| **SSR**       | 요청 시마다               | 항상 최신, 비용 큼        | `getServerSideProps`            | dynamic API / no cache 시 자동 SSR         |
| **ISR**       | 빌드 타임 + 주기적 재생성 | 정적 + 갱신               | `revalidate` 옵션               | `export const revalidate = 60` 등으로 설정 |
| **Streaming** | 요청 시 + 조각 단위 전송  | 부분 렌더링, 빠른 첫 화면 | X (사실상 지원 X에 가깝게 인식) | App Router 기본 SSR 전략(Suspense 기반)    |

Page Router에서는 "**이 페이지는 SSG**, **이 페이지는 SSR**" 처럼 **페이지 단위로 전략을 고르는 느낌**이었다면,  
App Router에서는 "**이 데이터는 얼마나 자주 변해?**, **사용자마다 달라져?**" 같은 **도메인 질문**을 먼저 던지고,  
그 답을 코드로 표현하면 **Next.js가 알아서 렌더링 방식을 택해주는 구조**에 가깝습니다.

---

## 2. SSG – Static Site Generation

### 2-1. 개념

SSG는 **빌드 시점에 HTML을 미리 만들어 두고, 요청이 오면 그대로 서빙**하는 방식입니다.

- 서버 부하는 사실상 **CDN 수준**
- 가장 빠르고, 가장 예측 가능
- "한 번 만들면 거의 안 바뀌는 페이지"에 이상적

### 2-2. Page Router에서 SSG

- 모든 것이 **페이지 단위**
- 데이터 패칭은 `getStaticProps`
- 동적 라우팅은 `getStaticPaths` + `getStaticProps` 세트로 사용

```tsx
// pages/blog/[slug].tsx
export async function getStaticProps({ params }) {
  const post = await getPost(params.slug);
  return {
    props: { post },
  };
}

export async function getStaticPaths() {
  const slugs = await getAllPostSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}
```

대표적인 예시는:

- 블로그 글 상세
- 마케팅/랜딩 페이지
- 거의 변하지 않는 문서 페이지

### 2-3. App Router에서 SSG

App Router에서는 **"이건 SSG야"라고 선언하지 않아도** SSG가 됩니다.  
다음 조건을 만족하면 Next.js가 **자동으로 정적 빌드**를 시도합니다.

- Server Component에서
  - `cookies()`, `headers()` 같은 **dynamic API를 사용하지 않고**
  - `fetch`가 **캐시 가능한 상태**(`cache: 'force-cache'` 혹은 기본값)일 때

즉, 우리는 단지:

- "이 데이터는 자주 안 바뀌어"
- "사용자마다 달라지지 않아"

라는 의도만 코드에 드러내면, **SSG 여부는 Next가 알아서 판단**합니다.

> **정리:**  
> **SSG = "요청 전에 이미 만들어져 있는 페이지"**  
> App Router에서는 "정적일 수 있으면 일단 SSG로 가본다"가 기본 전략입니다.

---

## 3. SSR – Server Side Rendering

### 3-1. 개념

SSR은 **요청이 들어올 때마다 서버에서 HTML을 새로 생성**하는 방식입니다.

- 매 요청마다 최신 데이터를 볼 수 있음
- 대신 **서버 비용, 응답 시간**이 늘어남

### 3-2. Page Router에서 SSR

- `getServerSideProps` 사용
- 라우트에 요청이 올 때마다 실행

```tsx
// pages/dashboard.tsx
export async function getServerSideProps() {
  const user = await getUserFromSession();
  const dashboard = await getDashboardData(user.id);

  return {
    props: { dashboard },
  };
}
```

사용 예시는:

- 로그인 사용자 전용 대시보드
- 요청 시점의 필터/쿼리 파라미터에 따라 결과가 바뀌는 페이지

### 3-3. App Router에서 SSR이 되는 조건

App Router에서는 **"이건 SSR이야"라고 선언하는 API가 없습니다.**  
대신 **다음 조건 중 하나라도 만족하면 SSR 모드로 동작**합니다.

1. **dynamic API 사용**
   - `cookies()`, `headers()`, `searchParams` 등
   - 심지어 `fetch` 결과가 캐시되어 있어도, 이들을 쓰는 순간 **dynamic 페이지**가 되어 SSR로 간주
2. dynamic API는 없지만, `fetch`를 **캐시하지 않도록 명시**
   - `cache: 'no-store'`
   - 혹은 `next: { revalidate: 0 }`

정리하면:

- **사용자별, 요청별로 항상 달라지는 데이터**가 있다면 → SSR
- 캐시를 아예 안 쓰기로 마음먹었다면 → SSR

> **정리:**  
> **SSR = "요청이 올 때마다 새로 만들어야 하는 페이지"**  
> App Router에서는 "static할 수 없으면 SSR로 떨어진다"에 가깝습니다.

---

## 4. ISR – Incremental Static Regeneration

### 4-1. 개념

ISR은 한 줄로 요약하면:

> **"정적이지만, 살아 있는 페이지"**

- 기본은 SSG처럼 **정적 HTML**
- 하지만 **주기적으로 백그라운드에서 다시 생성**해서, 데이터가 너무 오래 낡지 않도록 유지

### 4-2. Page Router에서 ISR

Page Router에서는 `getStaticProps` 안에서 `revalidate` 값을 설정합니다.

```tsx
export async function getStaticProps() {
  const posts = await getLatestPosts();

  return {
    props: { posts },
    revalidate: 60, // 60초마다 백그라운드에서 재생성
  };
}
```

### 4-3. App Router에서 ISR

App Router에서는 훨씬 단순해졌습니다.

```tsx
// app/blog/page.tsx
export const revalidate = 60; // 60초 간 캐시, 이후 요청 시 백그라운드 재생성
```

의미는:

- **0~60초 사이 요청**: 기존에 만들어둔 HTML 그대로 사용
- **60초 이후 첫 요청**: 사용자는 이전 캐시를 그대로 보지만,  
  백그라운드에서 새 HTML을 생성해 다음 요청부터 반영

좋은 사용처:

- "초 단위로 바뀔 필요는 없지만, 너무 오래된 정보는 곤란한" 페이지
  - 인기 글 리스트
  - 가격표, 공지사항 모음

> **정리:**  
> **ISR = "SSG + 일정 주기로 자동 새로고침"**

---

## 5. Streaming Rendering – 쪼개서 먼저 보여주기

### 5-1. 왜 등장했나

기존 SSR의 가장 큰 문제는 **모든 과정이 순차적**이라는 점입니다.

1. 서버에서 모든 데이터 fetch
2. 서버에서 HTML 전체 렌더링
3. JS 번들 다운로드
4. Hydration

이 중 하나라도 느려지면, **전체 페이지가 같이 느려집니다.**

### 5-2. Streaming의 아이디어

Streaming은 **"준비된 것부터 먼저 보내자"**는 아이디어입니다.

- 레이아웃 뼈대, 헤더, 사이드바 등 **먼저 준비되는 HTML을 먼저 전송**
- 느린 API를 쓰는 영역은 `Suspense` 경계로 감싸서 **나중에 채워 넣기**
- 클라이언트는 "로딩 화면만 멍하니 보는" 대신,  
  **이미 어느 정도 사용 가능한 화면을 먼저 보게 됨**

결과적으로:

- **첫 화면이 훨씬 빨리 보이고**
- 사용자는 "기다리는 느낌"보다 "점점 채워지는 느낌"에 가깝게 경험합니다.

> **정리:**  
> **Streaming = "모든 게 다 준비될 때까지 기다리지 말고, 준비된 것부터 보내는 SSR"**

---

## 6. App Router에서 렌더링 방식이 결정되는 법

App Router에서 렌더링 방식은 **우리가 선택하는 것이 아니라, 우리가 작성한 코드의 성격으로부터 유도**됩니다.

### 6-1. 아주 거칠게 요약하면

1. **dynamic API (`cookies`, `headers` 등)를 쓰면 → SSR + Streaming**
2. dynamic API는 없지만 **캐시를 끈 fetch**를 쓰면 → SSR
3. **`revalidate` 값을 설정**하면 → ISR
4. 위에 해당하지 않고 **모두 캐시 가능**하면 → SSG

즉, 우리는 다음 두 가지만 고민하면 됩니다.

1. 이 데이터는 **사용자마다 달라지는가?**
2. 이 데이터는 **얼마나 자주 바뀌는가?**

나머지는:

- Next.js가 알아서 **static / dynamic / revalidate / streaming**을 조합해 줍니다.

---

## 7. 언제 무엇을 쓰면 좋을까? (상황별 가이드)

### 7-1. 블로그 글 상세 페이지

- 모든 사용자가 같은 내용을 봄
- 자주 수정되지 않음

→ **기본 SSG** (아무 설정도 안 해도 자동으로 SSG가 될 확률이 높음)

```tsx
// app/blog/[slug]/page.tsx
export const revalidate = 60 * 60; // 선택: 1시간에 한 번 정도 새로고침
```

### 7-2. 마이페이지 / 대시보드

- 로그인한 사용자마다 다른 데이터
- 실시간에 가까운 정보 필요

→ **SSR + Streaming**

- Server Component에서 `cookies()`로 유저 식별
- 느린 영역은 `Suspense`로 감싸 점진적 렌더링

### 7-3. 자주 바뀌는 리스트 (예: 인기 글, 공지 모음)

- 완전 실시간일 필요는 없지만
- 너무 오래된 정보는 곤란

→ **ISR (`revalidate` 초 단위 조절)**

```tsx
export const revalidate = 300; // 5분마다 한 번 새로고침
```

### 7-4. 검색 결과 페이지

- 쿼리 파라미터에 따라 결과가 계속 바뀜
- 캐시 전략에 따라 다르지만, 보통은 **SSR** 혹은 **완전 클라이언트 사이드**

App Router에서는:

- 단순 검색이라면 **Client Component + 클라이언트 fetch**
- 로그인/권한이 걸려 있다면 **SSR + Streaming** 쪽이 자연스러울 수 있음

---

## 8. 마무리: 이제는 "언제"보다 "의도"가 중요하다

Next.js의 렌더링 방식 변화는,

- **"정적 vs 동적" 중 하나를 고르던 시대**에서
- **"데이터 성격만 잘 표현하면, 나머지는 프레임워크가 알아서 결정해주는 시대"**로 옮겨가는 과정이라고 볼 수 있습니다.

App Router에서 우리가 할 일은:

1. 이 데이터가 **사용자별로 달라지는지**
2. 이 데이터가 **얼마나 자주 바뀌는지**
3. 유저에게 **얼마나 빨리 보여줘야 하는지**

를 명확히 한 뒤, 그 의도를 코드로 표현하는 것입니다.

- 자주 안 바뀌고, 모두에게 같은 데이터라면 → **SSG / ISR**
- 요청마다 달라져야 한다면 → **SSR + Streaming**
- 느린 부분이 있다면 → **`Suspense`로 쪼개서 먼저 보여주기**

Next.js의 렌더링 방식은 단순히 "어떤 방식을 선택할 것인가"의 문제가 아닙니다. **데이터의 특성과 사용자 경험을 명확히 정의**하면, Next.js가 최적의 렌더링 전략을 자동으로 선택합니다.

App Router에서는 이러한 철학이 더욱 명확해졌습니다. 개발자는 비즈니스 로직과 데이터 흐름에 집중하고, 나머지는 프레임워크에 맡기는 것이 현대적인 접근 방식입니다.
