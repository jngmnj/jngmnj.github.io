'use client';
import { RiCloseLine, RiSearch2Line } from '@remixicon/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type SearchResult = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  type?: string;
};

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [index, setIndex] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/search.json');
        const data = await response.json();
        setIndex(data);
      } catch (error) {
        console.error('Failed to load search index:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const filteredResults = index.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );

    // 제목 매치를 우선순위로 정렬
    const sortedResults = filteredResults.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(q);
      const bTitleMatch = b.title.toLowerCase().includes(q);

      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });

    setResults(sortedResults);
  }, [query, index]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // 포커스를 입력 필드에
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // 키보드 단축키 (Ctrl+K 또는 Cmd+K)
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

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      setResults([]);
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex cursor-pointer items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="검색"
        title="검색 (Ctrl+K 또는 Cmd+K)"
      >
        <RiSearch2Line className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div className="absolute top-1/4 left-1/2 w-full max-w-2xl -translate-x-1/2 transform px-4">
            <div className="rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
              {/* 검색 입력 영역 */}
              <div className="flex items-center border-b border-gray-200 p-4 dark:border-gray-700">
                <RiSearch2Line className="mr-3 h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="포스트를 검색하세요..."
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-2 cursor-pointer rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <RiCloseLine className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* 검색 결과 영역 */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    검색 인덱스를 로딩 중...
                  </div>
                ) : query.trim() === '' ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="mb-2">검색어를 입력해주세요</div>
                    <div className="text-xs text-gray-400">
                      키보드 단축키:{' '}
                      <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
                        Ctrl+K
                      </kbd>{' '}
                      또는{' '}
                      <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
                        Cmd+K
                      </kbd>
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    "{query}"에 대한 검색 결과가 없습니다
                  </div>
                ) : (
                  <div className="p-2">
                    {results.map((result) => {
                      const href =
                        result.type === 'short'
                          ? `/${result.slug}`
                          : `/blog/${result.slug}`;

                      return (
                        <Link
                          key={result.slug}
                          href={href}
                          onClick={handleResultClick}
                          className="block rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex flex-col space-y-1">
                            {result.type !== 'short' && (
                              <h3 className="line-clamp-1 font-medium text-gray-900 dark:text-gray-100">
                                {result.title}
                              </h3>
                            )}
                            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                              {result.excerpt}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {result.category}
                              </span>
                              {result.type === 'short' && (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                  짧은글
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
