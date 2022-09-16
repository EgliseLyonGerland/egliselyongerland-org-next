import { gql } from "@apollo/client";
import { LinkIcon } from "@heroicons/react/24/solid";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import Avatar from "../../../components/avatar";
import Jumbotron from "../../../components/jumbotron";
import { addAnchors, formatTitle } from "../../../libs/utils/resource";
import { getClient } from "../../../services/appolo";
import {
  GetPostQuery,
  GetPostQueryVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
} from "../../../types/graphql";
import styles from "./index.module.css";

interface Props {
  post: GetPostQuery["post"];
}

function Post({ post }: Props) {
  const [content, anchors] = useMemo(
    () => addAnchors(post?.content || ""),
    [post]
  );

  if (!post) {
    return "Loading...";
  }

  return (
    <>
      <Jumbotron>
        <div className="mx-auto flex min-h-[50vh] max-w-screen-xl justify-between py-12">
          <div>
            <h1
              className={`mb-6 max-w-lg font-suez leading-snug ${
                post.title.length > 48 ? "text-5xl" : "text-6xl"
              }`}
            >
              {formatTitle(post.title)}
            </h1>
            <div className="flex items-center gap-4 text-xl">
              <Avatar
                firstName={post.author.node.firstName}
                lastName={post.author.node.lastName}
                url={post.author.node.avatar.url}
              />
              <Link href={`/resources?author=${post.author.node.databaseId}`}>
                <a>{post.author.node.name}</a>
              </Link>
            </div>
          </div>
          <div className="self-end sepia-[50%]">
            {post.featuredImage && (
              <Image
                alt={post.title}
                src={post.featuredImage.node.sourceUrl}
                width={680}
                height={430}
                objectFit="cover"
                className="rounded-2xl"
              />
            )}
          </div>
        </div>
      </Jumbotron>
      <div className="mx-auto flex max-w-screen-xl justify-between py-12">
        <div className="max-w-screen-md flex-grow">
          {content ? (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="text-center">
              <div className="inline-block rounded-lg bg-black/5 p-5 text-center text-xl italic opacity-70">
                La transcription de cet enregistrement n&rsquo;est pas
                disponible. <br />
                Merci de votre compréhension !
              </div>
            </div>
          )}
        </div>
        <div className="w-96">
          <div className="sticky top-[144px] flex flex-col gap-8">
            {anchors.length > 0 && (
              <div>
                <h2 className="mb-6 font-suez text-xl">Sommaire</h2>

                <div className="flex flex-col gap-2">
                  {anchors.map((anchor, index) => (
                    <a
                      href={`#${anchor.key}`}
                      key={anchor.key}
                      className="overflow-auto text-ellipsis whitespace-nowrap rounded-md bg-black/5 py-2 pr-4 pl-6 transition-colors hover:bg-pop hover:text-white"
                    >
                      {index + 1}. {anchor.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {post.bibleRefs?.length && (
              <div>
                <h2 className="mb-6 font-suez text-xl">Références Bibliques</h2>

                <div className="flex flex-wrap gap-4">
                  {post.bibleRefs.map(({ raw }) => (
                    <div
                      key={raw}
                      className="rounded-full bg-black/5 px-4 py-1"
                    >
                      {raw}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h2 className="mb-6 font-suez text-xl">Partager</h2>
              <div className="flex flex-col gap-4">
                {["Copier le lien", "Facebook", "Twitter"].map((label) => (
                  <div
                    key={label}
                    className="group flex cursor-pointer items-center gap-4 transition-colors hover:bg-black/5"
                  >
                    <div className="rounded-lg bg-black/5 p-3 group-hover:bg-pop group-hover:text-white">
                      <LinkIcon className="h-6" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await getClient().query<
    GetPostsQuery,
    GetPostsQueryVariables
  >({
    query: gql`
      query GetPosts {
        posts(first: 10) {
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
          author {
            node {
              databaseId
              name
              firstName
              lastName
              avatar {
                url
              }
            }
          }
          bibleRefs {
            raw
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
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
