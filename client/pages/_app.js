import "bulma/css/bulma.css";
import Head from "next/head";
import buildClient from "../api/build-client";
import Header from "../components/header";

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Head>
        <title>Microservices Project - 2 | Ticketing App</title>
      </Head>
      <Header currentUser={currentUser} />
      <div className="container mt-2">
        <Component currentUser={currentUser} {...pageProps} />
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
