import "@/styles/globals.css";
import type { AppProps } from "next/app";
import ThemeToggle from "@/components/ThemeToggle";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="fixed top-0 right-4 z-50 h-14 flex items-center">
        <ThemeToggle />
      </div>
      <Component {...pageProps} />
    </>
  );
}
