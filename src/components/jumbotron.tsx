import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Jumbotron = ({ children }: Props) => {
  return <div className="bg-sand pt-[120px]">{children}</div>;
};

export default Jumbotron;
