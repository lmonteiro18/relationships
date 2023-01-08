import Head from "next/head";
import "../styles/scss/core.module.scss";
import "../styles/scss/global.scss";
import "mapbox-gl/dist/mapbox-gl.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Understanding Relationship Patterns</title>
        <meta
          name="description"
          content="A work by Luís Monteiro for the subject Computational Design Lab"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
