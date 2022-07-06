import {
  ApolloClient,
  ApolloClientOptions,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const clientBaseProps: ApolloClientOptions<unknown> = {
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
  }),
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
