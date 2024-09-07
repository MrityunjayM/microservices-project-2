import "bulma/css/bulma.css";
import Head from "next/head";
import { Suspense } from "react";
import Header from "../components/header";
import Loading from "./loading";
import buildClient from "../api/build-client";

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Head>
        <title>Microservices Project - 2 | Ticketing App</title>
      </Head>
      <Header currentUser={currentUser} />
      <div className="container is-fluid is-max-desktop mt-2">
        <Suspense fallback={<Loading />}>
          <Component currentUser={currentUser} {...pageProps} />
        </Suspense>
      </div>
    </>
  );
};

App.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);

  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client);
  }

  return { pageProps, ...data };
};

export default App;
