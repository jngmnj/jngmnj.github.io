---
title: '자바스크립트 함수형 프로그래밍: go, pipe, curry로 코드를 더 깔끔하게'
excerpt: '함수형 프로그래밍의 핵심 개념인 go, pipe, curry를 직접 구현하고 실전에서 어떻게 활용하는지 알아보겠습니다.'
date: '2025-10-06'
category: 'develop'
---

자바스크립트에서 함수형 프로그래밍은 코드를 더 읽기 쉽고 유지보수하기 쉽게 만드는 강력한 패러다임입니다. 이번 글에서는 함수형 프로그래밍의 핵심인 `go`, `pipe`, `curry` 함수를 직접 구현하고 실전에서 어떻게 활용하는지 알아보겠습니다.

## 함수형 프로그래밍이란?

함수형 프로그래밍은 **함수를 일급 객체로 취급**하고, **불변성**과 **순수 함수**를 중시하는 프로그래밍 패러다임입니다.

### go, pipe, curry의 기원

**중요한 점**: `go`, `pipe`, `curry`는 **자바스크립트의 공식 문법이 아닙니다**. 브라우저나 Node.js에 내장된 함수가 아니라, 함수형 프로그래밍의 개념을 자바스크립트에 응용하기 위해 개발자들이 **직접 만든 추상화 도구**입니다.

| 개념              | 기원                                                                               | 자바스크립트에서 확산된 배경                                                                         |
| ----------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **`curry`**       | 1940~50년대 수학자 **Haskell Curry**의 개념에서 유래<br>(그래서 이름이 'currying') | 함수형 언어(Lisp, Haskell, ML)에서 기본 개념 → JS 커뮤니티(특히 Lodash, Ramda, Functional JS)로 전파 |
| **`pipe` / `go`** | Unix 철학의 "파이프(pipe)"에서 영감                                                | Ramda, Lodash/fp 등에서 함수 조합용으로 구현되어 널리 사용됨                                         |

즉, **함수형 언어 전통(Haskell, Lisp, ML)**에서 나온 개념을, **자바스크립트 개발자들(Ramda.js, Lodash/fp 등)**이 "자바스크립트에서도 함수형 스타일로 프로그래밍하자!" 하면서 가져온 것입니다.

### 주요 라이브러리에서의 구현

#### 1. Ramda.js

```javascript
import R from 'ramda';

const totalUnder20k = R.pipe(
  R.filter((p) => p.price < 20000),
  R.map((p) => p.price),
  R.reduce((a, b) => a + b, 0)
)(products);
```

#### 2. Lodash/fp

```javascript
import fp from 'lodash/fp';

const totalUnder20k = fp.flow(
  fp.filter((p) => p.price < 20000),
  fp.map('price'),
  fp.reduce((a, b) => a + b, 0)
)(products);
```

#### 3. 순수 자바스크립트 구현

이번 글에서 다룰 `go`, `pipe`, `curry`는 라이브러리 없이 순수 자바스크립트만으로 구현한 버전입니다.

### 각 함수의 역할 정리

| 함수               | 의미             | 하는 일                                                                                         |
| ------------------ | ---------------- | ----------------------------------------------------------------------------------------------- |
| **`curry(f)`**     | 커링(currying)   | 인자를 한 번에 다 받지 않고, **하나씩 나눠 받는 함수**로 변환                                   |
| **`pipe(...fns)`** | 파이프(pipe)     | 여러 함수를 왼쪽→오른쪽으로 차례로 실행 (Ramda 스타일)                                          |
| **`go(...args)`**  | 즉시 실행형 pipe | 첫 번째 인자를 데이터로 받아, 나머지 함수들을 **즉시 순차 적용** (함수형 JS 실습용 custom 버전) |

예시:

```javascript
go(
  products,
  filter((p) => p.price < 20000),
  map((p) => p.price),
  reduce((a, b) => a + b),
  log
);
```

→ 실제로는 `pipe` + `curry`를 이용한 sugar syntax일 뿐입니다.

### 함수형 프로그래밍의 핵심 원칙

1. **순수 함수**: 같은 입력에 항상 같은 출력을 반환
2. **불변성**: 데이터를 변경하지 않고 새로운 데이터를 생성
3. **함수 조합**: 작은 함수들을 조합하여 복잡한 로직 구성
4. **부수 효과 최소화**: 함수 외부 상태에 영향을 주지 않음

## 기존 코드의 문제점

```javascript
// 전통적인 명령형 프로그래밍
const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000 },
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 },
];

// 문제가 있는 코드
let result = [];
for (let i = 0; i < products.length; i++) {
  if (products[i].price < 20000) {
    result.push(products[i].price);
  }
}

let sum = 0;
for (let i = 0; i < result.length; i++) {
  sum += result[i];
}

console.log(sum); // 30000
```

이런 코드의 문제점:

- **가독성**: 코드의 의도를 파악하기 어려움
- **중첩**: 복잡한 로직이 중첩되어 이해하기 어려움
- **재사용성**: 특정 상황에만 사용 가능
- **테스트**: 전체 로직을 테스트해야 함

