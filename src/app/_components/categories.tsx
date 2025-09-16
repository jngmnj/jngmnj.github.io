import { getAllCategories } from '@/lib/api';
import Link from 'next/link';

export default function Categories({
  category,
}: {
  category: string | undefined;
}) {
  const categories = getAllCategories();

  return (
    <ul className="mb-8 flex flex-wrap gap-3">
      <li key="all">
        <Link
          href="/blog/category"
          className={`rounded px-4 py-2 ${
            category
              ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              : 'bg-primary-500 text-white'
          }`}
        >
          All
        </Link>
      </li>
      {categories.map((cat) => (
        <li key={cat}>
          <Link
            href={`/blog/category/${cat}`}
            className={`rounded px-4 py-2 ${
              category === cat
                ? 'bg-primary-500 text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {cat}
          </Link>
        </li>
      ))}
    </ul>
  );
}
