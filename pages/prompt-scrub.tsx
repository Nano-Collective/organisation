import {
  Boxes,
  Code,
  Gauge,
  Link2,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { Footer } from "@/components/Footer";
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

const GITHUB_URL = "https://github.com/Nano-Collective/prompt-scrubber";
const DOCS_URL = "https://docs.nanocollective.org/prompt-scrub";

const features: Feature[] = [
  {
    icon: Zap,
    title: "Local-First Scrubbing",
    description:
      "Runs entirely on your machine. Strips identifiers before they ever reach a cloud LLM.",
  },
  {
    icon: Link2, // Or a better icon if I knew all lucide icons available. Let's use FileCode2
    title: "Stable Placeholders",
    description:
      "Maps secrets, emails, paths, and URLs to stable markers like Email_1, preserving prompt determinism.",
  },
  {
    icon: Sparkles,
    title: "Seamless Rehydration",
    description:
      "Restores the original identifying content into the model's response automatically using local session maps.",
  },
  {
    icon: SlidersHorizontal,
    title: "Custom Detectors",
    description:
      "Extend the built-in detectors with your own rules to catch domain-specific sensitive data.",
  },
];

const reasons: Reason[] = [
  {
    icon: Code,
    title: "Privacy by Default",
    description:
      "Never accidentally leak an API key or customer email to a cloud provider again.",
  },
  {
    icon: Gauge,
    title: "Cache-Aware",
    description:
      "Maintains exact byte-prefix determinism to preserve LLM provider prompt caching.",
  },
  {
    icon: Boxes,
    title: "Developer Friendly",
    description:
      "Available as both a CLI tool and a Node.js library for easy integration into your pipelines.",
  },
];

const installCommands: InstallCommand[] = [
  { label: "NPM", command: "npm install prompt-scrub" },
  { label: "Global", command: "npm install -g prompt-scrub" },
];

export default function PromptScrubPage({ stats }: { stats: ProductStats }) {
  return (
    <>
      <Head>
        <title>prompt-scrub | Nano Collective</title>
        <meta
          name="description"
          content="Local-first PII scrubbing for LLM prompts. Maps emails, secrets, and paths to stable placeholders and rehydrates model responses locally."
        />
        <meta property="og:title" content="prompt-scrub | Nano Collective" />
        <meta
          property="og:description"
          content="Local-first PII scrubbing for LLM prompts. Maps emails, secrets, and paths to stable placeholders and rehydrates model responses locally."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://nanocollective.org/prompt-scrub"
        />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <div className="min-h-screen bg-background font-sans flex flex-col">
        <ProductHero
          eyebrow="LOCAL-FIRST PII SCRUBBING"
          title="prompt-scrub"
          description="Local-first PII scrubbing for LLM prompts. Maps emails, secrets, and paths to stable placeholders and rehydrates model responses locally."
          githubUrl={GITHUB_URL}
          docsUrl={DOCS_URL}
          demo={
            <div className="font-mono text-sm leading-relaxed overflow-x-auto bg-background dark:bg-[#111] text-foreground dark:text-zinc-300 p-6">
              <div className="text-[#0000EE] dark:text-pink-400 mb-2 font-bold dark:font-normal">
                $ echo "My email is user@example.com" | prompt-scrub scrub
              </div>
              <div className="text-foreground/80 dark:text-zinc-300 border-l-2 border-foreground/20 dark:border-zinc-700 pl-4 py-2 bg-muted/50 dark:bg-zinc-900/50 mb-4">
                My email is Email_1
              </div>
              <div className="text-[#0000EE] dark:text-pink-400 mb-2 font-bold dark:font-normal">
                $ echo "Hello Email_1" | prompt-scrub rehydrate --session-id
                &lt;id&gt;
              </div>
              <div className="text-foreground/80 dark:text-zinc-300 border-l-2 border-foreground/20 dark:border-zinc-700 pl-4 py-2 bg-muted/50 dark:bg-zinc-900/50">
                Hello user@example.com
              </div>
            </div>
          }
        />

        <CommunityStats stats={stats} />

        <main className="flex-1">
          <SectionReveal>
            <section className="py-16 sm:py-24 border-b border-foreground/20">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                    Privacy-first prompts.
                  </h2>
                  <div className="space-y-6 text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed font-medium">
                    <p>
                      prompt-scrub is a small open-source, local-first utility
                      designed to strip identifying content out of prompts and
                      messages before they hit any cloud LLM.
                    </p>
                    <p>
                      It maps your sensitive data (emails, secrets, paths) to
                      stable placeholders locally, allowing you to rehydrate the
                      model's responses back to their original forms securely.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>

          <FeatureGrid features={features} />

          <QuickStart commands={installCommands} />

          <ReasonsGrid product="prompt-scrub" reasons={reasons} />

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
  const stats = await fetchProductStats("Nano-Collective/prompt-scrubber");
  return { props: { stats } };
};
