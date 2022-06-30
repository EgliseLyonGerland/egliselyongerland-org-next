import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";

import { getClient } from "../../../services/appolo";
import {
  GetPostQuery,
  GetPostQueryVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
} from "../../../types/graphql";

interface Post {
  title: string;
}

interface Props {
  post: GetPostQuery["post"];
}

function Post({ post }: Props) {
  if (!post) {
    return "Loading...";
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await getClient().query<
    GetPostsQuery,
    GetPostsQueryVariables
  >({
    query: gql`
      query GetPosts {
        posts(first: 100) {
          nodes {
            databaseId
          }
        }
      }
    `,
  });

  return {
    paths: data.posts.nodes.map((post) => ({
      params: {
        id: `${post.databaseId}`,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<Props, { id: string }> = async ({
  params,
  preview = false,
}) => {
  const { data } = await getClient(preview).query<
    GetPostQuery,
    GetPostQueryVariables
  >({
    query: gql`
      query GetPost($id: ID!, $preview: Boolean) {
        post(id: $id, idType: DATABASE_ID, asPreview: $preview) {
          title
          content
        }
      }
    `,
    variables: {
      id: params?.id || "",
      preview,
    },
  });

  if (!data.post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post: data.post,
    },
    revalidate: 10,
  };
};

export default Post;
