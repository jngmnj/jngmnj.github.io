import { getRelativeTime } from '@/lib/getRelativeTime';

type Props = {
  dateString: string;
  className?: string;
};

const RelativeDateFormatter = ({ dateString, className }: Props) => {
  return (
    <time dateTime={dateString} className={className}>
      {getRelativeTime(dateString)}
    </time>
  );
};

export default RelativeDateFormatter;
