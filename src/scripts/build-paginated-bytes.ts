import fs from 'fs';
import path from 'path';
import { getAllShorts } from '@/lib/api';
import markdownToHtml from '@/lib/markdownToHtml';

const POSTS_PER_PAGE = 6;

async function buildPaginatedBytes() {
  try {
    const allShorts = getAllShorts();

    // 날짜순으로 정렬 (최신순)
    allShorts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const totalPages = Math.ceil(allShorts.length / POSTS_PER_PAGE);

    // public/data 디렉토리 생성
    const dataDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 페이지별로 분할하여 JSON 파일 생성
    for (let page = 1; page <= totalPages; page++) {
      const startIndex = (page - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      const pageShorts = allShorts.slice(startIndex, endIndex);
      
      // 마크다운을 HTML로 변환
      const processedShorts = await Promise.all(
        pageShorts.map(async (short) => {
          const { html } = await markdownToHtml(short.content || '');
          return {
            ...short,
            content: html,
          };
        })
      );

      const result = {
        data: processedShorts,
        currentPage: page,
        totalPages: totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        hasNextPage: page < totalPages,
      };

      const filePath = path.join(dataDir, `bytes-${page}.json`);
      fs.writeFileSync(filePath, JSON.stringify(result));

      console.log(`Generated ${filePath} with ${processedShorts.length} items`);
    }

    console.log(`Successfully generated ${totalPages} pages`);
  } catch (error) {
    console.error('Error building paginated bytes:', error);
    process.exit(1);
  }
}

buildPaginatedBytes();