## 함수형 프로그래밍의 해결책

### 1. curry - 함수를 부분 적용 가능하게 만들기

커링은 **여러 인자를 받는 함수를, 한 번에 하나의 인자씩 받을 수 있는 함수로 바꾸는 기법**입니다.

```javascript
const curry =
  (f) =>
  (a, ...rest) =>
    rest.length ? f(a, ...rest) : (...rest2) => f(a, ...rest2);

// 사용 예시
const add = (a, b) => a + b;
const cAdd = curry(add);

console.log(cAdd(1, 2)); // 3 (두 개 다 받았으니 즉시 실행)
console.log(cAdd(1)(2)); // 3 (한 개만 받았으니 다시 함수 반환)
```

#### curry의 장점

```javascript
// 전통적인 방식
const multiply = (a, b) => a * b;
const double = (x) => multiply(2, x);
const triple = (x) => multiply(3, x);

// curry를 사용한 방식
const cMultiply = curry(multiply);
const double = cMultiply(2);
const triple = cMultiply(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

### 2. go - 즉시 실행 파이프라인

`go`는 **첫 번째 인자를 데이터로 받고, 나머지 함수를 차례대로 적용**하는 함수입니다.

```javascript
const go = (...args) => reduce((a, f) => f(a), args);

// 사용 예시
go(
  0,
  (a) => a + 1, // 1
  (a) => a + 10, // 11
  (a) => a * 2, // 22
  console.log // 22 출력
);
```

#### go의 장점

```javascript
// 전통적인 방식 (중첩이 복잡)
const result = multiply(add(add(0, 1), 10), 2);

// go를 사용한 방식 (위에서 아래로 읽기 쉬움)
go(
  0,
  (a) => a + 1,
  (a) => a + 10,
  (a) => a * 2,
  console.log
);
```

### 3. pipe - 함수 조합용 파이프라인

`pipe`는 **여러 함수를 하나로 합성하는 함수**입니다. 즉시 실행하지 않고 새로운 함수를 반환합니다.

```javascript
const pipe =
  (f, ...fs) =>
  (...as) =>
    go(f(...as), ...fs);

// 사용 예시
const f = pipe(
  (a) => a + 1,
  (a) => a * 2,
  (a) => a - 3
);

console.log(f(5)); // ((5 + 1) * 2) - 3 = 9
```

#### pipe의 장점

```javascript
// 재사용 가능한 함수 조합
const processNumber = pipe(
  (x) => x * 2,
  (x) => x + 1,
  (x) => x * 3
);

console.log(processNumber(5)); // 33
console.log(processNumber(10)); // 63
```

## 실전 예제: 상품 데이터 처리

### 기본 배열 메서드 활용

```javascript
const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000 },
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 },
];

// 전통적인 방식
const cheapProducts = products.filter((p) => p.price < 20000);
const prices = cheapProducts.map((p) => p.price);
const total = prices.reduce((sum, price) => sum + price, 0);
console.log(total); // 30000
```

### go를 사용한 개선

```javascript
go(
  products,
  (products) => products.filter((p) => p.price < 20000),
  (products) => products.map((p) => p.price),
  (prices) => prices.reduce((sum, price) => sum + price, 0),
  console.log // 30000
);
```

### curry와 함께 사용

```javascript
// curry된 함수들
const cFilter = curry((f, iter) => iter.filter(f));
const cMap = curry((f, iter) => iter.map(f));
const cReduce = curry((f, acc, iter) => iter.reduce(f, acc));

// 사용
go(
  products,
  cFilter((p) => p.price < 20000),
  cMap((p) => p.price),
  cReduce((sum, price) => sum + price, 0),
  console.log // 30000
);
```

### pipe로 재사용 가능한 함수 생성

```javascript
// 재사용 가능한 함수 조합
const getCheapProductsTotal = pipe(
  cFilter((p) => p.price < 20000),
  cMap((p) => p.price),
  cReduce((sum, price) => sum + price, 0)
);

const getExpensiveProductsTotal = pipe(
  cFilter((p) => p.price >= 20000),
  cMap((p) => p.price),
  cReduce((sum, price) => sum + price, 0)
);

console.log(getCheapProductsTotal(products)); // 30000
console.log(getExpensiveProductsTotal(products)); // 75000
```

## 고급 활용 예제

### 1. 복잡한 데이터 변환

```javascript
const users = [
  { id: 1, name: 'John', age: 25, city: 'Seoul' },
  { id: 2, name: 'Jane', age: 30, city: 'Busan' },
  { id: 3, name: 'Bob', age: 35, city: 'Seoul' },
  { id: 4, name: 'Alice', age: 28, city: 'Daegu' },
];

// 서울에 거주하는 30세 이상 사용자의 이름을 대문자로 변환
go(
  users,
  cFilter((user) => user.city === 'Seoul'),
  cFilter((user) => user.age >= 30),
  cMap((user) => user.name.toUpperCase()),
  console.log // ['BOB']
);
```

### 2. 비동기 처리와 함께 사용

```javascript
const fetchUser = async (id) => {
  // 실제로는 API 호출
  return { id, name: `User${id}`, email: `user${id}@example.com` };
};

