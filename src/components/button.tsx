import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
};

const Button = ({
  children,
  as: Component = "button",
  href,
  onClick,
}: Props) => {
  const props: Partial<Pick<Props, "href" | "onClick">> = {};

  if (Component === "a" && href) {
    props.href = href;
  }
  if (onClick) {
    props.onClick = onClick;
  }

  return (
    <Component
      className="bg-tertiary text-white h-14 px-6 rounded-md shadow-md flex-center"
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;