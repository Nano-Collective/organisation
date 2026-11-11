"use client";

import { useEffect, useState } from "react";

// The homepage spotlight for Roster. The screenshots are hot-linked from
// roster.nanocollective.org/screens/, which Roster regenerates from its demo
// org (scripts/demo-portal.ts in the roster repo) whenever the portal changes,
// so this section keeps up with the real UI without a hand-built copy here.

const ROSTER_URL = "https://roster.nanocollective.org";
const SCREENS_URL = `${ROSTER_URL}/screens`;
const CASE_STUDY_URL = `${ROSTER_URL}/case-study/pip/`;
const INSTALL = "npx @nanocollective/roster";

type Screen = {
  label: string;
  body: string;
  src: string;
  dark?: string;
};

const SCREENS: Screen[] = [
  {
    label: "Home",
    body: "Who is working right now, and everything waiting on you: pull requests to merge, decisions to make, drafts to approve.",
    src: "home.jpg",
    dark: "home-dark.jpg",
  },
  {
    label: "Brain",
    body: "Everything a staff member has learned, as plain files in their own repo. Each fact says why it holds and what to do about it.",
    src: "brain.jpg",
    dark: "brain-dark.jpg",
  },
  {
    label: "Prompt",
    body: "The exact text a run is sent, composed layer by layer from the org and the staff member, with where every line came from.",
    src: "prompt.jpg",
    dark: "prompt-dark.jpg",
  },
  {
    label: "Graph",
    body: "Every fact, note and file a staff member keeps, and how they link together.",
    src: "graph.jpg",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Work arrives as a pull request",
    body: "Read the diff, merge it or leave a review. That is the approval.",
  },
  {
    title: "Decisions arrive as issues",
    body: "Anything that needs you is an issue with the question in it. Answer in a comment.",
  },
  {
    title: "Mention them to talk",
    body: "@ a staff member on any issue or pull request and they pick it up.",
  },
];

export function RosterFeature() {
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (insecure context); the command is still on screen.
    }
  };

  return (
    <section
      id="roster"
      className="py-12 md:py-24 px-4 md:px-6 container mx-auto"
    >
      <div className="border-2 border-[#0000EE] dark:border-[#A1A1AA] bg-background shadow-[4px_4px_0px_0px_rgba(0,0,238,1)] dark:shadow-[4px_4px_0px_0px_#A1A1AA] sm:shadow-[8px_8px_0px_0px_rgba(0,0,238,1)] dark:sm:shadow-[8px_8px_0px_0px_#A1A1AA]">
        {/* Header strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#0000EE] dark:border-[#A1A1AA] bg-[#0000EE] dark:bg-foreground px-5 sm:px-8 py-3 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white dark:text-background">
          <span>&gt; Featured project</span>
          <span>Beta · Open source · MIT</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Pitch */}
          <div className="p-6 sm:p-8 lg:p-12 space-y-6 sm:space-y-8 lg:border-r border-foreground/20">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                Roster.{" "}
                <span
                  className="font-serif font-medium text-[#0000EE] dark:text-[#A1A1AA]"
                  style={{ fontFamily: '"Newsreader", Georgia, serif' }}
                >
                  Run your org on AI staff.
                </span>
              </h2>
              <p className="text-sm sm:text-lg text-foreground/70 leading-relaxed max-w-[560px]">
                Each staff member has a charter you write, a memory they keep,
                and a set time to work every morning. All of it is plain files
                in a GitHub repo you own. They run on any coding agent,
                Nanocoder included, and nothing goes live until you approve it.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={ROSTER_URL}
                className="inline-flex h-12 items-center justify-center rounded-none bg-[#0000EE] dark:bg-foreground px-8 text-sm font-semibold tracking-wide text-white dark:text-background transition-colors hover:bg-[#0000EE]/90 dark:hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Explore Roster
              </a>
              <a
                href={CASE_STUDY_URL}
                className="inline-flex h-12 items-center justify-center rounded-none border border-foreground/20 bg-background px-8 text-sm font-semibold tracking-wide text-foreground transition-colors hover:border-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                See it run a real product
              </a>
            </div>

            <button
              type="button"
              onClick={copy}
              className="flex w-full max-w-[420px] items-center justify-between gap-4 border border-foreground/20 bg-muted px-4 py-3 font-mono text-xs sm:text-sm text-left transition-colors hover:border-foreground"
              aria-label={`Copy ${INSTALL}`}
            >
              <span className="truncate">
                <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                  ${" "}
                </span>
                {INSTALL}
              </span>
              <span className="shrink-0 text-[10px] uppercase tracking-widest text-foreground/60">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          </div>

          {/* How it works */}
          <div className="border-t lg:border-t-0 border-foreground/20 divide-y divide-foreground/20 flex flex-col">
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.title}
                className="flex-1 p-6 sm:p-8 lg:px-12 flex flex-col justify-center"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#0000EE] dark:text-[#A1A1AA]">
                    [ 0{i + 1} ]
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm sm:text-base text-foreground/70 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
            <p className="p-6 sm:p-8 lg:px-12 text-xs sm:text-sm text-foreground/60 font-mono leading-relaxed">
              Run every day against a live org: a CTO and a CMO have built and
              marketed Pip since July, with one person merging what they hand
              off.
            </p>
          </div>
        </div>

        {/* The portal, as it really looks */}
        <div className="border-t-2 border-[#0000EE] dark:border-[#A1A1AA] bg-muted p-4 sm:p-8 lg:p-12">
          <div
            className="flex flex-wrap gap-2 mb-4 sm:mb-6"
            role="tablist"
            aria-label="Roster portal screens"
          >
            {SCREENS.map((s, i) => (
              <button
                key={s.label}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`h-9 px-4 font-mono text-xs sm:text-sm font-semibold border transition-colors ${
                  i === active
                    ? "bg-[#0000EE] dark:bg-foreground border-[#0000EE] dark:border-foreground text-white dark:text-background"
                    : "bg-background border-foreground/20 text-foreground hover:border-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base text-foreground/70 max-w-[720px] min-h-[3em]">
            {SCREENS[active].body}
          </p>

          <a
            href={ROSTER_URL}
            className="block relative w-full aspect-[1502/758] overflow-hidden border border-foreground/20 bg-background shadow-lg"
          >
            {SCREENS.map((s, i) => (
              // biome-ignore lint/performance/noImgElement: static export, images are unoptimized
              <img
                key={s.label}
                src={`${SCREENS_URL}/${dark && s.dark ? s.dark : s.src}`}
                alt={`The Roster portal, ${s.label} screen`}
                width={1502}
                height={758}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={i !== active}
              />
            ))}
          </a>
        </div>
      </div>
    </section>
  );
}
