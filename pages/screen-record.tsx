import Head from "next/head";
import { useEffect, useState } from "react";
import NanocoderTerminal from "@/components/NanocoderTerminal";
import { themes, type Theme, type ThemePreset } from "@/types/ui";

export default function ScreenRecord() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    themes["tokyo-night"],
  );

  // Create a callback for theme changes
  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const colors = currentTheme.colors;
  const themeGradient = colors.gradientColors
    ? `linear-gradient(to right, ${colors.gradientColors.join(", ")})`
    : `linear-gradient(to right, ${colors.primary}, ${colors.tool})`;

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
      <div
        className="min-h-screen flex items-center justify-center p-8 transition-colors duration-700 ease-in-out"
        style={{
          background: themeGradient,
        }}
      >
        <div className="w-full max-w-4xl">
          <NanocoderTerminal onThemeChange={handleThemeChange} />
        </div>
      </div>
    </>
  );
}
