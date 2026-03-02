import { Bytes } from '@/interfaces/bytes';
import { BytesItem } from './bytes-item';

type Props = {
  bytes: Bytes[];
};

export function BytesList({ bytes }: Props) {
  return (
    <div className="grid grid-cols-1 gap-y-10 md:gap-y-12">
      {bytes.map((byte) => (
        <BytesItem
          key={byte.slug}
          content={byte.content}
          date={byte.date}
          tags={byte.tags}
        />
      ))}
    </div>
  );
}
