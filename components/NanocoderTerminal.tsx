"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { type Theme, type ThemePreset, themes } from "@/types/ui";

interface NanocoderTerminalProps {
  onThemeChange?: (theme: Theme) => void;
  version?: string;
  themeMode?: "dark" | "light" | "mixed";
  variant?: "default" | "brutalist";
}

const darkThemeKeys: ThemePreset[] = [
  "tokyo-night",
  "synthwave-84",
  "forest-night",
  "sunset-glow",
  "deep-sea",
];

const lightThemeKeys: ThemePreset[] = [
  "github-light",
  "catppuccin-latte",
  "solarized-light",
  "rose-pine-dawn",
  "one-light",
];

// Captured from the Nanocoder 1.31.0 fullscreen TUI (cfonts "block" font, the
// default shape). Keep in sync with source/components/welcome-message.tsx.
const LOGO_FULL = [
  "███╗   ██╗  █████╗  ███╗   ██╗  ██████╗   ██████╗  ██████╗  ██████╗  ███████╗ ██████╗",
  "████╗  ██║ ██╔══██╗ ████╗  ██║ ██╔═══██╗ ██╔════╝ ██╔═══██╗ ██╔══██╗ ██╔════╝ ██╔══██╗",
  "██╔██╗ ██║ ███████║ ██╔██╗ ██║ ██║   ██║ ██║      ██║   ██║ ██║  ██║ █████╗   ██████╔╝",
  "██║╚██╗██║ ██╔══██║ ██║╚██╗██║ ██║   ██║ ██║      ██║   ██║ ██║  ██║ ██╔══╝   ██╔══██╗",
  "██║ ╚████║ ██║  ██║ ██║ ╚████║ ╚██████╔╝ ╚██████╗ ╚██████╔╝ ██████╔╝ ███████╗ ██║  ██║",
  "╚═╝  ╚═══╝ ╚═╝  ╚═╝ ╚═╝  ╚═══╝  ╚═════╝   ╚═════╝  ╚═════╝  ╚═════╝  ╚══════╝ ╚═╝  ╚═╝",
];

const LOGO_SHORT = [
  "███╗   ██╗  ██████╗",
  "████╗  ██║ ██╔════╝",
  "██╔██╗ ██║ ██║",
  "██║╚██╗██║ ██║",
  "██║ ╚████║ ╚██████╗",
  "╚═╝  ╚═══╝  ╚═════╝",
];

const TAGLINE =
  "An open coding agent for your terminal, built by a community collective rather than a company. Bring your own model, keep your code on your machine, and owe nothing to anyone.";

const MENU: Array<[string, string]> = [
  ["Resume session", "/resume"],
  ["Select model", "/model"],
  ["Help", "/help"],
  ["Quit", "/exit"],
];

// The TUI pads every menu row to the widest label + command, plus 4.
const MENU_WIDTH =
  Math.max(...MENU.map(([label, command]) => label.length + command.length)) +
  4;

const TIPS = [
  "Use @ followed by a file path to add that file to context.",
  "Press Shift+Tab to cycle between development modes.",
  "Run /checkpoint create before a risky refactor so you can restore it later.",
  "Run /model to switch providers or models without restarting your session.",
  "Press Ctrl+J to add a new line without sending your prompt.",
  "Use /explorer to browse project files and add them to context.",
];

