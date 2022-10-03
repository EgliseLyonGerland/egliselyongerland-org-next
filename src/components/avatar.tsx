import { Root, Fallback } from "@radix-ui/react-avatar";
import Image from "next/future/image";

type Props = {
  firstName: string;
  lastName: string;
  url: string;
};

const Avatar = ({ firstName, lastName, url }: Props) => {
  return (
    <Root className="relative h-12 w-12 overflow-hidden rounded-full inline-flex-center">
      <Image src={url} alt={`${firstName} ${lastName}`} fill />
      <Fallback className="h-full w-full bg-stale text-lg font-bold text-white flex-center">
        {`${firstName[0] + lastName[0]}`.toUpperCase()}
      </Fallback>
    </Root>
  );
};

export default Avatar;
