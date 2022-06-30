import {
  ApolloClient,
  ApolloClientOptions,
  InMemoryCache,
} from "@apollo/client";

const apiUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/graphql"
    : "https://wp.egliselyongerland.org/graphql";

const clientBaseProps: ApolloClientOptions<unknown> = {
  uri: apiUrl,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
};

const publicClient = new ApolloClient(clientBaseProps);

const previewClient = new ApolloClient({
  ...clientBaseProps,
  headers: {
    Authorization: `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`,
  },
});

export const getClient = (preview = false) =>
  preview ? previewClient : publicClient;

const appolo = null;

export default appolo;