const processUsers = pipe(
  cMap(fetchUser),
  async (promises) => await Promise.all(promises),
  cMap((user) => ({ ...user, name: user.name.toUpperCase() }))
);

// 사용
processUsers([1, 2, 3]).then(console.log);
```

### 3. 에러 처리와 함께 사용

```javascript
const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

const processJsonData = pipe(
  safeParse,
  (data) => (data ? data : { error: 'Invalid JSON' }),
  (data) => (data.error ? data : { ...data, processed: true })
);

console.log(processJsonData('{"name": "John"}'));
// { name: 'John', processed: true }

console.log(processJsonData('invalid json'));
// { error: 'Invalid JSON' }
```

## 성능 고려사항

### 1. 메모리 사용량

```javascript
// 비효율적: 중간 배열들이 계속 생성됨
go(
  largeArray,
  cFilter((x) => x > 100),
  cMap((x) => x * 2),
  cFilter((x) => x < 1000)
);

// 효율적: 제너레이터 사용
const lazyFilter = curry(function* (f, iter) {
  for (const a of iter) {
    if (f(a)) yield a;
  }
});

const lazyMap = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});
```

### 2. 지연 평가

```javascript
// 즉시 평가: 모든 단계가 바로 실행됨
const result1 = go(
  [1, 2, 3, 4, 5],
  cMap((x) => x * 2),
  cFilter((x) => x > 4),
  cReduce((a, b) => a + b, 0)
);

// 지연 평가: 필요할 때만 실행됨
const lazyResult = pipe(
  lazyMap((x) => x * 2),
  lazyFilter((x) => x > 4),
  cReduce((a, b) => a + b, 0)
);
```

## 함수형 프로그래밍의 장단점

### 장점

1. **가독성**: 코드의 의도가 명확하게 드러남
2. **재사용성**: 작은 함수들을 조합하여 다양한 로직 생성
3. **테스트**: 순수 함수는 테스트하기 쉬움
4. **병렬 처리**: 부수 효과가 없어 병렬 처리에 안전
5. **디버깅**: 각 단계별로 디버깅 가능

### 단점

1. **학습 곡선**: 함수형 사고 방식에 익숙해져야 함
2. **성능**: 중간 배열 생성으로 인한 메모리 사용량 증가
3. **디버깅**: 복잡한 함수 체인에서 디버깅이 어려울 수 있음
4. **팀 협업**: 팀원 모두가 함수형 프로그래밍에 익숙해야 함

## 실무 적용 가이드

### 1. 점진적 도입

```javascript
// 기존 코드
const result = data
  .filter((x) => x.active)
  .map((x) => x.value)
  .reduce((sum, val) => sum + val, 0);

// 점진적 개선
const result = go(
  data,
  cFilter((x) => x.active),
  cMap((x) => x.value),
  cReduce((sum, val) => sum + val, 0)
);
```

### 2. 팀 컨벤션 설정

```javascript
// 팀에서 사용할 공통 함수들
const utils = {
  curry,
  go,
  pipe,
  cFilter: curry((f, iter) => iter.filter(f)),
  cMap: curry((f, iter) => iter.map(f)),
  cReduce: curry((f, acc, iter) => iter.reduce(f, acc)),
};
```

### 3. 성능 모니터링

```javascript
// 성능 측정 함수
const measure =
  (name, fn) =>
  (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${name}: ${end - start}ms`);
    return result;
  };

// 사용
const measuredProcess = measure('dataProcessing', processData);
```

## 마무리

함수형 프로그래밍의 `go`, `pipe`, `curry`는 코드를 더 읽기 쉽고 유지보수하기 쉽게 만드는 강력한 도구입니다.

### 꼭 써야 하나?

**아니요.** 하지만 **데이터 흐름이 복잡한 연산이 많을 때 가독성과 재사용성이 확 올라갑니다.**

### 언제 사용하면 좋을까?

- **복잡한 데이터 변환**: 여러 단계의 필터링, 매핑, 리듀싱이 필요한 경우
- **함수 조합**: 작은 함수들을 조합하여 복잡한 로직을 구성하는 경우
- **테스트 용이성**: 순수 함수로 구성된 코드는 테스트하기 쉬운 경우
- **팀 협업**: 일관된 코딩 스타일이 필요한 경우

### 실무 적용 팁

1. **점진적 도입**: 기존 코드를 한 번에 바꾸지 말고, 새로운 기능부터 적용
2. **팀 교육**: 팀원들이 함수형 사고에 익숙해질 수 있도록 교육
3. **성능 모니터링**: 함수 체인으로 인한 성능 영향 측정
4. **라이브러리 선택**: Ramda.js, Lodash/fp 등 검증된 라이브러리 활용

처음에는 익숙하지 않을 수 있지만, 점진적으로 도입하면서 팀의 생산성과 코드 품질을 크게 향상시킬 수 있습니다.
