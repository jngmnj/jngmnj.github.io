import Switcher from '@/app/_components/switcher';
import { RiExternalLinkLine } from '@remixicon/react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white py-4 dark:border-gray-900 dark:bg-black">
      <div className="container mx-auto px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="dark:brightness-0 dark:invert">
              <h1 className="sr-only">jngmnj's blog</h1>
              <Link href="/" className="block py-1 pr-2">
                <Image
                  src="/assets/common/logo_black.svg"
                  alt="Logo"
                  width={100}
                  height={27}
                />
              </Link>
            </div>
            <nav className="hidden md:block" aria-label="Main navigation">
              <ul className="flex items-center space-x-3 md:space-x-5">
                <li>
                  <Link
                    href="https://jngmnj-portfolio.vercel.app/about"
                    target="_blank"
                    className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    About
                    <RiExternalLinkLine className="mb-1 ml-1 inline h-4 w-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/category"
                    className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <Switcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