// Web fonts rarely carry the block and box-drawing glyphs, and the fallbacks
// don't fill their cells, so the wordmark tiles with visible seams. Terminals
// draw these characters themselves; so do we, one 1x2 cell per character.
// Double-line box drawing as polylines of [x, y] points within a 1x2 cell.
const STROKE: Record<string, number[][][]> = {
  "═": [
    [
      [0, 0.8],
      [1, 0.8],
    ],
    [
      [0, 1.2],
      [1, 1.2],
    ],
  ],
  "║": [
    [
      [0.35, 0],
      [0.35, 2],
    ],
    [
      [0.65, 0],
      [0.65, 2],
    ],
  ],
  "╔": [
    [
      [1, 0.8],
      [0.35, 0.8],
      [0.35, 2],
    ],
    [
      [1, 1.2],
      [0.65, 1.2],
      [0.65, 2],
    ],
  ],
  "╗": [
    [
      [0, 0.8],
      [0.65, 0.8],
      [0.65, 2],
    ],
    [
      [0, 1.2],
      [0.35, 1.2],
      [0.35, 2],
    ],
  ],
  "╚": [
    [
      [1, 1.2],
      [0.35, 1.2],
      [0.35, 0],
    ],
    [
      [1, 0.8],
      [0.65, 0.8],
      [0.65, 0],
    ],
  ],
  "╝": [
    [
      [0, 1.2],
      [0.65, 1.2],
      [0.65, 0],
    ],
    [
      [0, 0.8],
      [0.35, 0.8],
      [0.35, 0],
    ],
  ],
};

