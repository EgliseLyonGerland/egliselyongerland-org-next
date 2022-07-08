import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";

import { getClient } from "../services/appolo";
import {
  GetPageQuery,
  GetPageQueryVariables,
  GetPagesQuery,
  GetPagesQueryVariables,
  PageIdType,
} from "../types/graphql";

type Props = {
  page: GetPageQuery["page"];
};

const Page = ({ page }: Props) => {
  if (!page) {
    return "Loading...";
  }

  return (
    <div>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
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
    paths: data.pages.nodes.map((node) => ({
      params: {
        slug: node.slug,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  Props,
  { slug: string },
  { id: number }
> = async ({ params, preview = false, previewData }) => {
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
    },
    revalidate: 10,
  };
};

export default Page;
