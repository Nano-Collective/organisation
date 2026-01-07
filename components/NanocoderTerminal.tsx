"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultTheme, type Theme, type ThemePreset, themes } from "@/types/ui";

interface NanocoderTerminalProps {
  onThemeChange?: (theme: Theme) => void;
}

export default function NanocoderTerminal({
  onThemeChange,
}: NanocoderTerminalProps) {
  const commands = useMemo(
    () => [
      "Build a RESTful API with authentication",
      "Create a React component with TypeScript",
      "Add unit tests for user service",
      "Refactor database queries for performance",
      "Implement a WebSocket chat feature",
      "Set up CI/CD pipeline with GitHub Actions",
      "Optimize image loading performance",
      "Add dark mode support to application",
      "Create a responsive navbar component",
      "Implement infinite scroll for feed",
      "Add error boundary to catch React errors",
      "Write documentation for API endpoints",
      "Set up PostgreSQL database with Docker",
      "Create a custom React hook for state management",
      "Add TypeScript interfaces for API responses",
      "Implement user authentication with JWT tokens",
      "Build a reusable button component library",
      "Add lazy loading for React components",
      "Create a GraphQL server with Apollo",
      "Set up unit testing with Jest and React Testing Library",
      "Implement search functionality with debouncing",
      "Add form validation with Zod",
      "Create a dashboard layout with sidebar navigation",
      "Implement real-time notifications with WebSockets",
      "Add internationalization (i18n) support",
      "Create a data fetching hook with React Query",
      "Implement file upload with progress indicator",
      "Add caching layer for API responses",
      "Create a modal component with backdrop blur",
      "Set up logging with Winston and Morgan",
      "Implement rate limiting for API endpoints",
      "Add accessibility (a11y) attributes to components",
      "Create a pagination component for data tables",
      "Implement theme switching with localStorage persistence",
      "Add skeleton loading screens for better UX",
      "Create a toast notification system",
      "Set up end-to-end testing with Playwright",
      "Implement password strength validation",
      "Add CSV export functionality for data tables",
      "Create a multi-step form wizard",
      "Implement search suggestions with autocomplete",
      "Add keyboard shortcuts for better accessibility",
      "Create a context provider for app state",
      "Set up monitoring with Sentry",
      "Implement optimistic UI updates",
      "Add drag-and-drop file upload zone",
      "Create a responsive grid layout system",
      "Implement deep linking for shareable URLs",
      "Add session timeout with inactivity detection",
      "Create a date picker component",
      "Implement virtual scrolling for large lists",
      "Add unit test coverage reporting",
      "Create a tooltip component with positioning",
      "Set up API versioning strategy",
      "Implement request cancellation with AbortController",
      "Add dark mode with system preference detection",
      "Create a table component with sorting",
      "Implement concurrent mode for better performance",
      "Add client-side search with Fuse.js",
      "Create a progress stepper for multi-step flows",
      "Implement debounced search for API calls",
      "Add audio notifications for events",
      "Create a color picker component",
      "Set up database migrations",
      "Implement role-based access control (RBAC)",
      "Add skeleton screens for content loading",
      "Create a tag input component",
      "Implement offline support with service workers",
      "Add analytics tracking for user events",
      "Create a carousel/slider component",
      "Set up error handling middleware",
      "Implement request retry logic with exponential backoff",
      "Add clipboard copy functionality",
      "Create a chart component with recharts",
      "Implement data validation with Yup",
      "Add responsive images with next/image",
      "Create a dropdown menu component",
      "Set up WebSocket connection management",
      "Implement text-to-speech for accessibility",
    ],
    [],
  );

  const themeKeys = Object.keys(themes) as ThemePreset[];
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(themes[defaultTheme]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Randomize command index only on client after hydration
  useEffect(() => {
    setIsMounted(true);
    const randomIndex = Math.floor(Math.random() * commands.length);
    setCurrentCommandIndex(randomIndex);
  }, [commands.length]);

  // Cycle through themes every 2 seconds (quicker)
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setCurrentThemeIndex((prev) => (prev + 1) % themeKeys.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isMounted, themeKeys.length]);

  // Update current theme when index changes
  useEffect(() => {
    const newTheme = themes[themeKeys[currentThemeIndex]];
    setCurrentTheme(newTheme);
    onThemeChange?.(newTheme);
  }, [currentThemeIndex, themeKeys, onThemeChange]);

  useEffect(() => {
    // Only run typing animation after client-side mount
    if (!isMounted) return;

    const currentCommand = commands[currentCommandIndex];

    if (isTyping) {
      if (displayedText.length < currentCommand.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentCommand.slice(0, displayedText.length + 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        let newIndex: number;
        do {
          newIndex = Math.floor(Math.random() * commands.length);
        } while (newIndex === currentCommandIndex && commands.length > 1);
        setCurrentCommandIndex(newIndex);
        setIsTyping(true);
      }
    }
  }, [displayedText, isTyping, currentCommandIndex, commands, isMounted]);

  const colors = currentTheme.colors;
  const themeGradient = colors.gradientColors
    ? `linear-gradient(to right, ${colors.gradientColors.join(", ")})`
    : `linear-gradient(to right, ${colors.primary}, ${colors.tool})`;

  return (
    <div className="transition-all duration-700 ease-in-out">
      <div
        className="rounded-lg overflow-hidden shadow-2xl border"
        style={{
          backgroundColor:
            currentTheme.themeType === "light" ? "#ffffff" : "#000000",
          borderColor: `${colors.tool}4d`, // 30% opacity
        }}
      >
        {/* Terminal Window Controls */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{
            backgroundColor:
              currentTheme.themeType === "light" ? "#ffffff" : "#000000",
            borderColor: `${colors.tool}33`, // 20% opacity
          }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono text-sm overflow-x-auto">
          {/* cfonts-style ASCII Header (tiny font) */}
          <div className="mb-12 text-sm leading-tight font-bold select-none">
            <div
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: themeGradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <div>█▄ █ ▄▀█ █▄ █ █▀█ █▀▀ █▀█ █▀▄ █▀▀ █▀█</div>
              <div>█ ▀█ █▀█ █ ▀█ █▄█ █▄▄ █▄█ █▄▀ ██▄ █▀▄</div>
            </div>
          </div>

          {/* Tips Section with Welcome Banner */}
          <div
            className="inline-block px-2 py-0 mb-2 text-xs"
            style={{
              backgroundColor: colors.primary,
              color: colors.base,
            }}
          >
            ✱ Welcome to Nanocoder 1.20.0 ✱
          </div>
          <div
            className="rounded-md p-4 pt-5 mb-6 relative text-xs"
            style={{
              borderColor: colors.primary,
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          >
            <div style={{ color: colors.text }} className="mb-4">
              Tips for getting started:
            </div>
            <div className="space-y-1" style={{ color: colors.secondary }}>
              <div>
                1. Use natural language to describe what you want to build.
              </div>
              <div>
                2. Ask for file analysis, editing, bash commands and more.
              </div>
              <div>
                3. Be specific as you would with another engineer for best
                results.
              </div>
              <div>4. Type /exit or press Ctrl+C to quit.</div>
            </div>
            <div className="my-4" style={{ color: colors.text }}>
              /help for help
            </div>
          </div>

          {/* Status Section */}
          <div
            className="inline-block px-2 py-0 mb-2 text-xs"
            style={{
              backgroundColor: colors.info,
              color: colors.base,
            }}
          >
            Status
          </div>
          <div
            className="rounded-md p-4 pt-5 mb-6 relative text-xs"
            style={{
              borderColor: colors.info,
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          >
            <div className="space-y-1">
              <div>
                <span style={{ color: colors.info, fontWeight: "bold" }}>
                  CWD:
                </span>{" "}
                <span style={{ color: colors.info }}>
                  /nano-collective/nanocoder
                </span>
              </div>
              <div>
                <span style={{ color: colors.info, fontWeight: "bold" }}>
                  Config:
                </span>{" "}
                <span style={{ color: colors.info }}>/agents.config.json</span>
              </div>
              <div>
                <span style={{ color: colors.success, fontWeight: "bold" }}>
                  Provider:
                </span>{" "}
                <span style={{ color: colors.success }}>Ollama, </span>
                <span style={{ color: colors.success, fontWeight: "bold" }}>
                  Model:
                </span>{" "}
                <span style={{ color: colors.success }}>
                  devstral-small-2:24b
                </span>
              </div>
              <div>
                <span style={{ color: colors.primary, fontWeight: "bold" }}>
                  Theme:
                </span>{" "}
                <span style={{ color: colors.primary }}>
                  {currentTheme.displayName}
                </span>
              </div>
              <div className="italic" style={{ color: colors.secondary }}>
                ↳ Using AGENTS.md. Project initialized
              </div>
              <div className="italic" style={{ color: colors.secondary }}>
                ✓ Preferences loaded
              </div>
              <div className="italic" style={{ color: colors.secondary }}>
                ✓ 4 custom commands loaded
              </div>
              <div className="italic" style={{ color: colors.secondary }}>
                ✓ LSP: 1/1 connected
              </div>
            </div>
          </div>

          {/* Prompt Section */}
          <div className="space-y-1 text-xs">
            <div style={{ color: colors.primary, fontWeight: "bold" }}>
              What would you like me to help with?
            </div>
            <div style={{ color: colors.text }}>
              {"> "}
              <span style={{ color: colors.text }}>
                {displayedText}
                <span style={{ color: colors.text }}>█</span>
              </span>
            </div>
            <div className="text-xs mt-2" style={{ color: colors.secondary }}>
              Type "/" and then press Tab for command suggestions or "!" to
              execute bash commands. Use ↑/↓ for history.
            </div>
            <div
              className="flex items-center gap-2 mt-4"
              style={{ color: colors.secondary }}
            >
              <span>▶</span> normal mode on{" "}
              <span className="opacity-60">(Shift+Tab to cycle)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
