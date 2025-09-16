'use client';
import { handleImageError } from '@/lib/handleImageError';
import cn from 'classnames';
import Image from 'next/image';

type Props = {
  title: string;
  src: string;
  isThumbnail?: boolean;
};

const CoverImage = ({ title, src, isThumbnail }: Props) => {
  return (
    <Image
      src={src || '/assets/common/img_default-cover.png'}
      alt={`Cover Image for ${title}`}
      className={cn('w-full', {
        'h-full object-cover duration-200 group-hover:scale-105 group-hover:transition-transform':
          isThumbnail,
      })}
      width={1300}
      height={630}
      onError={handleImageError}
    />
  );
};

export default CoverImage;
