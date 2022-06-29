import { gql } from "@apollo/client";
import { GetStaticProps } from "next";
import Link from "next/link";

import { client } from "../../services/appolo";
import {
  GetBlogIndexPostsQuery,
  GetBlogIndexPostsQueryVariables,
} from "../../types/graphql";

type Props = {
  posts: GetBlogIndexPostsQuery["posts"]["nodes"];
};

const Blog = ({ posts }: Props) => {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.databaseId}>
            <Link href={`/blog/post/${post.databaseId}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { data } = await client.query<
    GetBlogIndexPostsQuery,
    GetBlogIndexPostsQueryVariables
  >({
    query: gql`
      query GetBlogIndexPosts {
        posts {
          nodes {
            databaseId
            title
          }
        }
      }
    `,
  });

  return {
    props: {
      posts: data.posts.nodes,
    },
    revalidate: 10,
  };
};

export default Blog;
