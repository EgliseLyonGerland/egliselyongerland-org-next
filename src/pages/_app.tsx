import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import Head from "next/head";

import Layout from "../components/layout";
import { useApollo } from "../services/appolo";

import "@wordpress/block-library/build-style/style.css";

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Head>
          <title>Église Lyon Gerland</title>
        </Head>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default appWithTranslation(MyApp);
