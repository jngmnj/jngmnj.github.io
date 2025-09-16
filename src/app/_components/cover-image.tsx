'use client';
import { handleImageError } from '@/lib/handleImageError';
import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  title: string;
  src?: string;
  slug?: string;
};

const CoverImage = ({ title, src, slug }: Props) => {
  const image = (
    <Image
      src={src || '/images/cover.png'}
      alt={`Cover Image for ${title}`}
      className={cn('w-full', {
        'duration-200 hover:scale-125 hover:transition-transform': slug,
      })}
      width={1300}
      height={630}
      onError={handleImageError}
    />
  );
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
