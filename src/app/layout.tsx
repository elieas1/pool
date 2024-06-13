import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import { headers } from "next/headers";
import Web3ModalProvider from "@/context";
import { Providers } from "./Providers";
import EmptySpace from "@/components/emptySpace/EmptySpace";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import Web3Button from "@/components/web3Button/Web3Button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "App | Numerical",
  description: "Numerical app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main>
            <Web3ModalProvider initialState={initialState}>
              <div className="flex flex-1 w-full justify-center sm:justify-between items-center flex-wrap">
                <Button className="hidden sm:block learnMore">
                  Learn More
                </Button>
                <Link href="/">
                  <Image src="/logo.png" width={200} height={200} alt="logo" />
                </Link>
                <div>
                  <Web3Button />
                  {/* <w3m-button balance="hide" /> */}
                </div>
              </div>
              <EmptySpace spaceTop={50} />
              {children}
            </Web3ModalProvider>
          </main>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
