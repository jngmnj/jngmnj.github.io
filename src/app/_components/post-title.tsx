import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export function PostTitle({ children }: Props) {
  return (
    <h1 className="mb-6 text-4xl leading-tight font-semibold tracking-tighter md:mb-8 md:text-4xl md:leading-none lg:text-5xl">
      {children}
    </h1>
  );
}
