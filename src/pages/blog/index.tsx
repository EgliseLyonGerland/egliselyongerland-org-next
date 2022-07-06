import { gql } from "@apollo/client";
import { omit } from "lodash";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { books } from "../../config/bible";
import { getClient } from "../../services/appolo";
import {
  GetBlogIndexPostsQuery,
  GetBlogIndexPostsQueryVariables,
} from "../../types/graphql";

type Props = {
  posts: GetBlogIndexPostsQuery["posts"]["nodes"];
};

const Blog = ({ posts }: Props) => {
  const router = useRouter();

  const push = (key: string, value: string) => {
    if (value) {
      router.push({
        pathname: "/blog",
        query: { ...router.query, [key]: value },
      });
    } else {
      router.push({
        pathname: "/blog",
        query: omit(router.query, key),
      });
    }
  };

  return (
    <div>
      <h2>Blog</h2>

      <div>
        <select
          defaultValue={router.query.book}
          onChange={(event) => {
            push("book", event.target.value);
          }}
        >
          <option value="">Tous</option>
          {books.map((book) => (
            <option key={book} value={book}>
              {book}
            </option>
          ))}
        </select>

        <input
          placeholder="Chapitre"
          defaultValue={router.query.chapter}
          disabled={!router.query.book}
          style={{ width: 30 }}
          onChange={(event) => {
            push("chapter", event.target.value);
          }}
        />

        <input
          placeholder="Verset"
          defaultValue={router.query.verse}
          disabled={!router.query.book || !router.query.chapter}
          style={{ width: 30 }}
          onChange={(event) => {
            push("verse", event.target.value);
          }}
        />
      </div>

      <ul>
        {posts.map((post) => (
          <li key={post.databaseId}>
            <Link href={`/blog/post/${post.databaseId}`}>{post.title}</Link>
            {post.bibleRefs.length > 0 && (
              <span> ({post.bibleRefs.map((ref) => ref.raw).join(", ")})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { book: string; chapter: string; verse: string }
> = async ({ query: { book, chapter, verse } }) => {
  const { data } = await getClient().query<
    GetBlogIndexPostsQuery,
    GetBlogIndexPostsQueryVariables
  >({
    query: gql`
      query GetBlogIndexPosts($book: String, $chapter: Int, $verse: Int) {
        posts(
          first: 100
          where: {
            bibleRefBook: $book
            bibleRefChapter: $chapter
            bibleRefVerse: $verse
          }
        ) {
          nodes {
            databaseId
            title
            bibleRefs {
              raw
            }
          }
        }
      }
    `,
    variables: {
      book: (book as string) || null,
      chapter: (book && Number(chapter)) || null,
      verse: (book && chapter && Number(verse)) || null,
    },
  });

  return {
    props: {
      posts: data.posts.nodes,
    },
  };
};

export default Blog;
