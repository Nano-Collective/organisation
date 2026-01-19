"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="opacity-0">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 text-muted-foreground transition-colors hover:text-foreground"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
