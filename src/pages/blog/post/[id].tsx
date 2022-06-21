import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";

import { client } from "../../../services/appolo";

interface Post {
  title: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  return <div>{post.title}</div>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query<{
    posts: { nodes: { postId: number }[] };
  }>({
    query: gql`
      query {
        posts(last: 10000) {
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
  const { data } = await client.query<{ post: Post }>({
    query: gql`
      query {
        post(id: ${params?.id}, idType: DATABASE_ID) {
         title
        }
      }
    `,
  });

  return {
    props: {
      post: data.post,
    },
  };
};

export default Post;
