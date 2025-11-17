"use client";

import { useState, useEffect, useMemo } from "react";

export default function NanocoderTerminal() {
  const commands = useMemo(
    () => [
      "Build a RESTful API with authentication",
      "Create a React component with TypeScript",
      "Add unit tests for the user service",
      "Refactor the database queries for performance",
      "Implement a WebSocket chat feature",
      "Set up CI/CD pipeline with GitHub Actions",
      "Optimize the image loading performance",
      "Add dark mode support to the application",
      "Create a responsive navbar component",
      "Implement infinite scroll for the feed",
      "Add error boundary to catch React errors",
      "Write documentation for the API endpoints",
    ],
    []
  );

  const [currentCommandIndex, setCurrentCommandIndex] = useState(() =>
    Math.floor(Math.random() * commands.length)
  );
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
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
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * commands.length);
        } while (newIndex === currentCommandIndex && commands.length > 1);
        setCurrentCommandIndex(newIndex);
        setIsTyping(true);
      }
    }
  }, [displayedText, isTyping, currentCommandIndex, commands]);

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-2xl border border-[#7dcfff]/30">
      {/* Terminal Window Controls */}
      <div className="flex items-center gap-2 px-4 py-3 bg-black border-b border-[#7dcfff]/20">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>

      {/* Terminal Content */}
      <div className="p-6 font-mono text-sm overflow-x-auto">
        {/* cfonts-style ASCII Header (tiny font) */}
        <div className="mb-12 text-sm leading-tight font-bold select-none">
          <div className="bg-gradient-to-r from-[#bb9af7] via-[#7dcfff] to-[#7dcfff] bg-clip-text text-transparent">
            <div>█▄ █ ▄▀█ █▄ █ █▀█ █▀▀ █▀█ █▀▄ █▀▀ █▀█</div>
            <div>█ ▀█ █▀█ █ ▀█ █▄█ █▄▄ █▄█ █▄▀ ██▄ █▀▄</div>
          </div>
        </div>

        {/* Tips Section with Welcome Banner */}
        <div className="border border-[#bb9af7] rounded-md p-4 pt-5 mb-6 bg-black relative text-xs">
          <div className="absolute -top-3 left-2">
            <div className="inline-block bg-[#bb9af7] rounded-full px-2 py-0.5 text-[#1a1b26]">
               ✱ Welcome to Nanocoder 1.16.0
            </div>
          </div>
          <div className="text-[#c0caf5] mb-4">Tips for getting started:</div>
          <div className="space-y-1 text-[#565f89]">
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
          <div className="my-4 text-[#c0caf5]">/help for help</div>
        </div>

        {/* Status Section */}
        <div className="border border-[#2ac3de] rounded-md p-4 pt-5 mb-6 bg-black relative text-xs">
          <div className="absolute -top-3 left-2">
            <div className="inline-block bg-[#2ac3de] rounded-full px-2 py-0.5 text-[#1a1b26]">
              Status
            </div>
          </div>
          <div className="space-y-1">
            <div>
              <span className="text-[#2ac3de] font-bold">CWD:</span>{" "}
              <span className="text-[#2ac3de]">/nano-collective/nanocoder</span>
            </div>
            <div>
              <span className="text-[#2ac3de] font-bold">Config:</span>{" "}
              <span className="text-[#2ac3de]">/agents.config.json</span>
            </div>
            <div>
              <span className="text-[#7AF778] font-bold">Provider:</span>{" "}
              <span className="text-[#7AF778]">Ollama, </span>
              <span className="text-[#7AF778] font-bold">Model:</span>{" "}
              <span className="text-[#7AF778]">gpt-oss:20b</span>
            </div>
            <div>
              <span className="text-[#bb9af7] font-bold">Theme:</span>{" "}
              <span className="text-[#bb9af7]">Tokyo Night</span>
            </div>
            <div className="text-[#565f89] italic">
              ↳ Using AGENTS.md. Project initialized
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-[#7AF778] mb-6 text-xs">
          User preferences loaded...
        </div>

        {/* Prompt Section */}
        <div className="space-y-1 text-xs">
          <div className="text-[#bb9af7] font-bold">
            What would you like me to help with?
          </div>
          <div className="text-[#c0caf5]">
            {"> "}
            <span className="text-[#c0caf5]">
              {displayedText}
              <span className="text-[#c0caf5]">█</span>
            </span>
          </div>
          <div className="text-[#565f89] text-xs mt-2">
            Type "/" and then press Tab for command suggestions or "!" to execute bash commands. Use ↑/↓ for history.
          </div>
          <div className="text-[#565f89] flex items-center gap-2 mt-4">
            <span className="text-[#565f89]">▶</span> normal mode on{" "}
            <span className="text-[#565f89]/60">(Shift+Tab to cycle)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
