import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { ContentContainer } from "../components/ContentContainer";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";
import Link from "next/link";
import dynamic from 'next/dynamic';
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Solana Fundraiser</title>
      </Head>

      <ContextProvider>
        <div className="min-h-screen flex flex-col bg-gray-100">
          <AppBar/>
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Component {...pageProps} />
            </div>
          </main>
          <Footer/>
        </div>
      </ContextProvider>
    </>
  );
};

export default App;
