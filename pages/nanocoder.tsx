import {
  Check,
  Code,
  Cpu,
  Globe,
  Server,
  Settings,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import NanocoderTerminal from "@/components/NanocoderTerminal";
import { CommunityStats } from "@/components/product/CommunityStats";
import { type Feature, FeatureGrid } from "@/components/product/FeatureGrid";
import { FinalCTA } from "@/components/product/FinalCTA";
import { ProductHero } from "@/components/product/ProductHero";
import {
  type InstallCommand,
  QuickStart,
} from "@/components/product/QuickStart";
import { type Reason, ReasonsGrid } from "@/components/product/ReasonsGrid";
import { SponsorsSection } from "@/components/product/SponsorsSection";
import { SectionReveal } from "@/components/ui/motion";
import { fetchProductStats, type ProductStats } from "@/lib/product-stats";

const GITHUB_URL = "https://github.com/Nano-Collective/nanocoder";
const DOCS_URL = "https://docs.nanocollective.org/nanocoder/getting-started";

const features: Feature[] = [
  {
    icon: Cpu,
    title: "Local First",
    description:
      "Runs entirely on your machine. Connect to local Ollama models for completely offline, zero-cost agentic coding.",
  },
  {
    icon: Globe,
    title: "Multi Provider",
    description:
      "Seamlessly switch between OpenRouter, Anthropic, OpenAI, and Google. You choose the intelligence engine.",
  },
  {
    icon: Zap,
    title: "Skills System",
    description:
      "Extend behavior through custom skills. Teach Nanocoder your codebase's exact conventions and workflows.",
  },
  {
    icon: Settings,
    title: "Custom Tools",
    description:
      "Create and integrate your own Bash or Python tools directly into the agent's toolbelt.",
  },
  {
    icon: Server,
    title: "Multiple Modes",
    description:
      "Boot directly into Normal, Plan, Auto-Accept, or YOLO mode depending on your trust level for the task.",
  },
  {
    icon: Code,
    title: "Open Source",
    description:
      "Built in public by contributors. The codebase is yours to read, audit, and improve.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "No forced telemetry. No silent data collection. Complete control over what leaves your network.",
  },
  {
    icon: Terminal,
    title: "Terminal Native",
    description:
      "Designed explicitly for terminal workflows. Fits seamlessly into your existing developer environment.",
  },
];

const reasons: Reason[] = [
  {
    icon: Code,
    title: "100% Open Source",
    description:
      "Read the code. Audit the code. Improve the code. It belongs to the community, not a corporation.",
  },
  {
    icon: Cpu,
    title: "Local Architecture",
    description:
      "Designed from the ground up to run inference locally, ensuring maximum privacy and zero latency costs.",
  },
  {
    icon: Globe,
    title: "Bring Your Own Model",
    description:
      "Plug in any compatible local model, or route through the APIs you already pay for.",
  },
  {
    icon: Shield,
    title: "Zero Vendor Lock-In",
    description:
      "If you don't like Nanocoder, you can uninstall it. Your project history and Git tree remain completely untouched.",
  },
  {
    icon: Zap,
    title: "Community Driven",
    description:
      "Features are built based on what developers actually need, not what looks good in a marketing pitch.",
  },
  {
    icon: Settings,
    title: "Highly Extensible",
    description:
      "A robust plugin ecosystem means you can tailor the agent perfectly to your unique tech stack.",
  },
];

const installCommands: InstallCommand[] = [
  { label: "NPM", command: "npm install -g @nanocollective/nanocoder" },
  {
    label: "Homebrew",
    command: `brew tap nano-collective/nanocoder https://github.com/Nano-Collective/nanocoder
brew install nano-collective/nanocoder/nanocoder`,
  },
  {
    label: "Nix Flakes",
    command: "nix run github:Nano-Collective/nanocoder",
  },
];

export default function NanocoderPage({ stats }: { stats: ProductStats }) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const html = document.documentElement;
    const updateTheme = () => {
      setThemeMode(html.classList.contains("dark") ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Nanocoder | Nano Collective</title>
        <meta
          name="description"
          content="An open coding agent for your terminal, built by a community collective rather than a company."
        />
        <meta property="og:title" content="Nanocoder | Nano Collective" />
        <meta
          property="og:description"
          content="An open coding agent for your terminal, built by a community collective rather than a company."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://nanocollective.org/nanocoder"
        />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <div className="min-h-screen bg-background font-sans flex flex-col">
        <ProductHero
          eyebrow="OPEN SOURCE CODING AGENT"
          title="Nanocoder"
          description="An open coding agent for your terminal, built by a community collective rather than a company. Bring your own model, keep your code on your machine, and owe nothing to anyone."
          githubUrl={GITHUB_URL}
          docsUrl={DOCS_URL}
          demo={<NanocoderTerminal variant="brutalist" themeMode={themeMode} />}
        />

        <CommunityStats stats={stats} />

        <main className="flex-1">
          {/* What Is Nanocoder */}
          <SectionReveal>
            <section className="py-16 sm:py-24 border-b border-foreground/20">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                    The open alternative.
                  </h2>
                  <div className="space-y-6 text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed font-medium">
                    <p>
                      Nanocoder is a community-built, multi-provider coding
                      agent that runs entirely in your terminal. It connects to
                      Ollama for local execution, or OpenRouter, Anthropic,
                      OpenAI, and Google for cloud inference.
                    </p>
                    <p>
                      Built by the Nano Collective rather than a company, it
                      enforces a strict privacy-first model: your codebase never
                      leaves your machine unless you explicitly send it to an
                      API of your choice. No tracking, no forced telemetry, no
                      vendor lock-in.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>

          <FeatureGrid features={features} />

          {/* Workflow Examples */}
          <SectionReveal>
            <section className="py-16 sm:py-24 border-b border-foreground/20">
              <div className="container mx-auto px-4 md:px-6">
                <div>
                  <div className="mb-12 sm:mb-16 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                      Realistic workflows.
                    </h2>
                    <p className="text-md text-foreground/70 mt-4 max-w-2xl mx-auto">
                      Nanocoder handles architecture, refactoring, and feature
                      building natively in your terminal.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Example 1 */}
                    <div className="flex flex-col border border-foreground/20 bg-background">
                      <div className="h-10 border-b border-foreground/20 flex items-center px-4 bg-muted/30 gap-2 font-mono text-xs text-foreground/70 uppercase tracking-widest font-bold">
                        <Terminal className="w-4 h-4" />
                        Refactor
                      </div>
                      <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto bg-background dark:bg-[#111] text-foreground dark:text-zinc-300 flex-1">
                        <div className="text-[#0000EE] dark:text-pink-400 mb-4 font-bold dark:font-normal">
                          $ nanocoder run "refactor database module"
                        </div>
                        <div className="text-foreground/90 dark:text-blue-400">
                          ⚒ read_file
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500 mb-3">
                          {"  "}Path: src/db/users.ts
                        </div>
                        <div className="text-foreground/90 dark:text-blue-400">
                          ⚒ string_replace
                        </div>
                        <div className="text-red-600 dark:text-red-400">
                          {"  "}12 - await sql("SELECT * FROM users")
                        </div>
                        <div className="text-green-600 dark:text-green-400 mb-3">
                          {"  "}12 + await db.user.findMany()
                        </div>
                        <div className="text-foreground/90 dark:text-blue-400">
                          ⚒ execute_bash
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500">
                          {"  "}Command: npm run typecheck
                        </div>
                        <div className="text-green-600 dark:text-green-400 mb-4">
                          {"  "}● exit 0
                        </div>
                        <div className="text-green-600 dark:text-green-400 flex items-center gap-2">
                          <Check className="w-4 h-4" /> Refactored 12 queries
                          across 2 files
                        </div>
                      </div>
                    </div>

                    {/* Example 2 */}
                    <div className="flex flex-col border border-foreground/20 bg-background">
                      <div className="h-10 border-b border-foreground/20 flex items-center px-4 bg-muted/30 gap-2 font-mono text-xs text-foreground/70 uppercase tracking-widest font-bold">
                        <Terminal className="w-4 h-4" />
                        Audit
                      </div>
                      <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto bg-background dark:bg-[#111] text-foreground dark:text-zinc-300 flex-1">
                        <div className="text-[#0000EE] dark:text-pink-400 mb-4 font-bold dark:font-normal">
                          $ nanocoder --mode plan run "audit auth module"
                        </div>
                        <div className="text-foreground/90 dark:text-blue-400">
                          ⚒ read_file
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500 mb-3">
                          {"  "}Path: src/auth/jwt.ts
                        </div>
                        <div className="text-foreground/60 dark:text-zinc-400 italic mb-3">
                          ⚙ Thought
                          <br />
                          {"  "}Reviewing token expiry and login throttling.
                        </div>
                        <div className="text-foreground/80 dark:text-zinc-300 mb-4 border-l-2 border-foreground/20 dark:border-zinc-700 pl-4 py-2 bg-muted/50 dark:bg-zinc-900/50">
                          1. Verify JWT expiration logic
                          <br />
                          2. Check password hashing rounds
                          <br />
                          3. Audit rate limiting on /login
                        </div>
                        <div className="text-amber-600 dark:text-yellow-400 mb-2">
                          ⚠ No rate limiter on POST /login
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500">
                          Waiting for approval...
                        </div>
                      </div>
                    </div>

                    {/* Example 3 */}
                    <div className="flex flex-col border border-foreground/20 bg-background">
                      <div className="h-10 border-b border-foreground/20 flex items-center px-4 bg-muted/30 gap-2 font-mono text-xs text-foreground/70 uppercase tracking-widest font-bold">
                        <Terminal className="w-4 h-4" />
                        Build
                      </div>
                      <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto bg-background dark:bg-[#111] text-foreground dark:text-zinc-300 flex-1">
                        <div className="text-[#0000EE] dark:text-pink-400 mb-4 font-bold dark:font-normal">
                          $ nanocoder run "create settings page"
                        </div>
                        <div className="text-foreground/90 dark:text-blue-400">
                          ⚒ write_file
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500 mb-3">
                          {"  "}Path: app/settings/page.tsx
                          <br />
                          {"  "}Size: 84 lines, ~1.2k chars
                        </div>
                        <div className="text-foreground/90 dark:text-blue-400">
                          ⚒ write_file
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500 mb-3">
                          {"  "}Path: components/SettingsForm.tsx
                        </div>
                        <div className="text-foreground/90 dark:text-blue-400">
                          ⚒ execute_bash
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500">
                          {"  "}Command: npm test
                        </div>
                        <div className="text-green-600 dark:text-green-400 mb-4">
                          {"  "}● exit 0
                        </div>
                        <div className="text-green-600 dark:text-green-400 flex items-center gap-2">
                          <Check className="w-4 h-4" /> Created 2 files · 14
                          tests passed
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>

          <QuickStart commands={installCommands} />

          <ReasonsGrid product="Nanocoder" reasons={reasons} />

          <SponsorsSection />

          <FinalCTA docsUrl={DOCS_URL} githubUrl={GITHUB_URL} />
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<{
  stats: ProductStats;
}> = async () => {
  const stats = await fetchProductStats(
    "Nano-Collective/nanocoder",
    "nanocoder",
  );
  return { props: { stats } };
};
