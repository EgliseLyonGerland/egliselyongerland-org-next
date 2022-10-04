import { GetResourcesQueryVariables } from "../../types/graphql";

export const resources = (params: Partial<GetResourcesQueryVariables> = {}) => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.append(key, `${value}`);
    }
  }

  if (!searchParams.has("book")) {
    searchParams.delete("chapter");
    searchParams.delete("verse");
  }
  if (!searchParams.has("chapter")) {
    searchParams.delete("verse");
  }

  searchParams.sort();

  return `/resources?${searchParams}`;
};
