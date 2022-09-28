import { ParsedUrlQuery } from "querystring";

import { gql, useQuery } from "@apollo/client";
import { omit } from "lodash";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import Jumbotron from "../../components/jumbotron";
import Filter from "../../components/resources/filter";
import Item from "../../components/resources/item";
import { books } from "../../config/bible";
import { addApolloState, getClient } from "../../services/appolo";
import {
  GetResourcesQuery,
  GetResourcesQueryVariables,
  GetFiltersQuery,
} from "../../types/graphql";

type Props = {
  posts: GetResourcesQuery["posts"];
  categories: GetFiltersQuery["categories"]["nodes"];
  authors: GetFiltersQuery["users"]["nodes"];
};

const getResources = ({
  author,
  category,
  book,
  chapter,
  verse,
}: ParsedUrlQuery = {}) => ({
  query: gql`
    query GetResources(
      $category: Int
      $author: Int
      $book: String
      $chapter: Int
      $verse: Int
      $after: String
    ) {
      posts(
        first: 10
        after: $after
        where: {
          categoryId: $category
          author: $author
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
    category: Number(category) || null,
    author: Number(author) || null,
    book: (book as string) || null,
    chapter: (book && Number(chapter)) || null,
    verse: (book && chapter && Number(verse)) || null,
    after: null,
  },
});

const Resources = ({ categories, authors }: Props) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { query, variables } = getResources(router.query);

  const { refetch, data, fetchMore } = useQuery<
    GetResourcesQuery,
    GetResourcesQueryVariables
  >(query, {
    variables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

  const push = (key: string, value: string | number | undefined) => {
    const nextVariables = value
      ? { ...variables, [key]: value }
      : omit(variables, key);

    router.push({
      pathname: "/resources",
      query: Object.entries(nextVariables).reduce(
        (acc, [key, item]) => (item ? { ...acc, [key]: item } : acc),
        {}
      ),
    });

    refetch(nextVariables);
  };

  return (
    <div>
      <Jumbotron>
        <div className="py-20 flex-center">
          <h1 className="mb-6 max-w-lg font-suez text-5xl">
            {t("resources.title", "Ressources")}
          </h1>
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
            <h3 className="font-suez text-xl">
              {t("resources.search", "Rechercher")}
            </h3>

            <h3 className="font-suez text-xl">
              {t("resources.filter", "Filtrer")}
            </h3>

            <div className="flex flex-col gap-4">
              <Filter
                name={t("resources.filters.category", "Catégorie")}
                items={categories}
                labelProp="name"
                value={
                  categories.find(
                    (category) => category.databaseId === variables.category
                  ) || null
                }
                onChange={(category) => {
                  push("category", category?.databaseId);
                }}
              ></Filter>
              <Filter
                name={t("resources.filters.author", "Auteur")}
                items={authors}
                labelProp="name"
                value={
                  authors.find(
                    (author) => author.databaseId === variables.author
                  ) || null
                }
                onChange={(user) => {
                  push("author", user?.databaseId);
                }}
              ></Filter>
              <Filter
                name={t("resources.filters.book", "Livre")}
                items={books}
                labelProp="name"
                value={
                  books.find((book) => book.name === variables.book) || null
                }
                onChange={(book) => {
                  push("book", book?.name);
                }}
              ></Filter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const client = getClient();

  const {
    data: {
      categories: { nodes: categories },
      users: { nodes: authors },
    },
  } = await getClient().query<GetFiltersQuery>({
    query: gql`
      query GetFilters {
        categories(
          where: {
            hideEmpty: true
            parent: 0
            exclude: [446]
            orderby: COUNT
            order: DESC
          }
        ) {
          nodes {
            databaseId
            name
          }
        }
        users(
          first: 100
          where: {
            hasPublishedPosts: [POST]
            orderby: [{ field: DISPLAY_NAME }]
          }
        ) {
          nodes {
            databaseId
            name
          }
        }
      }
    `,
  });

  await client.query<GetResourcesQuery, GetResourcesQueryVariables>(
    getResources()
  );

  return addApolloState(client, {
    props: {
      categories,
      authors,
      ...(await serverSideTranslations(locale || "fr")),
    },
  });
};

export default Resources;
