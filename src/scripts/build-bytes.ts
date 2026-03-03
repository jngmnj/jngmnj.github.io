import { getAllShorts } from '@/lib/api';
import fs from 'fs';
import path from 'path';

// 1. 모든 포스트 데이터 로드 (함수는 본인의 환경에 맞게 수정)
const allPosts = getAllShorts();
const POSTS_PER_PAGE = 10;

// 2. 데이터 쪼개기 및 저장
for (let i = 0; i < Math.ceil(allPosts.length / POSTS_PER_PAGE); i++) {
  const chunk = allPosts.slice(i * POSTS_PER_PAGE, (i + 1) * POSTS_PER_PAGE);
  const pageNum = i + 1;

  // public/data/posts-1.json 형태로 저장
  fs.writeFileSync(
    path.join(process.cwd(), `public/data/posts-${pageNum}.json`),
    JSON.stringify({
      data: chunk,
      nextPage: (i + 1) * POSTS_PER_PAGE < allPosts.length ? pageNum + 1 : null,
    })
  );
}
