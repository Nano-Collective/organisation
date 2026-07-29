import { Clock, ExternalLink } from "lucide-react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { FaDiscord } from "react-icons/fa";
import { Footer } from "@/components/Footer";
import {
  CardHover,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";
import {
  daysUntil,
  docsUrlFor,
  fetchWhitepapers,
  type Whitepaper,
  type WhitepaperStatus,
} from "@/lib/whitepapers";

const DOCS_PIPELINE_URL =
  "https://docs.nanocollective.org/collective/projects/how-a-project-comes-to-life";

const DOCS_WHITEPAPERS_URL =
  "https://docs.nanocollective.org/collective/whitepapers";

const DOCS_BRINGING_URL =
  "https://docs.nanocollective.org/collective/projects/bringing-an-existing-project";

const STATUS_ORDER: WhitepaperStatus[] = [
  "In public review",
  "Build approved",
  "Building",
  "Shipped",
  "Draft",
  "Paused",
  "Declined",
  "Superseded",
];

const STATUS_DESCRIPTIONS: Record<WhitepaperStatus, string> = {
  Draft: "Whitepaper PR is open but not yet merged.",
  "In public review":
    "Merged whitepapers inside the 30-day review window. Anyone can read, comment, and shape these.",
  "Build approved":
    "Public review complete. The core team has approved building. Maintainer named.",
  Building: "Repository live and the project is under active build.",
  Shipped: "Project has reached v0.1+ and is in the projects list.",
  Paused: "Approved or in-progress work that has stalled.",
  Declined: "Reviewed and decided against. Rationale on the whitepaper page.",
  Superseded: "Replaced by a newer whitepaper or folded into another project.",
};

interface PipelineProps {
  whitepapers: Whitepaper[];
}

export default function Pipeline({ whitepapers }: PipelineProps) {
  const grouped = STATUS_ORDER.map((status) => ({
    status,
    items: whitepapers.filter((w) => w.status === status),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <Head>
        <title>Project Pipeline | Nano Collective</title>
        <meta
          name="description"
          content="Whitepapers and projects in flight under the Nano Collective. From idea to shipped v0.1, in the open."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="Project Pipeline | Nano Collective"
        />
        <meta
          property="og:description"
          content="Whitepapers and projects in flight under the Nano Collective. From idea to shipped v0.1, in the open."
        />
        <meta property="og:url" content="https://nanocollective.org/pipeline" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <div className="min-h-screen bg-background font-sans">
        {/* Hero */}
        <SectionReveal>
          <section className="relative pt-12 pb-12 sm:pb-20 px-4 md:px-6 container mx-auto border-b border-foreground/20">
            <div className="space-y-4 sm:space-y-8 max-w-4xl">
              <div className="flex items-center gap-2 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-widest border-b border-foreground/20 pb-2 max-w-[200px]">
                <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                  &gt;
                </span>
                Project Pipeline
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[4rem] leading-[1.05] font-bold tracking-tight text-foreground break-words">
                What's in flight
              </h1>

              <p className="text-xs sm:text-lg lg:text-xl text-foreground/70 leading-relaxed max-w-[800px]">
                Every project that ships under the Nano Collective starts with a
                whitepaper, gets argued in public for at least 30 days, and only
                then becomes code. This page shows where every active whitepaper
                sits, in real time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 pt-4 sm:pt-6">
                <a
                  href={DOCS_PIPELINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-none bg-[#0000EE] dark:bg-foreground px-8 text-xs sm:text-sm font-semibold tracking-wide text-white dark:text-background transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring group"
                >
                  Read how the pipeline works
                </a>
                <a
                  href={DOCS_WHITEPAPERS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-none border border-foreground/20 bg-background px-8 text-xs sm:text-sm font-semibold tracking-wide text-foreground transition-colors hover:border-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Browse whitepapers
                </a>
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Grouped whitepapers */}
        {grouped.map(({ status, items }) => (
          <SectionReveal key={status}>
            <section className="py-8 sm:py-12 md:py-24 px-4 md:px-6 container mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-16 gap-6 border-b border-foreground/20 pb-4 sm:pb-8">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                      {status}
                    </h2>
                    <span className="font-mono text-xs font-bold bg-[#0000EE]/10 dark:bg-[#A1A1AA]/10 text-[#0000EE] dark:text-[#A1A1AA] px-3 py-1 uppercase tracking-wider">
                      {items.length}{" "}
                      {items.length === 1 ? "whitepaper" : "whitepapers"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-lg text-foreground/70 font-mono">
                    {STATUS_DESCRIPTIONS[status]}
                  </p>
                </div>
              </div>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 lg:gap-12">
                {items.map((w) => {
                  const remaining =
                    w.status === "In public review" && w.reviewCloses
                      ? daysUntil(w.reviewCloses)
                      : null;
                  return (
                    <StaggerItem key={w.slug}>
                      <a
                        href={docsUrlFor(w.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full group"
                      >
                        <CardHover className="flex flex-col h-full bg-background border border-foreground/20 relative overflow-hidden transition-all p-5 sm:p-8">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                          <div className="relative z-10 space-y-3 sm:space-y-4 h-full flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight group-hover:text-[#0000EE] dark:group-hover:text-[#A1A1AA] transition-colors">
                                {w.title}
                              </h3>
                            </div>
                            <p className="text-xs sm:text-base text-foreground/70 leading-relaxed">
                              {w.description}
                            </p>

                            <div className="pt-4 mt-auto flex items-center justify-between text-[9px] sm:text-xs font-mono border-t border-foreground/20">
                              <div className="flex items-center gap-2 pt-4">
                                <span className="font-bold text-[#0000EE] dark:text-[#A1A1AA]">
                                  [ proposer ]
                                </span>
                                <span className="text-foreground">
                                  {w.proposer}
                                </span>
                              </div>
                              {remaining !== null && remaining > 0 && (
                                <div className="flex items-center gap-1 pt-4 text-foreground/70">
                                  <Clock className="h-3 w-3" />
                                  Closes in {remaining}{" "}
                                  {remaining === 1 ? "day" : "days"}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardHover>
                      </a>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </section>
          </SectionReveal>
        ))}

        {/* Want to build something */}
        <SectionReveal>
          <section className="py-20 md:py-32 px-4 md:px-6 bg-[#0000EE] text-white">
            <div className="container mx-auto max-w-3xl text-center">
              <div className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest mb-6 opacity-80">
                [ Get Involved ]
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 md:mb-8">
                Want to build something?
              </h2>
              <p className="text-xs sm:text-lg md:text-xl opacity-90 mb-12 leading-relaxed max-w-2xl mx-auto">
                Anyone can propose. No application form, no contribution history
                required. If your idea fits the collective's shape (AI tooling
                that respects privacy, runs locally, is open source, or is an
                open variant of something proprietary), the process is built for
                you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={DOCS_PIPELINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 items-center justify-center rounded-none bg-white px-10 text-sm font-bold tracking-wide text-[#0000EE] transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0000EE] group"
                >
                  Read the pipeline
                </a>
                <a
                  href="https://discord.gg/ktPDV6rekE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 items-center justify-center rounded-none border-2 border-white bg-transparent px-10 text-sm font-bold tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0000EE]"
                >
                  <FaDiscord className="mr-2 h-4 w-4" />
                  Start in Discord
                </a>
              </div>

              <div className="mt-16 md:mt-20 pt-12 md:pt-16 border-t border-white/25">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-5 md:mb-6">
                  Already built something?
                </h3>
                <p className="text-xs sm:text-lg md:text-xl opacity-90 mb-10 leading-relaxed max-w-2xl mx-auto">
                  Existing projects can move under the umbrella too. If you
                  maintain a tool that fits the collective's shape, there is a
                  lighter route in: a short submission, a 14-day public review,
                  and a recorded decision. Your project keeps its identity, its
                  maintainers, and its roadmap. What changes is the floor it
                  stands on.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href={DOCS_BRINGING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-14 items-center justify-center rounded-none bg-white px-10 text-sm font-bold tracking-wide text-[#0000EE] transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0000EE] group"
                  >
                    How it works
                  </a>
                  <a
                    href="https://discord.gg/ktPDV6rekE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-14 items-center justify-center rounded-none border-2 border-white bg-transparent px-10 text-sm font-bold tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0000EE]"
                  >
                    <FaDiscord className="mr-2 h-4 w-4" />
                    Start in Discord
                  </a>
                </div>
              </div>
            </div>
          </section>
        </SectionReveal>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<PipelineProps> = async () => {
  const whitepapers = await fetchWhitepapers();
  return { props: { whitepapers } };
};
