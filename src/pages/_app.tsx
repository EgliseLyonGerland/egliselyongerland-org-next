import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import Head from "next/head";

import Layout from "../components/layout";
import { getClient } from "../services/appolo";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={getClient()}>
      <Layout>
        <Head>
          <title>Église Lyon Gerland</title>
        </Head>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
