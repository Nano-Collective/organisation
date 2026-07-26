import {
  CalendarClock,
  Cpu,
  FileWarning,
  Lock,
  ScrollText,
  ServerOff,
  Target,
  TriangleAlert,
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

const GITHUB_URL = "https://github.com/Nano-Collective/sentinel";
const DOCS_URL = "https://docs.nanocollective.org/sentinel/docs";
const WHITEPAPER_URL =
  "https://docs.nanocollective.org/collective/whitepapers/sentinel";

const DESCRIPTION =
  "Continuous, configurable security and code audits across the repositories in your GitHub organisation, filed as issues for a human to act on.";

const features: Feature[] = [
  {
    icon: CalendarClock,
    title: "Scheduled Audits",
    description:
      "A GitHub Actions workflow sweeps the repositories you point it at on the schedule you set. No hosted service, no GitHub App to authorise.",
  },
  {
    icon: ScrollText,
    title: "Rule Packs You Write",
    description:
      "Sentinel ships no rules of its own. You describe what matters in the code you actually ship, so the audit is yours rather than a generic checklist.",
  },
  {
    icon: FileWarning,
    title: "Findings as Issues",
    description:
      "Every finding lands as an issue on the affected repository, written up for a reviewer, with deduplication and suppression built in.",
  },
  {
    icon: Cpu,
    title: "Local Models First",
    description:
      "Point Sentinel at Ollama, LM Studio, llama.cpp or MLX on a self-hosted runner and the audited code never leaves hardware you own.",
  },
];

const reasons: Reason[] = [
  {
    icon: Lock,
    title: "Your Code Stays Yours",
    description:
      "The local-first path is a first-class option, not an afterthought. Nothing has to be shipped to a third-party scanner.",
  },
  {
    icon: Target,
    title: "Ecosystem-Specific",
    description:
      "A Solana program, a TypeScript API, and a Rust CLI each get the audit they need — because you wrote the pack for each.",
  },
  {
    icon: ServerOff,
    title: "Runs In Your Org",
    description:
      "One configuration repository inside your organisation. Uninstalling is deleting it; there is no external service to deauthorise.",
  },
];

const installCommands: InstallCommand[] = [
  { label: "npx", command: "npx @nanocollective/sentinel init" },
  { label: "pnpm", command: "pnpm dlx @nanocollective/sentinel init" },
];

export default function SentinelPage({ stats }: { stats: ProductStats }) {
  return (
    <>
      <Head>
        <title>Sentinel (Alpha) | Nano Collective</title>
        <meta name="description" content={`In alpha. ${DESCRIPTION}`} />
        <meta
          property="og:title"
          content="Sentinel (Alpha) | Nano Collective"
        />
        <meta property="og:description" content={`In alpha. ${DESCRIPTION}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nanocollective.org/sentinel" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <div className="min-h-screen bg-background font-sans flex flex-col">
        {/* Site-wide alpha banner — the first thing anyone reads on this page. */}
        <div className="bg-[#0000EE] dark:bg-foreground text-white dark:text-background">
          <div className="container mx-auto px-4 md:px-6 py-3 flex items-start gap-3 font-mono text-xs sm:text-sm">
            <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold uppercase tracking-widest">Alpha</span>{" "}
              — Sentinel is early software under active development toward v1.
              Expect breaking changes between releases, and treat it as a triage
              layer rather than a replacement for a formal security audit.
            </p>
          </div>
        </div>

        <ProductHero
          eyebrow="CONTINUOUS SECURITY AUDITS"
          title="Sentinel"
          badge="Alpha"
          badgeNote="Alpha means the CLI, the configuration format, and the rule pack contract can all still change. Pin a version, read the changelog before upgrading, and tell us what breaks."
          description={DESCRIPTION}
          githubUrl={GITHUB_URL}
          docsUrl={DOCS_URL}
          demo={
            <div className="font-mono text-sm leading-relaxed overflow-x-auto bg-background dark:bg-[#111] text-foreground dark:text-zinc-300 p-6">
              <div className="text-[#0000EE] dark:text-pink-400 mb-2 font-bold dark:font-normal">
                $ npx @nanocollective/sentinel init
              </div>
              <div className="text-foreground/80 dark:text-zinc-300 border-l-2 border-foreground/20 dark:border-zinc-700 pl-4 py-2 bg-muted/50 dark:bg-zinc-900/50 mb-4">
                <div>+ sentinel.yaml</div>
                <div>+ .github/workflows/sentinel.yml</div>
                <div>+ rule-packs/</div>
              </div>
              <div className="text-[#0000EE] dark:text-pink-400 mb-2 font-bold dark:font-normal">
                $ sentinel run --rule-pack ./rule-packs/anchor.md
              </div>
              <div className="text-foreground/80 dark:text-zinc-300 border-l-2 border-foreground/20 dark:border-zinc-700 pl-4 py-2 bg-muted/50 dark:bg-zinc-900/50">
                <div>audited 4 repositories · 3 findings</div>
                <div>filed my-org/payments#218 [high]</div>
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
                    Audits that know your code.
                  </h2>
                  <div className="space-y-6 text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed font-medium">
                    <p>
                      Most organisations have more repositories than they have
                      eyes to keep on them. Sentinel is an installable,
                      Nanocoder-driven workflow that runs continuous security
                      and code audits across the repositories you care about,
                      and files what it finds as issues for a human to act on.
                    </p>
                    <p>
                      You install it into your own organisation, write the rule
                      packs that describe what to look for, and a scheduled
                      GitHub Actions workflow does the pass. Local models are a
                      first-class path, so the audited code never has to leave
                      hardware you own.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>

          <FeatureGrid features={features} />

          <QuickStart commands={installCommands} />

          <ReasonsGrid product="Sentinel" reasons={reasons} />

          {/* Honest scoping — what alpha means, and what Sentinel is not. */}
          <SectionReveal>
            <section className="py-16 sm:py-24 border-b border-foreground/20 bg-muted/10">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="flex items-center gap-4 border-b border-foreground/20 pb-6">
                    <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest bg-[#0000EE] dark:bg-foreground text-white dark:text-background px-3 py-1.5">
                      Alpha
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                      Read this before you rely on it
                    </h2>
                  </div>

                  <ul className="space-y-4 font-mono text-sm sm:text-base text-foreground/70">
                    <li className="flex items-start gap-3">
                      <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                        &gt;
                      </span>
                      <span>
                        Sentinel is in alpha and being built toward v1. The CLI,
                        <code className="mx-1">sentinel.yaml</code>, and the
                        rule pack format can change between releases.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                        &gt;
                      </span>
                      <span>
                        It is a triage layer, <strong>not</strong> a substitute
                        for a formal security audit.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                        &gt;
                      </span>
                      <span>
                        It is not a SAST replacement — keep running Semgrep or
                        CodeQL alongside it — and it is not a secret scanner.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                        &gt;
                      </span>
                      <span>
                        It files issues; it does not open fix-up pull requests.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                        &gt;
                      </span>
                      <span>
                        It ships no rule packs of its own. A fresh install
                        audits nothing until you write one.
                      </span>
                    </li>
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <a
                      href={WHITEPAPER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center justify-center rounded-none border border-foreground/20 bg-background px-8 text-xs sm:text-sm font-semibold tracking-wide text-foreground transition-colors hover:border-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <span className="mr-3 font-bold text-[#0000EE] dark:text-[#A1A1AA]">
                        &gt;
                      </span>
                      Read the whitepaper
                    </a>
                    <a
                      href={`${GITHUB_URL}/issues`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center justify-center rounded-none border border-foreground/20 bg-background px-8 text-xs sm:text-sm font-semibold tracking-wide text-foreground transition-colors hover:border-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <span className="mr-3 font-bold text-[#0000EE] dark:text-[#A1A1AA]">
                        &gt;
                      </span>
                      Report what breaks
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>

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
  const stats = await fetchProductStats("Nano-Collective/sentinel");
  return { props: { stats } };
};
