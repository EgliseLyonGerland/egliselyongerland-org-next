import { ElementType, forwardRef, ReactNode } from "react";

type Props<D extends ElementType> = {
  children: ReactNode;
  as?: D;
  href?: string;
  onClick?: () => void;
} & React.ComponentPropsWithoutRef<D>;

const Button = forwardRef(function Button<D extends ElementType = "button">(
  { children, as, ...rest }: Props<D>,
  ref: React.ComponentPropsWithRef<D>["ref"]
) {
  const Component = as || "button";

  return (
    <Component
      className="bg-pop text-white h-12 px-5 rounded-md shadow-md flex-center"
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  );
});

export default Button;
