import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Jumbotron from "../../components/jumbotron";
import { getClient } from "../../services/appolo";
import {
  GetPageQuery,
  GetPageQueryVariables,
  GetPagesQuery,
  GetPagesQueryVariables,
  PageIdType,
} from "../../types/graphql";
import styles from "./index.module.css";

type Props = {
  page: GetPageQuery["page"];
};

const Page = ({ page }: Props) => {
  if (!page) {
    return "Loading...";
  }

  return (
    <div>
      <Jumbotron>
        <div className="py-20 flex-center">
          <h1 className="mb-6 max-w-lg font-suez text-5xl">
            <h1>{page.title}</h1>
          </h1>
        </div>
      </Jumbotron>

      <div className="container">
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await getClient().query<
    GetPagesQuery,
    GetPagesQueryVariables
  >({
    query: gql`
      query GetPages {
        pages {
          nodes {
            slug
          }
        }
      }
    `,
  });

  return {
    paths: data.pages.nodes.reduce<
      { params: { slug: string }; locale: string }[]
    >(
      (acc, node) => [
        ...acc,
        { params: { slug: node.slug }, locale: "fr" },
        { params: { slug: node.slug }, locale: "en" },
      ],
      []
    ),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  Props,
  { slug: string },
  { id: number }
> = async ({ params, preview = false, previewData, locale }) => {
  const { data } = await getClient(preview).query<
    GetPageQuery,
    GetPageQueryVariables
  >({
    query: gql`
      query GetPage($id: ID!, $idType: PageIdType!, $preview: Boolean!) {
        page(id: $id, idType: $idType, asPreview: $preview) {
          title
          content
        }
      }
    `,
    variables: {
      id: preview ? `${previewData?.id}` : params?.slug || "",
      idType: preview ? PageIdType.DatabaseId : PageIdType.Uri,
      preview,
    },
  });

  if (!data.page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page: data.page,
      ...(await serverSideTranslations(locale || "fr")),
    },
    revalidate: 10,
  };
};

export default Page;