function TerminalLogo({
  lines,
  from,
  to,
  className,
}: {
  lines: string[];
  from: string;
  to: string;
  className?: string;
}) {
  // useId() yields characters that aren't safe inside url(#...).
  const gradientId = `logo-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const width = Math.max(...lines.map((line) => line.length));
  const height = lines.length * 2;
  const paint = `url(#${gradientId})`;

  // Absolute coordinates throughout: a userSpaceOnUse gradient follows each
  // element's transform, so translated glyphs would each restart it.
  let blocks = "";
  let strokes = "";
  lines.forEach((line, row) => {
    [...line].forEach((char, col) => {
      if (char === "█") {
        // Slightly oversized so neighbouring cells overlap instead of seaming.
        blocks += `M${col} ${row * 2}h1.02v2.02h-1.02z`;
      }
      for (const polyline of STROKE[char] ?? []) {
        strokes += polyline
          .map(([x, y], i) => `${i ? "L" : "M"}${col + x} ${row * 2 + y}`)
          .join("");
      }
    });
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={width}
          y2="0"
        >
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path d={blocks} fill={paint} />
      <path d={strokes} fill="none" stroke={paint} strokeWidth={0.12} />
    </svg>
  );
}

export default function NanocoderTerminal({
  onThemeChange,
  version = "1.0.0",
  themeMode = "dark",
  variant = "default",
}: NanocoderTerminalProps) {
  const activeThemeKeys = useMemo(() => {
    if (themeMode === "light") return lightThemeKeys;
    if (themeMode === "mixed") return [...darkThemeKeys, ...lightThemeKeys];
    return darkThemeKeys;
  }, [themeMode]);
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

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(themes[activeThemeKeys[0]]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  // Randomize command index only on client after hydration
  useEffect(() => {
    setIsMounted(true);
    setPrefersReducedMotion(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    );
    const randomIndex = Math.floor(Math.random() * commands.length);
    setCurrentCommandIndex(randomIndex);
    setTipIndex(Math.floor(Math.random() * TIPS.length));
  }, [commands.length]);

  // Cycle through themes slowly to reduce flashing
  useEffect(() => {
    if (!isMounted || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentThemeIndex((prev) => (prev + 1) % activeThemeKeys.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isMounted, prefersReducedMotion, activeThemeKeys.length]);

  // Update current theme when index changes
  useEffect(() => {
    const newTheme = themes[activeThemeKeys[currentThemeIndex]];
    setCurrentTheme(newTheme);
    onThemeChange?.(newTheme);
  }, [currentThemeIndex, onThemeChange, activeThemeKeys]);

  useEffect(() => {
    // Only run typing animation after client-side mount
    if (!isMounted) return;

    const currentCommand = commands[currentCommandIndex];

    // Respect reduced-motion: show the command fully typed, no animation.
    if (prefersReducedMotion) {
      if (displayedText !== currentCommand) setDisplayedText(currentCommand);
      return;
    }

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
  }, [
    displayedText,
    isTyping,
    currentCommandIndex,
    commands,
    isMounted,
    prefersReducedMotion,
  ]);

  const colors = currentTheme.colors;
  const background = currentTheme.themeType === "light" ? "#ffffff" : "#000000";

  const isBrutalist = variant === "brutalist";
  const frameBorder = isBrutalist
    ? themeMode === "dark"
      ? "rgba(255,255,255,0.2)"
      : "#000000"
    : null;

  return (
    <div className="transition-all duration-700 ease-in-out">
      <div
        className={`overflow-hidden border ${
          isBrutalist ? "rounded-none shadow-none" : "rounded-lg shadow-2xl"
        }`}
        style={{
          backgroundColor: background,
          borderColor: frameBorder ?? `${colors.tool}4d`, // 30% opacity
        }}
      >
        {/* Terminal Window Controls */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{
            backgroundColor: background,
            borderColor: frameBorder ?? `${colors.tool}33`, // 20% opacity
          }}
        >
          <div
            className={`w-3 h-3 bg-red-500 ${isBrutalist ? "rounded-none" : "rounded-full"}`}
          />
          <div
            className={`w-3 h-3 bg-yellow-500 ${isBrutalist ? "rounded-none" : "rounded-full"}`}
          />
          <div
            className={`w-3 h-3 bg-green-500 ${isBrutalist ? "rounded-none" : "rounded-full"}`}
          />
        </div>

        {/* Terminal Content — mirrors the fullscreen TUI's welcome screen:
            a centred banner, with the input box pinned to the bottom. */}
        <div className="@container flex flex-col min-h-[420px] sm:min-h-[500px] p-4 sm:p-6 font-mono text-[10px] sm:text-xs w-full">
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 sm:gap-5 pb-6">
            {/* Wordmark. Like the TUI, fall back to the "NC" monogram when
                there isn't room for the full NANOCODER. */}
            <div className="w-full flex justify-center">
              <TerminalLogo
                lines={LOGO_SHORT}
                from={colors.primary}
                to={colors.tool}
                className="@sm:hidden w-full max-w-[130px]"
              />
              <TerminalLogo
                lines={LOGO_FULL}
                from={colors.primary}
                to={colors.tool}
                className="hidden @sm:block w-full max-w-[580px]"
              />
            </div>

            <div>
              <span className="font-bold" style={{ color: colors.text }}>
                nanocoder
              </span>
              <span style={{ color: colors.secondary }}> v{version}</span>
            </div>

            <div className="max-w-[72ch]">
              <div className="font-bold" style={{ color: colors.text }}>
                Welcome to Nanocoder
              </div>
              <div style={{ color: colors.secondary }}>{TAGLINE}</div>
            </div>

            <div>
              <span style={{ color: colors.primary }}>⎇ main (default)</span>
              <span style={{ color: colors.secondary }}> · ~/code/my-app</span>
            </div>

            <div className="whitespace-pre text-left">
              {MENU.map(([label, command]) => (
                <div key={label}>
                  <span className="font-bold" style={{ color: colors.text }}>
                    {label}
                  </span>
                  {" ".repeat(MENU_WIDTH - label.length - command.length)}
                  <span
                    className="opacity-70"
                    style={{ color: colors.secondary }}
                  >
                    {command}
                  </span>
                </div>
              ))}
            </div>

            <div className="opacity-70" style={{ color: colors.secondary }}>
              Tip: {TIPS[tipIndex]}
            </div>
          </div>

          {/* Input box */}
          <div
            className="rounded-md px-2 py-1 sm:py-1.5"
            style={{ border: `1px solid ${colors.primary}` }}
          >
            <span
              style={{
                color: displayedText ? colors.primary : colors.secondary,
              }}
            >
              &gt;{" "}
            </span>
            {displayedText ? (
              <span style={{ color: colors.text }}>
                {displayedText}
                <span>█</span>
              </span>
            ) : (
              <span>
                <span
                  style={{ backgroundColor: colors.text, color: background }}
                >
                  A
                </span>
                <span
                  className="opacity-70"
                  style={{ color: colors.secondary }}
                >
                  sk anything...
                </span>
              </span>
            )}
          </div>

          {/* Mode indicator */}
          <div className="mt-1 px-2" style={{ color: colors.secondary }}>
            <span className="font-bold">▶ normal mode on</span> · ctx: ~1%
          </div>
        </div>
      </div>
    </div>
  );
}
