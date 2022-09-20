import { ParsedUrlQuery } from "querystring";

import { gql, useQuery } from "@apollo/client";
import { omit } from "lodash";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import Jumbotron from "../../components/jumbotron";
import Item from "../../components/resources/item";
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
            date
            author {
              node {
                name
                firstName
                lastName

                avatar {
                  url
                }
              }
            }
            featuredImage {
              node {
                sourceUrl
              }
            }
            bibleRefs {
              raw
            }
            event {
              sermonDate
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
      <Jumbotron>
        <div className="py-20 flex-center">
          <h1 className="mb-6 max-w-lg font-suez text-5xl">Ressources</h1>
        </div>
      </Jumbotron>

      <div className="mx-auto flex max-w-screen-xl justify-between py-12">
        <div className="flex max-w-screen-md flex-grow flex-col gap-6">
          {data?.posts.edges.map(({ node: post }) => (
            <Item key={post.databaseId} data={post}></Item>
          ))}

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
                        pageInfo: {
                          ...fetchMoreResult.posts.pageInfo,
                          endCursor,
                        },
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
        <div className="w-[1px] self-stretch bg-black/20"></div>
        <div className="w-96">
          <div className="sticky top-[144px] flex flex-col gap-8">
            <h3 className="mb-6 font-suez text-xl">Rechercher</h3>

            <h3 className="mb-6 font-suez text-xl">Filtrer</h3>

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
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const client = getClient();

  await client.query<GetResourcesQuery, GetResourcesQueryVariables>(
    getResources()
  );

  return addApolloState(client, {
    props: {
      ...(await serverSideTranslations(locale || "fr")),
    },
  });
};

export default Resources;
