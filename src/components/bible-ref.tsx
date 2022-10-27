import { BibleRef } from "../types/graphql";

type Props = {
  bibleRef: BibleRef;
};

const BibleRef = ({
  bibleRef: { book, chapterStart, chapterEnd, verseStart, verseEnd },
}: Props) => {
  if (!chapterStart) {
    return <span>{book}</span>;
  }

  const dot = <span className="mx-[0.1em]">.</span>;
  const dash = <span className="mx-[0.2em]">–</span>;

  if (!verseStart) {
    return (
      <span>
        {book}
        <span className="ml-1">
          {chapterStart === chapterEnd ? (
            chapterStart
          ) : (
            <>
              {chapterStart}
              {dash}
              {chapterEnd}
            </>
          )}
        </span>
      </span>
    );
  }

  return (
    <>
      {book}
      <span className="ml-1">
        {chapterStart === chapterEnd ? (
          <>
            {verseStart === verseEnd ? (
              <>
                {chapterStart}
                {dot}
                {verseStart}
              </>
            ) : (
              <>
                {chapterStart}
                {dot}
                {verseStart}
                {dash}
                {verseEnd}
              </>
            )}
          </>
        ) : (
          <>
            {chapterStart}
            {dot}
            {verseStart}
            {dash}
            {chapterEnd}
            {dot}
            {verseEnd}
          </>
        )}
      </span>
    </>
  );
};

export default BibleRef;
