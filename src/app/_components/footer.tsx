import { RiGithubLine, RiInstagramLine } from '@remixicon/react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-black py-8">
      <div className="flex items-center justify-center">
        <Link href="https://github.com/jngmnj" target="_blank">
          <div className="p-4">
            <RiGithubLine className="size-6 text-white" />
          </div>
        </Link>
        <Link href="https://instagram.com/jngmnj" target="_blank">
          <div className="p-4">
            <RiInstagramLine className="size-6 text-white" />
          </div>
        </Link>
      </div>
      <div className="">
        <p className="text-center text-white">&copy; {currentYear} jngmnj</p>
      </div>
    </footer>
  );
}

export default Footer;
