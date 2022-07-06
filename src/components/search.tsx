import { gql, useLazyQuery } from "@apollo/client";
import { debounce } from "lodash";
import Link from "next/link";
import { useMemo } from "react";

import { GetSearchQuery, GetSearchQueryVariables } from "../types/graphql";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type Node = ArrayElement<GetSearchQuery["contentNodes"]["nodes"]>;

const getSearchQuery = gql`
  query GetSearch($query: String!) {
    contentNodes(
      where: { search: $query, contentTypes: [PAGE, POST] }
      first: 5
    ) {
      nodes {
        id
        ... on Post {
          title
          databaseId
        }
        ... on Page {
          title
          uri
        }
      }
    }
  }
`;

function getNodeUri(node: Node) {
  if ("uri" in node) {
    return node.uri;
  }
  if ("databaseId" in node) {
    return `/blog/post/${node.databaseId}`;
  }

  return "#";
}

const Search = () => {
  const [fetchSearch, { loading, data }] = useLazyQuery<
    GetSearchQuery,
    GetSearchQueryVariables
  >(getSearchQuery);

  const debouncedFetchSearch = useMemo(
    () =>
      debounce((...params: Parameters<typeof fetchSearch>) => {
        fetchSearch(...params);
      }, 500),
    [fetchSearch]
  );

  return (
    <>
      <input
        type="text"
        placeholder="Rechercher"
        onChange={(event) => {
          if (event.target.value) {
            debouncedFetchSearch({ variables: { query: event.target.value } });
          }
        }}
      />

      <div>
        {loading ? (
          "Loading..."
        ) : (
          <ul>
            {data?.contentNodes.nodes.map((node) => (
              <li key={node.id}>
                <Link href={getNodeUri(node)}>
                  {"title" in node ? node.title : "Unknown"}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Search;
