import cn from 'classnames';

type Props = {
  children?: React.ReactNode;
  className?: string;
  narrow?: boolean;
};

const Container = ({ children, className, narrow }: Props) => {
  return (
    <div
      className={cn(
        'container mx-auto px-5 pt-18 pb-32',
        narrow ? 'narrow' : '',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
