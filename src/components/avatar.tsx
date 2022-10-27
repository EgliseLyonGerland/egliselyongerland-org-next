import { Root, Fallback } from "@radix-ui/react-avatar";
import clsx from "clsx";
import Image from "next/future/image";

type Props = {
  className?: string;
  firstName: string;
  lastName: string;
  url: string;
};

const Avatar = ({ className = "", firstName, lastName, url }: Props) => {
  return (
    <Root
      className={clsx(
        className,
        "relative h-12 w-12 overflow-hidden rounded-full inline-flex-center"
      )}
    >
      <Image src={url} alt={`${firstName} ${lastName}`} fill />
      <Fallback className="h-full w-full bg-stale text-lg font-bold text-white flex-center">
        {`${firstName[0] + lastName[0]}`.toUpperCase()}
      </Fallback>
    </Root>
  );
};

export default Avatar;
