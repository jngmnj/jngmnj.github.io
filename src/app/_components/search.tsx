'use client';
import { RiSearch2Line } from '@remixicon/react';
import { useEffect, useState } from 'react';

type SearchResult = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
};
export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [index, setIndex] = useState<SearchResult[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/search.json');
      const data = await response.json();
      setIndex(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      index.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q)
      )
    );
  }, [query, index]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    // event bubbling 방지
    if (e.target !== e.currentTarget) return;
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };
  return (
    <div className="relative">
      <RiSearch2Line onClick={() => setIsOpen(!isOpen)} className="h-5 w-5" />
      {isOpen && (
        // fade 배경 blur
        <div
          className="fixed inset-0 w-full bg-black/0 backdrop-blur-xs"
          onClick={handleClose}
        >
          <div className="absolute top-1/4 left-1/2 z-50 w-200 max-w-4/5 -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-900 dark:bg-black">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="포스트를 검색하세요."
              className="w-full rounded border p-2"
            />
            <ul className="mt-2 space-y-2">
              {results.length === 0 && <li>결과가 없습니다.</li>}
              {results.map((r) => (
                <li key={r.slug}>
                  <a
                    href={`/posts/${r.slug}`}
                    className="text-primary-600 hover:underline"
                  >
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
