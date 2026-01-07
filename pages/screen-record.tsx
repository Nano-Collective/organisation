import Head from "next/head";
import NanocoderTerminal from "@/components/NanocoderTerminal";

export default function ScreenRecord() {
  return (
    <>
      <Head>
        <title>Nanocoder Terminal - Screen Recording</title>
        <meta
          name="description"
          content="Nanocoder terminal interface for screen recording demonstrations"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#1a1b26] via-[#2ac3de]/20 to-[#bb9af7]/20 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <NanocoderTerminal />
        </div>
      </div>
    </>
  );
}
