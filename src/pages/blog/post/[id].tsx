import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";

import { client } from "../../../services/appolo";
import {
  GetPostQuery,
  GetPostQueryVariables,
  GetPostsQuery,
} from "../../../types/graphql";

interface Post {
  title: string;
}

interface Props {
  post: GetPostQuery["post"];
}

function Post({ post }: Props) {
  return <div>{post.title}</div>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query<GetPostsQuery, GetPostQueryVariables>({
    query: gql`
      query GetPosts {
        posts {
          nodes {
            postId
          }
        }
      }
    `,
  });

  return {
    paths: data.posts.nodes.map((post) => ({
      params: {
        id: `${post.postId}`,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, { id: string }> = async ({
  params,
}) => {
  const { data } = await client.query<GetPostQuery, GetPostQueryVariables>({
    query: gql`
      query GetPost($id: ID!) {
        post(id: $id, idType: DATABASE_ID) {
          title
        }
      }
    `,
    variables: {
      id: params?.id || "",
    },
  });

  return {
    props: {
      post: data.post,
    },
  };
};

export default Post;
