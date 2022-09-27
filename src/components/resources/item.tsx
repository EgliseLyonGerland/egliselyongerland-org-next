import { format } from "date-fns";
import locale from "date-fns/locale/fr";
import Image from "next/future/image";
import Link from "next/link";

import { GetResourcesQuery } from "../../types/graphql";
import Avatar from "../avatar";

type Props = {
  data: GetResourcesQuery["posts"]["edges"][number]["node"];
};

function toDate(date: string): Date {
  const [day, month, year] = date.split("/");

  return new Date(`${year}-${month}-${day}`);
}

const Item = ({ data }: Props) => {
  const date = data.event.sermonDate
    ? toDate(data.event.sermonDate)
    : new Date(data.date);

  return (
    <div className="flex gap-10">
      <div
        className="relative w-[30%] max-w-xs flex-shrink-0 "
        style={{ paddingBottom: "20%" }}
      >
        <Image
          src={data.featuredImage.node.sourceUrl}
          alt={data.title}
          className="rounded-lg"
          fill
        />
      </div>
      <div className="flex-grow-0">
        <div className="mb-4">
          <Link href={`/resources/${data.databaseId}`}>
            <a className="font-suez text-2xl">{data.title}</a>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Avatar
            firstName={data.author.node.firstName}
            lastName={data.author.node.lastName}
            url={data.author.node.avatar.url}
          />
          <div>
            <div className="text-lg font-bold">{data.author.node.name}</div>
            <div className="opacity-70">
              {format(date, "dd/MM/yy", { locale })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
