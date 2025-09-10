type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="container mx-auto px-5 pt-8 pb-32">{children}</div>;
};

export default Container;
