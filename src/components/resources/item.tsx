import { format } from "date-fns";
import locale from "date-fns/locale/fr";
import Image from "next/future/image";
import Link from "next/link";

import { resources } from "../../libs/utils/routing";
import { GetResourcesQuery } from "../../types/graphql";
import Avatar from "../avatar";
import BibleRef from "../bible-ref";

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

  const bibleRef = data.bibleRefs[0];

  return (
    <div className="group flex cursor-pointer gap-10">
      <div className="h-50 relative w-[30%] max-w-xs flex-shrink-0 overflow-hidden transition-transform group-hover:scale-[105%]">
        <Image
          src={data.featuredImage.node.sourceUrl}
          alt={data.title}
          className="rounded-lg object-cover"
          fill
        />
      </div>
      <div className="prose flex-grow-0 py-1 prose-a:no-underline">
        <div className="mb-4">
          <Link href={`/resources/${data.databaseId}`}>
            <a className="font-suez text-3xl">{data.title}</a>
          </Link>
        </div>
        <div className="mb-8 flex gap-2">
          {bibleRef && (
            <Link
              href={resources({
                book: bibleRef.book,
                chapter: bibleRef.chapterStart,
              })}
            >
              <a className="inline-block rounded-full bg-stale px-4 py-1 text-sm hover:bg-pop hover:text-white">
                <BibleRef bibleRef={bibleRef} />
              </a>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Avatar
            className="not-prose"
            firstName={data.author.node.firstName}
            lastName={data.author.node.lastName}
            url={data.author.node.avatar.url}
          />
          <div className="prose-md">
            <div className="font-bold">
              <Link href={resources({ author: data.author.node.databaseId })}>
                <a>{data.author.node.name}</a>
              </Link>
            </div>
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
