import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import Layout from "../components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>Église Lyon Gerland</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
