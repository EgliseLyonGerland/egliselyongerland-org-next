import { ParsedUrlQuery } from "querystring";

import { gql, useQuery } from "@apollo/client";
import { omit } from "lodash";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { books } from "../../config/bible";
import { addApolloState, getClient } from "../../services/appolo";
import {
  GetResourcesQuery,
  GetResourcesQueryVariables,
} from "../../types/graphql";

type Props = {
  posts: GetResourcesQuery["posts"];
};

const getResources = ({ book, chapter, verse }: ParsedUrlQuery = {}) => ({
  query: gql`
    query GetResources(
      $book: String
      $chapter: Int
      $verse: Int
      $after: String
    ) {
      posts(
        first: 10
        after: $after
        where: {
          bibleRefBook: $book
          bibleRefChapter: $chapter
          bibleRefVerse: $verse
        }
      ) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
        }
        edges {
          cursor

          node {
            databaseId
            title
            bibleRefs {
              raw
            }
          }
        }
      }
    }
  `,
  variables: {
    book: (book as string) || null,
    chapter: (book && Number(chapter)) || null,
    verse: (book && chapter && Number(verse)) || null,
    after: null,
  },
});

const Resources = () => {
  const router = useRouter();

  const { query, variables } = getResources(router.query);

  const { refetch, data, fetchMore } = useQuery<
    GetResourcesQuery,
    GetResourcesQueryVariables
  >(query, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  const push = (key: string, value: string) => {
    if (value) {
      router.push({
        pathname: "/resources",
        query: { ...router.query, [key]: value },
      });

      refetch({ ...router.query, [key]: value });
    } else {
      router.push({
        pathname: "/resources",
        query: omit(router.query, key),
      });

      refetch(omit(router.query, key));
    }
  };

  return (
    <div>
      <h1>Resources</h1>

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
        {data?.posts.edges.map(({ node: post }) => (
          <li key={post.databaseId}>
            <Link href={`/resources/${post.databaseId}`}>{post.title}</Link>
            {post.bibleRefs.length > 0 && (
              <span> ({post.bibleRefs.map((ref) => ref.raw).join(", ")})</span>
            )}
          </li>
        ))}
      </ul>

      {data?.posts.pageInfo.hasNextPage && (
        <button
          onClick={() => {
            fetchMore({
              variables: {
                after: data?.posts.pageInfo.endCursor,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                const {
                  edges,
                  pageInfo: { endCursor },
                } = fetchMoreResult.posts;

                return {
                  ...fetchMoreResult,
                  posts: {
                    pageInfo: { ...fetchMoreResult.posts.pageInfo, endCursor },
                    edges: [...prev.posts.edges, ...edges],
                  },
                };
              },
            });
          }}
        >
          Charger plus
        </button>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const client = getClient();

  await client.query<GetResourcesQuery, GetResourcesQueryVariables>(
    getResources()
  );

  return addApolloState(client, {
    props: {},
  });
};

export default Resources;
