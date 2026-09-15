import {
  EyeOff,
  FileJson,
  GitPullRequest,
  Lock,
  Search,
  Users,
  Zap,
} from "lucide-react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import { Footer } from "@/components/Footer";
import { CommunityStats } from "@/components/product/CommunityStats";
import { type Feature, FeatureGrid } from "@/components/product/FeatureGrid";
import { FinalCTA } from "@/components/product/FinalCTA";
import { ProductHero } from "@/components/product/ProductHero";
import { type Reason, ReasonsGrid } from "@/components/product/ReasonsGrid";
import { SponsorsSection } from "@/components/product/SponsorsSection";
import { SectionReveal } from "@/components/ui/motion";
import { fetchProductStats, type ProductStats } from "@/lib/product-stats";

const LIVE_URL = "https://list.nanocollective.org";
const SUBMIT_URL = "https://list.nanocollective.org/submit";
const GITHUB_URL = "https://github.com/Nano-Collective/nanolist";
const DOCS_URL = "https://docs.nanocollective.org/nanolist/docs";

const DESCRIPTION =
  "The easiest way to browse the AI tool ecosystem — a community-curated directory with a bias toward open-source, local-first, privacy-respecting software.";

const features: Feature[] = [
  {
    icon: Users,
    title: "Curated by Humans",
    description:
      "Every listing is reviewed by a person before it goes live. No pay-to-list, no SEO spam — a submission earns its place or it doesn't get one.",
  },
  {
    icon: EyeOff,
    title: "Zero Third-Party Requests",
    description:
      "Search runs in your browser, icons are self-hosted, and there is no analytics. Browsing the directory tells no one what you looked at.",
  },
  {
    icon: FileJson,
    title: "Open Data",
    description:
      "Every listing is a single JSON file in a public repository. The whole dataset is yours to read, fork, or build on — the site is just one view of it.",
  },
  {
    icon: Zap,
    title: "Fast and Static",
    description:
      "The entire directory ships as a static site. No backend, no database, no cookies — just pages that load instantly and search that works offline.",
  },
];

const reasons: Reason[] = [
  {
    icon: Lock,
    title: "Private by Default",
    description:
      "A directory of privacy-respecting tools should itself respect your privacy. Visitors make zero third-party requests, full stop.",
  },
  {
    icon: Search,
    title: "A Bias Worth Having",
    description:
      "Listings lean deliberately toward open-source, local-first software — the tools you can run, inspect, and keep when a vendor pivots.",
  },
  {
    icon: GitPullRequest,
    title: "Anyone Can Contribute",
    description:
      "Spotted a missing tool or a stale description? It's a form away — or a pull request against a JSON file. The community keeps the list honest.",
  },
];

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
          eyebrow="THE AI TOOL DIRECTORY"
          title="Nanolist"
          description={DESCRIPTION}
          githubUrl={GITHUB_URL}
          docsUrl={DOCS_URL}
          primaryCta={{ href: LIVE_URL, label: "Browse the Directory" }}
          demo={
            <div className="font-mono text-sm leading-relaxed overflow-x-auto bg-background dark:bg-[#111] text-foreground dark:text-zinc-300 p-6">
              <div className="text-[#0000EE] dark:text-pink-400 mb-2 font-bold dark:font-normal">
                list.nanocollective.org
              </div>
              <div className="text-foreground/80 dark:text-zinc-300 border-l-2 border-foreground/20 dark:border-zinc-700 pl-4 py-2 bg-muted/50 dark:bg-zinc-900/50 mb-4">
                <div>search: "local inference"</div>
              </div>
              <div className="text-foreground/80 dark:text-zinc-300 border-l-2 border-foreground/20 dark:border-zinc-700 pl-4 py-2 bg-muted/50 dark:bg-zinc-900/50">
                <div>ollama — [open-source] [local-first]</div>
                <div>llama.cpp — [open-source] [local-first]</div>
                <div>LM Studio — [local-first] [privacy-first]</div>
                <div className="mt-2 text-foreground/50">
                  searched in your browser · 0 third-party requests
                </div>
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
                    A directory you can trust.
                  </h2>
                  <div className="space-y-6 text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed font-medium">
                    <p>
                      The AI tool landscape moves fast, and most directories
                      chasing it are ad-funded listicles ranked by whoever paid
                      most recently. Nanolist is the opposite: a
                      community-curated catalogue where every entry is a single
                      JSON file in a public repository, reviewed by a human
                      before it goes live.
                    </p>
                    <p>
                      The result is a fast, static, searchable site with a
                      deliberate bias toward open-source, local-first,
                      privacy-respecting software — and a browsing experience
                      that makes zero third-party requests while you use it.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>

          <FeatureGrid features={features} />

          {/* How a tool gets listed — the submission pipeline, not an install. */}
          <SectionReveal>
            <section className="py-16 sm:py-24 border-b border-foreground/20 bg-muted/10">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                  <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                      Know a tool that belongs here?
                    </h2>
                    <p className="text-md text-foreground/70">
                      Submissions take a couple of minutes. Review is done by
                      people, not a queue that goes nowhere.
                    </p>
                  </div>

                  <ol className="space-y-4 font-mono text-sm sm:text-base text-foreground/70">
                    <li className="flex items-start gap-3 border border-foreground/20 bg-background p-4 sm:p-6">
                      <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                        1
                      </span>
                      <span>
                        Fill in the submission form — name, link, and why the
                        tool fits the directory's bias.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 border border-foreground/20 bg-background p-4 sm:p-6">
                      <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                        2
                      </span>
                      <span>
                        A validation bot checks the submission and opens a pull
                        request adding one JSON file.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 border border-foreground/20 bg-background p-4 sm:p-6">
                      <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                        3
                      </span>
                      <span>
                        A maintainer reviews it. On merge, the listing is live
                        on the next deploy.
                      </span>
                    </li>
                  </ol>

                  <div className="flex justify-center pt-2">
                    <a
                      href={SUBMIT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center justify-center rounded-none bg-[#0000EE] dark:bg-foreground px-8 text-xs sm:text-sm font-semibold tracking-wide text-white dark:text-background transition-colors hover:bg-[#0000EE]/90 dark:hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      Submit a Tool
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>

          <ReasonsGrid product="Nanolist" reasons={reasons} />

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
