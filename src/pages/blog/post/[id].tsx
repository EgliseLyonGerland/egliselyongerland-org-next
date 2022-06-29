import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";

import { client } from "../../../services/appolo";
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
  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query<GetPostsQuery, GetPostsQueryVariables>({
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
    fallback: "blocking",
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
          content
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
    revalidate: 10,
  };
};

export default Post;
