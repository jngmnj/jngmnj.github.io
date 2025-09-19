---
title: '타이포그래피 관리: 컴포넌트 vs 클래스 네이밍'
excerpt: '프로젝트를 하다 보면 텍스트 스타일을 어떻게 관리할지가 늘 고민거리입니다. Tailwind를 쓰면 text-lg, text-xl 같은 유틸리티 클래스 덕분에 빠르게 작업할 수 있지만, 서비스가 커지면 일관성을 유지하기 어려워집니다.'
date: '2025-09-17T05:35:07.322Z'
category: 'develop'
---

# 타이포그래피, 컴포넌트로 관리할까? 클래스 네이밍으로 할까?

프로젝트를 하다 보면 텍스트 스타일을 어떻게 관리할지가 늘 고민거리입니다. Tailwind를 쓰면 `text-lg`, `text-xl` 같은 유틸리티 클래스 덕분에 빠르게 작업할 수 있지만, 서비스가 커지면 일관성을 유지하기 어려워집니다. 타이포그래피 컴포넌트 와 의미 있는 클래스 네이밍, 두 가지 접근을 비교해보겠습니다.

## 타이포그래피 컴포넌트 세트

첫 번째는 **타이포그래피 컴포넌트 세트를 만드는 방식**입니다. 예를 들어 `<Heading level={2}>`나 `<BodyText>` 같은 컴포넌트를 만들어두고, 서비스 전반에서 이 컴포넌트만 쓰도록 강제하는 거죠. 장점은 분명합니다. 개발자가 직접 폰트 크기나 라인 높이를 고민할 필요가 없고, 디자인 시스템이 코드 레벨에서 강제되니 일관성이 높습니다. 나중에 스타일을 바꾸더라도 컴포넌트 내부만 수정하면 전체 서비스에 반영되는 것도 큰 장점입니다. 다만, 코드가 다소 장황해지고 작은 프로젝트에서는 오버엔지니어링처럼 느껴질 수 있습니다. `<p>` 하나 쓰면 될 자리에 `<BodyText>`를 굳이 임포트해서 써야 하니까요.

<!-- 이 방식은 `Heading`, `BodyText`, `Caption` 같은 컴포넌트를 만들어두고, 모든 텍스트를 이 컴포넌트로만 작성하는 겁니다. -->

```tsx
// Typography.tsx
export function Heading({ level = 1, children }) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className="text-2xl font-bold">{children}</Tag>;
}

export function BodyText({ children }) {
  return <p className="text-base leading-relaxed">{children}</p>;
}

export function Caption({ children }) {
  return <span className="text-sm text-gray-500">{children}</span>;
}
```

사용할 때는 이렇게 씁니다:

```tsx
<Heading level={2}>프로젝트 소개</Heading>
<BodyText>이 프로젝트는...</BodyText>
<Caption>2025년 작성</Caption>
```

**장점**

- 디자인 시스템이 **코드 레벨에서 강제**됨
- 스타일을 바꾸더라도 **컴포넌트 내부만 수정**하면 전체 반영
- 접근성, 시맨틱 태그 매핑 등을 쉽게 포함 가능

**단점**

- 코드가 장황해지고, 작은 프로젝트에서는 오버엔지니어링처럼 느껴짐
- `<p>` 하나 쓰면 될 자리에 굳이 `<BodyText>`를 임포트해야 함

## 의미 있는 클래스 네이밍

두 번째는 **의미 있는 클래스 네이밍을 도입하는 방식**입니다. Tailwind의 `text-lg`, `text-xl` 같은 숫자 기반 네이밍 대신 `text-body`, `text-heading`, `text-caption`처럼 의미 기반 클래스를 만들어 쓰는 겁니다. 이렇게 하면 기존 태그 구조를 그대로 유지하면서도 “이 텍스트는 본문인지, 제목인지”를 명확히 드러낼 수 있습니다. 도입도 간단하고, 코드도 간결하게 유지할 수 있죠. 단점은 컴포넌트 방식만큼 강제력이 없다는 겁니다. 팀원마다 실수로 `text-lg` 같은 기본 유틸리티를 섞어 쓰면, 일관성이 조금씩 무너질 수 있습니다.

<!-- 두 번째 방법은 Tailwind 설정이나 CSS 전역에서 `text-body`, `text-heading`, `text-caption` 같은 의미 기반 클래스를 정의하는 겁니다. -->

```js
// tailwind.config.js
theme: {
  extend: {
    fontSize: {
      body: '16px',
      heading: '20px',
      caption: '14px'
    }
  }
}
```

```tsx
<h2 className="text-heading">프로젝트 소개</h2>
<p className="text-body">이 프로젝트는...</p>
<span className="text-caption">2025년 작성</span>
```

**장점**

- 코드가 간결하고, 기존 태그를 그대로 활용 가능
- 도입과 유지보수가 간단함
- 의미 기반 네이밍으로 가독성 향상

**단점**

- 강제력이 약해 팀원에 따라 `text-lg`, `text-xl` 같은 숫자 기반 클래스를 섞어 쓸 위험 있음
- 리뷰 프로세스에서 관리하지 않으면 쉽게 무너짐

## 맺으며

제가 느낀 건 이렇습니다. **작은 프로젝트나 빠른 사이클이 중요한 경우에는 의미 있는 클래스 네이밍으로도 충분하다**는 점입니다. 빠르고 가볍게 시스템을 적용할 수 있거든요. 반대로 **규모가 커지고 장기적으로 운영되는 서비스라면 컴포넌트 세트 방식이 훨씬 안정적**입니다. 강제성(컴포넌트 API로 의미를 강제)과 확장성이 있기 때문에 팀 단위 협업에 적합합니다.

> - 작은 프로젝트 / 사이드 프로젝트 → **의미 있는 클래스 네이밍**
> - 큰 규모 / 장기 운영 서비스 → **타이포그래피 컴포넌트 세트**

결국 중요한 건 "우리 팀의 상황"인것 같습니다.
