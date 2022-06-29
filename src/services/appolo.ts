import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/graphql"
      : "https://wp.egliselyongerland.org/graphql",
  cache: new InMemoryCache(),
});

const appolo = null;

export default appolo;
