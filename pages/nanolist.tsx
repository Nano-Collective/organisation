import { EyeOff, FileJson, Search, Users, Zap } from "lucide-react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { Footer } from "@/components/Footer";
import { CommunityStats } from "@/components/product/CommunityStats";
import { type Feature, FeatureGrid } from "@/components/product/FeatureGrid";
import { FinalCTA } from "@/components/product/FinalCTA";
import { ProductHero } from "@/components/product/ProductHero";
import { SponsorsSection } from "@/components/product/SponsorsSection";
import { SectionReveal } from "@/components/ui/motion";
import { fetchProductStats, type ProductStats } from "@/lib/product-stats";

const LIVE_URL = "https://list.nanocollective.org";
const SUBMIT_URL = "https://list.nanocollective.org/submit";
const GITHUB_URL = "https://github.com/Nano-Collective/nanolist";
const DOCS_URL = "https://docs.nanocollective.org/nanolist/docs";

const DESCRIPTION =
  "A browsable, community-curated directory of AI tools — biased toward open-source, local-first, privacy-respecting software.";

const features: Feature[] = [
  {
    icon: Users,
    title: "Curated by Humans",
    description:
      "Every listing is reviewed by a person before it goes live. No pay-to-list, no SEO spam.",
  },
  {
    icon: EyeOff,
    title: "Zero Third-Party Requests",
    description:
      "Search runs in your browser, icons are self-hosted, no analytics. Browsing tells no one what you looked at.",
  },
  {
    icon: FileJson,
    title: "Open Data",
    description:
      "Every listing is one JSON file in a public repository — read it, fork it, build on it.",
  },
  {
    icon: Zap,
    title: "Fast and Static",
    description:
      "No backend, no database, no cookies. Pages load instantly and search works offline.",
  },
];

/** Static mock of the Nanolist homepage; entries mirror real listing data. */
const mockListings = [
  {
    name: "Ollama",
    author: "Ollama",
    description:
      "Run open large language models locally with a simple CLI and REST API.",
    badges: ["Open source", "Local-first", "Privacy-first", "Self-hostable"],
    category: "Local Inference",
  },
  {
    name: "whisper.cpp",
    author: "ggml-org (Georgi Gerganov)",
    description:
      "Port of OpenAI's Whisper speech recognition model in plain C/C++.",
    badges: ["Open source", "Local-first", "Privacy-first", "Self-hostable"],
    category: "Audio & Voice",
  },
];

function HomepageMock() {
  return (
    <div className="bg-background dark:bg-[#111] p-4 sm:p-6 space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-foreground/20 pb-3">
        <span className="font-bold tracking-tight text-sm text-foreground">
          Nanolist
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
          list.nanocollective.org
        </span>
      </div>

      <div className="text-sm sm:text-base font-bold tracking-tight text-foreground">
        AI tools that{" "}
        <span className="font-serif font-medium text-[#0000EE] dark:text-[#A1A1AA]">
          respect you
        </span>
      </div>

      <div className="flex items-center gap-2 border border-foreground/20 bg-muted/30 px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="font-mono text-xs text-muted-foreground">
          Search tools, tags, authors...
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {mockListings.map((listing) => (
          <div
            key={listing.name}
            className="flex flex-col border border-foreground/20 bg-background p-4"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground/20 bg-muted font-mono text-xs font-bold text-foreground/70">
                {listing.name[0].toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold tracking-tight text-foreground">
                  {listing.name}
                </div>
                <div className="truncate font-mono text-[10px] text-muted-foreground">
                  {listing.author}
                </div>
              </div>
            </div>
            <p className="mt-2.5 line-clamp-1 text-xs leading-relaxed text-foreground/70">
              {listing.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {listing.badges.map((badge) => (
                <span
                  key={badge}
                  className="border border-foreground/20 bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-foreground/70"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-3 font-mono text-[10px] font-bold text-[#0000EE] dark:text-[#A1A1AA]">
              [ {listing.category} ]
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NanolistPage({ stats }: { stats: ProductStats }) {
  return (
    <>
      <Head>
        <title>Nanolist | Nano Collective</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content="Nanolist | Nano Collective" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nanocollective.org/nanolist" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <div className="min-h-screen bg-background font-sans flex flex-col">
        <ProductHero
          eyebrow="COMMUNITY-CURATED DIRECTORY"
          title="Nanolist"
          description={DESCRIPTION}
          docsUrl={DOCS_URL}
          primaryCta={{ href: LIVE_URL, label: "Browse the Directory" }}
          demo={<HomepageMock />}
        />

        <CommunityStats stats={stats} />

        <main className="flex-1">
          <SectionReveal>
            <section className="py-16 sm:py-24 border-b border-foreground/20">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                    AI tools that respect you.
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed font-medium">
                    Every entry is a single JSON file in a public repository,
                    reviewed by a human before it goes live — and the site makes
                    zero third-party requests while you browse it.
                  </p>
                </div>
              </div>
            </section>
          </SectionReveal>

          <FeatureGrid features={features} />

          <SectionReveal>
            <section className="py-16 sm:py-24 border-b border-foreground/20 bg-muted/10">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                    Know a tool that belongs here?
                  </h2>
                  <p className="text-md text-foreground/70">
                    Submissions take a couple of minutes and are reviewed by
                    people, not a queue that goes nowhere.
                  </p>
                  <div className="flex justify-center pt-2">
                    <a
                      href={SUBMIT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-none bg-[#0000EE] dark:bg-foreground px-8 text-xs sm:text-sm font-semibold tracking-wide text-white dark:text-background transition-colors hover:bg-[#0000EE]/90 dark:hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      Submit a Tool
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
  const stats = await fetchProductStats("Nano-Collective/nanolist");
  return { props: { stats } };
};
