import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString);
  return (
    <time dateTime={dateString}>
      {format(date, 'yyyy년 MM월 dd일', { locale: ko })}
    </time>
  );
};

export default DateFormatter;
