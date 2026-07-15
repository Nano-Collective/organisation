import {
  Bitcoin,
  Gift,
  Heart,
  Mail,
  MessageCircle,
  Wallet,
} from "lucide-react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { Footer } from "@/components/Footer";
import { SponsorLogo } from "@/components/SponsorLogo";
import {
  CardHover,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";
import { fetchTotalVisits } from "@/lib/cloudflare-stats";
import { fetchTotalDownloads } from "@/lib/npm-stats";
import { builderSponsors, supporterSponsors } from "@/lib/sponsors";

interface SponsorPageProps {
  totalDownloads: number;
  monthlyVisitors: number;
}

const projects = [
  {
    name: "Nanocoder",
    url: "https://github.com/Nano-Collective/nanocoder",
    description: "CLI coding agent with multi-provider AI support",
  },
  {
    name: "Nanotune",
    url: "https://github.com/Nano-Collective/nanotune",
    description:
      "Interactive CLI for fine-tuning small language models on Apple Silicon",
  },
  {
    name: "get-md",
    url: "https://github.com/Nano-Collective/get-md",
    description:
      "Fast HTML-to-Markdown converter optimised for LLM consumption",
  },
  {
    name: "json-up",
    url: "https://github.com/Nano-Collective/json-up",
    description: "Type-safe JSON migration tool with Zod schema validation",
  },
  {
    name: "prompt-scrub",
    url: "https://github.com/Nano-Collective/prompt-scrubber",
    description: "Local-first PII scrubbing for LLM prompts",
  },
];

const tiers = [
  {
    name: "Individual",
    price: "$5 / $25 / $100",
    cadence: "per month",
    audience: "For individuals who want to support recurringly.",
    perks: [
      "Name listed on this page under Individual sponsors",
      "Listed on the public Open Collective ledger",
    ],
    cta: {
      label: "Sponsor on Open Collective",
      href: "https://opencollective.com/nano-collective",
    },
  },
  {
    name: "Supporter",
    price: "$250",
    cadence: "per month",
    audience:
      "For companies, indie teams, and small SaaS that want a visible association with the Collective.",
    perks: [
      "Logo + link on this page",
      "Logo + link on the Nano-Collective GitHub organisation profile",
      "One-time acknowledgement across the Collective's social presences when sponsorship begins",
      "Listed as a financial contributor on the public Open Collective page",
    ],
    cta: {
      label: "Sponsor on Open Collective",
      href: "https://opencollective.com/nano-collective",
    },
  },
  {
    name: "Builder",
    price: "$1,000",
    cadence: "per month",
    audience:
      "For infrastructure companies, hosting providers, and aligned foundations that want sustained visibility across every Nano Collective surface.",
    perks: [
      "Everything in Supporter",
      "Larger logo placement on this page",
      "Logo on the README of every Nano Collective project",
      "Logo on the nanocollective.org homepage and the docs site footer",
      "One dedicated welcome post on the Nano Collective blog when sponsorship begins",
      "Quarterly sponsor update: what shipped, where the fund went, what's next",
    ],
    cta: {
      label: "Open a conversation",
      href: "https://discord.gg/ktPDV6rekE",
    },
  },
];

export default function Sponsor({
  totalDownloads,
  monthlyVisitors,
}: SponsorPageProps) {
  const downloadsLabel =
    totalDownloads > 0 ? totalDownloads.toLocaleString() : null;
  const visitorsLabel =
    monthlyVisitors > 0 ? monthlyVisitors.toLocaleString() : null;

  return (
    <>
      <Head>
        <title>Sponsorship | Nano Collective</title>
        <meta
          name="description"
          content="Sponsor the Nano Collective. Fund the community fund that pays bounties to OSS contributors building privacy-respecting, local-first AI tooling."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Sponsorship | Nano Collective" />
        <meta
          property="og:description"
          content="Sponsor the Nano Collective. Fund the community fund that pays bounties to OSS contributors building privacy-respecting, local-first AI tooling."
        />
        <meta property="og:url" content="https://nanocollective.org/sponsor" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <div className="min-h-screen bg-background font-sans">
        {/* Minimal Hero */}
        <SectionReveal>
          <section className="py-12 md:py-20 border-b border-foreground/10">
            <div className="container mx-auto px-4 md:px-6">
              <StaggerContainer className="text-center">
                <StaggerItem>
                  <div className="font-mono text-xs font-bold uppercase tracking-widest mb-6 text-muted-foreground">
                    [ Sponsorship ]
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 break-words">
                    Sponsor the Nano Collective.
                  </h1>
                </StaggerItem>
                <StaggerItem className="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
                  <p className="text-xs sm:text-lg md:text-xl text-foreground/70 leading-relaxed">
                    The Nano Collective is a community-led group of developers,
                    designers, and maintainers building open-source AI tools for
                    the people who use them. We build not for profit, but for
                    the community.
                  </p>
                  <p className="text-xs sm:text-lg text-foreground/70 leading-relaxed">
                    Sponsorship funds the people doing the work. The Collective
                    is fiscally hosted by{" "}
                    <a
                      href="https://opencollective.com/nano-collective"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                    >
                      Open Source Collective
                    </a>
                    ; every pound, dollar, and sat received is published
                    transparently in real time. Funds go to two places, and only
                    those two: the cost of operating the Collective, and the
                    community fund that pays bounties to OSS contributors. Full
                    terms are in the{" "}
                    <a
                      href="https://docs.nanocollective.org/collective/organisation/economics-charter"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                    >
                      Economics Charter
                    </a>
                    .
                  </p>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </section>
        </SectionReveal>

        {/* Current sponsors */}
        <SectionReveal>
          <section className="border-b border-foreground/10 py-16">
            <div className="container mx-auto px-4 md:px-6">
              <div className="space-y-12">
                <div className="space-y-4 text-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                    Current sponsors
                  </h2>
                  <p className="text-xs sm:text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
                    The sponsorship program is newly launched. Most spots below
                    are still open. The first organisations in at each tier set
                    the tone for the rest.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-b border-foreground/10 pb-2">
                    <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      Builders
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      $1,000 / month
                    </span>
                  </div>
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {builderSponsors.map((sponsor) => (
                      <StaggerItem key={sponsor.name}>
                        <CardHover className="relative overflow-hidden border border-foreground/20 transition-all h-full">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                          <SponsorLogo
                            sponsor={sponsor}
                            className="h-32 px-8 bg-background relative z-10 flex items-center justify-center"
                            imgClassName="max-h-16"
                          />
                        </CardHover>
                      </StaggerItem>
                    ))}
                    {["b1", "b2", "b3"]
                      .slice(0, Math.max(0, 3 - builderSponsors.length))
                      .map((slot) => (
                        <StaggerItem key={slot}>
                          <a
                            href="https://discord.gg/ktPDV6rekE"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group overflow-hidden flex h-32 items-center justify-center border border-dashed border-foreground/30 bg-muted/30 transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.5)] hover:border-foreground/60 hover:bg-muted"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                            <span className="relative z-10 font-mono text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">
                              Your brand here
                            </span>
                          </a>
                        </StaggerItem>
                      ))}
                  </StaggerContainer>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-b border-foreground/10 pb-2">
                    <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      Supporters
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      $250 / month
                    </span>
                  </div>
                  <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {supporterSponsors.map((sponsor) => (
                      <StaggerItem key={sponsor.name}>
                        <CardHover className="relative overflow-hidden border border-foreground/20 transition-all h-full">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                          <SponsorLogo
                            sponsor={sponsor}
                            className="h-24 px-5 bg-background relative z-10 flex items-center justify-center"
                            imgClassName="max-h-12"
                          />
                        </CardHover>
                      </StaggerItem>
                    ))}
                    {["s1", "s2", "s3", "s4"]
                      .slice(0, Math.max(0, 4 - supporterSponsors.length))
                      .map((slot) => (
                        <StaggerItem key={slot}>
                          <a
                            href="https://opencollective.com/nano-collective"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group overflow-hidden flex h-24 items-center justify-center border border-dashed border-foreground/30 bg-muted/30 transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.5)] hover:border-foreground/60 hover:bg-muted"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                            <span className="relative z-10 font-mono text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">
                              Your brand here
                            </span>
                          </a>
                        </StaggerItem>
                      ))}
                  </StaggerContainer>
                </div>

                <p className="text-sm font-mono text-foreground/60 max-w-3xl mx-auto text-center">
                  Individual sponsors are listed automatically via Open
                  Collective as they join. Bespoke partnership spots are open:{" "}
                  <a
                    href="https://discord.gg/ktPDV6rekE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                  >
                    open a conversation
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Why this matters */}
        <SectionReveal>
          <section className="border-b border-foreground/10 py-16">
            <div className="container mx-auto px-4 md:px-6">
              <div className="space-y-6 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  Why this matters
                </h2>
                <p className="text-xs sm:text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
                  AI is becoming the most personal piece of infrastructure most
                  people use: the place they think out loud, work through
                  problems, and hand off real parts of their workflow. The
                  systems people are coming to depend on are largely owned by a
                  small number of companies whose incentives are not aligned
                  with the people using them.
                </p>
                <p className="text-xs sm:text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
                  The Nano Collective exists because the alternative needs to be
                  built deliberately, in the open, by people who care about
                  getting it right. Sponsorship is how that work gets funded.
                </p>
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* What the Collective ships */}
        <SectionReveal>
          <section className="border-b border-foreground/10 py-16">
            <div className="container mx-auto px-4 md:px-6">
              <div className="space-y-10">
                <div className="space-y-4 text-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                    What the Collective ships today
                  </h2>
                  <p className="text-xs sm:text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
                    The Collective ships five open-source projects
                    {downloadsLabel ? (
                      <>
                        , with{" "}
                        <strong className="text-foreground font-mono">
                          {downloadsLabel} total npm downloads
                        </strong>{" "}
                        to date across them
                      </>
                    ) : null}
                    {visitorsLabel ? (
                      <>
                        {" "}
                        and{" "}
                        <strong className="text-foreground font-mono">
                          {visitorsLabel} monthly visitors
                        </strong>{" "}
                        across our sites
                      </>
                    ) : null}
                    . Live download counts, release history, and growth
                    statistics are published at{" "}
                    <Link
                      href="/growth"
                      className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                    >
                      nanocollective.org/growth
                    </Link>
                    .
                  </p>
                </div>
                <StaggerContainer className="grid md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <StaggerItem key={project.name}>
                      <CardHover className="block border border-foreground/20 bg-background p-6 transition-all h-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                            <FaGithub className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <h3 className="font-bold text-xl tracking-tight">
                              {project.name}
                            </h3>
                          </div>
                          <p className="text-xs sm:text-lg text-foreground/70">
                            {project.description}
                          </p>
                        </div>
                      </CardHover>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Tiers */}
        <SectionReveal>
          <section className="border-b border-foreground/10 py-16">
            <div className="container mx-auto px-4 md:px-6">
              <StaggerContainer className="space-y-12">
                <StaggerItem className="space-y-4 text-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                    Tiers
                  </h2>
                  <p className="text-xs sm:text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
                    A small, deliberately simple program. Same rule across every
                    tier: more support = more surfaces, whether that support is
                    cash or in-kind resources valued at their fair equivalent.
                    No exclusivity, no slot caps, no influence over the roadmap.
                    Sponsors fund the work; the Collective directs it.
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <div className="grid lg:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                      <CardHover
                        key={tier.name}
                        className="flex flex-col h-full bg-background border border-foreground/20 transition-all overflow-hidden relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                        <div className="relative z-10 flex flex-col h-full">
                          <div className="p-6 border-b border-foreground/10 bg-muted/30">
                            <h3 className="text-2xl font-bold tracking-tight mb-2">
                              {tier.name}
                            </h3>
                            <div className="font-mono">
                              <span className="text-xl font-bold">
                                {tier.price}
                              </span>{" "}
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                {tier.cadence}
                              </span>
                            </div>
                          </div>
                          <div className="p-6 flex flex-col gap-6 flex-1">
                            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                              {tier.audience}
                            </p>
                            <div className="space-y-3 text-xs sm:text-sm flex-1">
                              {tier.perks.map((perk) => (
                                <div
                                  key={perk}
                                  className="flex gap-3 text-foreground/70 leading-relaxed"
                                >
                                  <span className="text-foreground font-bold mt-0.5">
                                    ·
                                  </span>
                                  <span>{perk}</span>
                                </div>
                              ))}
                            </div>
                            <a
                              href={tier.cta.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full text-center bg-[#0000EE] dark:bg-foreground text-white dark:text-background py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-colors mt-auto"
                            >
                              {tier.cta.label}
                            </a>
                          </div>
                        </div>
                      </CardHover>
                    ))}
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Bespoke */}
                    <CardHover className="bg-background border border-foreground/20 p-8 transition-all overflow-hidden relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold tracking-tight mb-2">
                          Bespoke partnerships
                        </h3>
                        <p className="font-mono text-xs sm:text-sm text-muted-foreground mb-6 uppercase tracking-widest">
                          [ By arrangement ]
                        </p>
                        <div className="space-y-6">
                          <p className="text-xs sm:text-lg text-foreground/80 leading-relaxed">
                            For organisations interested in a larger or named
                            arrangement: publicly named partnership, joint
                            content, a direct relationship with the core team,
                            or anything outside the standard tiers. Designed
                            case by case. Terms are agreed and published before
                            the relationship begins.
                          </p>
                          <p className="text-xs sm:text-lg text-foreground/60 leading-relaxed">
                            To see exactly what your support reaches and how
                            contributors and project proposers access it, see{" "}
                            <a
                              href="https://docs.nanocollective.org/collective/organisation/contributor-resources"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                            >
                              Contributor Resources
                            </a>
                            .
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-foreground/10">
                            <a
                              href="https://discord.gg/ktPDV6rekE"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 bg-[#0000EE] dark:bg-foreground text-white dark:text-background px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-colors"
                            >
                              <FaDiscord className="h-4 w-4" />
                              Discord
                            </a>
                            <a
                              href="mailto:hello@nanocollective.org"
                              className="inline-flex items-center justify-center gap-2 border border-foreground/20 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-muted transition-colors"
                            >
                              <Mail className="h-4 w-4" />
                              Email
                            </a>
                          </div>
                        </div>
                      </div>
                    </CardHover>

                    {/* Non-cash sponsorship */}
                    <CardHover className="bg-background border border-foreground/20 p-8 transition-all overflow-hidden relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                      <div className="relative z-10">
                        <h3 className="text-xl sm:text-2xl flex items-center gap-3 font-bold tracking-tight mb-2">
                          <Gift className="h-6 w-6 text-[#0000EE] dark:text-[#A1A1AA]" />
                          Resources, not cash
                        </h3>
                        <p className="font-mono text-xs text-muted-foreground mb-6 uppercase tracking-widest">
                          [ In-kind support ]
                        </p>
                        <div className="space-y-6">
                          <p className="text-xs sm:text-lg text-foreground/80 leading-relaxed">
                            Sponsorship does not have to be money. We welcome
                            non-cash support such as cloud and API credits,
                            compute, software licenses, hardware, and other
                            resources that help our contributors build. There is
                            no Open Collective sign-up for in-kind support,
                            since no money changes hands.
                          </p>
                          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                            Reach out and we will work out together what your
                            contribution gets you in return, recognised on the
                            same basis as the tiers above.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-foreground/10">
                            <a
                              href="https://discord.gg/ktPDV6rekE"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 bg-[#0000EE] dark:bg-foreground text-white dark:text-background px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-colors"
                            >
                              <FaDiscord className="h-4 w-4" />
                              Discord
                            </a>
                            <a
                              href="mailto:hello@nanocollective.org"
                              className="inline-flex items-center justify-center gap-2 border border-foreground/20 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-muted transition-colors"
                            >
                              <Mail className="h-4 w-4" />
                              Email
                            </a>
                          </div>
                        </div>
                      </div>
                    </CardHover>
                  </div>
                </StaggerItem>

                {/* What's not included */}
                <StaggerItem>
                  <div className="space-y-6 pt-8 text-center max-w-4xl mx-auto">
                    <h3 className="text-xl sm:text-xl font-bold tracking-tight">
                      What sponsorship does not include
                    </h3>
                    <div className="space-y-4 text-xs sm:text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto">
                      <p>No early access to unshipped products</p>
                      <p>
                        No influence over the roadmap, prioritisation, or which
                        contributors get bounties
                      </p>
                      <p>
                        No routing of recurring sponsorship dollars to a
                        specific project's payouts. To direct funds to specific
                        work, use a designated donation
                      </p>
                      <p>
                        No exclusivity at any tier. Sponsors at the same tier
                        are listed alphabetically
                      </p>
                    </div>
                    <p className="font-mono text-xs m:text-sm text-foreground/60 pt-4 max-w-2xl mx-auto text-center">
                      Annual prepayments at any tier receive a 10% discount.
                      Invoice-based contributions are supported via Open Source
                      Collective. Contact us to set this up.
                    </p>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </section>
        </SectionReveal>

        {/* One-off contributions */}
        <SectionReveal>
          <section className="border-b border-foreground/10 py-16">
            <div className="container mx-auto px-4 md:px-6">
              <StaggerContainer className="space-y-8">
                <StaggerItem>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center">
                    One-off contributions
                  </h2>
                </StaggerItem>
                <div className="grid md:grid-cols-2 gap-8">
                  <StaggerItem>
                    <CardHover className="flex flex-col bg-background border border-foreground/20 p-8 transition-all overflow-hidden relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                      <div className="relative z-10 flex flex-col h-full">
                        <h3 className="flex items-center gap-3 text-xl sm:text-2xl font-bold tracking-tight mb-6">
                          <Heart className="h-6 w-6 text-[#0000EE] dark:text-[#A1A1AA]" />
                          General donation
                        </h3>
                        <div className="flex flex-col gap-6 flex-1">
                          <p className="text-xs sm:text-lg text-foreground/80 leading-relaxed">
                            Any amount, one time, into the community fund. No
                            perks attached, no need to reach out. Donate
                            directly on Open Collective, or send Bitcoin to the
                            Nano Collective wallet.
                          </p>
                          <div className="space-y-4 font-mono text-sm text-foreground/70 flex-1">
                            <div className="flex items-start gap-3">
                              <Wallet className="h-5 w-5 mt-0.5 shrink-0 text-foreground" />
                              <span>Fiat via Open Source Collective</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <Bitcoin className="h-5 w-5 mt-0.5 shrink-0 text-foreground" />
                              <span>
                                Bitcoin: wallet address available on{" "}
                                <a
                                  href="https://discord.gg/ktPDV6rekE"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                                >
                                  Discord
                                </a>
                              </span>
                            </div>
                          </div>
                          <a
                            href="https://opencollective.com/nano-collective"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-[#0000EE] dark:bg-foreground text-white dark:text-background py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-colors mt-auto"
                          >
                            Donate on Open Collective
                          </a>
                        </div>
                      </div>
                    </CardHover>
                  </StaggerItem>

                  <StaggerItem>
                    <CardHover className="flex flex-col bg-background border border-foreground/20 p-8 transition-all overflow-hidden relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                      <div className="relative z-10 flex flex-col h-full">
                        <h3 className="flex items-center gap-3 text-xl sm:text-2xl font-bold tracking-tight mb-6">
                          <MessageCircle className="h-6 w-6 text-[#0000EE] dark:text-[#A1A1AA]" />
                          Designated donation
                        </h3>
                        <div className="flex flex-col gap-6 flex-1">
                          <p className="text-xs sm:text-lg text-foreground/80 leading-relaxed">
                            A specific piece of work, scoped and agreed with the
                            core team before the donation is accepted. Nothing
                            is open-ended. Nothing is retrospective. You know
                            what the work is and how it will be delivered before
                            the donation is made. Delivery is reported publicly.
                          </p>
                          <p className="font-mono text-xs sm:text-sm text-foreground/50 italic flex-1 border-l-2 border-foreground/20 pl-4">
                            The program is new; there are no completed examples
                            to cite yet. The first delivered designated donation
                            will be the first listed here.
                          </p>
                          <a
                            href="https://discord.gg/ktPDV6rekE"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center border border-foreground/20 bg-transparent text-foreground py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-muted transition-colors mt-auto"
                          >
                            Scope a donation
                          </a>
                        </div>
                      </div>
                    </CardHover>
                  </StaggerItem>
                </div>
              </StaggerContainer>
            </div>
          </section>
        </SectionReveal>

        {/* Who we accept */}
        <SectionReveal>
          <section className="border-b border-foreground/10 py-16">
            <div className="container mx-auto px-4 md:px-6">
              <div className="space-y-6 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  Who we accept
                </h2>
                <p className="text-xs sm:text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
                  The Nano Collective reserves the right to decline any
                  sponsorship. We will decline if a prospective sponsor's stated
                  mission, product, or public conduct conflicts materially with
                  what the Collective is building: privacy-respecting,
                  local-first, open AI tooling. Declining is not a moral
                  judgement; it is a recognition that some associations would
                  undermine the work for everyone else who participates.
                  Decisions are made by the core team and are not appealable.
                </p>
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* How it's handled */}
        <SectionReveal>
          <section className="border-b border-foreground/10 py-16">
            <div className="container mx-auto px-4 md:px-6">
              <div className="space-y-6 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  How sponsorship is handled
                </h2>
                <p className="text-xs sm:text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
                  The Nano Collective is fiscally hosted by{" "}
                  <a
                    href="https://opencollective.com/nano-collective"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                  >
                    Open Source Collective
                  </a>
                  . All incoming and outgoing fiat payments are visible on the
                  public Open Collective ledger in real time. Bitcoin donations
                  to the published Nano Collective wallet address are verifiable
                  on-chain.
                </p>
                <p className="text-xs sm:text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
                  For exactly how funds reach contributors, see the{" "}
                  <a
                    href="https://docs.nanocollective.org/collective/organisation/economics-charter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                  >
                    Economics Charter
                  </a>
                  . For sponsorship operations, including logo specifications
                  and the onboarding process, see{" "}
                  <a
                    href="https://docs.nanocollective.org/collective/organisation/support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                  >
                    Support the Collective
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Start a conversation */}
        <SectionReveal>
          <section className="py-16">
            <div className="container mx-auto px-4 md:px-6">
              <StaggerContainer className="space-y-8 text-center">
                <StaggerItem>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                    Start a conversation
                  </h2>
                </StaggerItem>
                <StaggerItem>
                  <div className="space-y-6 text-xs sm:text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
                    <p>
                      <strong className="text-foreground">
                        Recurring sponsorship at any tier
                      </strong>
                      : sign up via{" "}
                      <a
                        href="https://opencollective.com/nano-collective"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                      >
                        Open Collective
                      </a>
                      . For Builder or bespoke arrangements, message us first
                      via{" "}
                      <a
                        href="https://discord.gg/ktPDV6rekE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                      >
                        Discord
                      </a>{" "}
                      so we can welcome you properly.
                    </p>
                    <p>
                      <strong className="text-foreground">
                        Bespoke partnership
                      </strong>
                      : open a conversation on{" "}
                      <a
                        href="https://discord.gg/ktPDV6rekE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
                      >
                        Discord
                      </a>{" "}
                      or contact the core team directly.
                    </p>
                    <p>
                      <strong className="text-foreground">
                        Designated donation
                      </strong>
                      : reach out before sending. We scope and agree the work
                      together first.
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-foreground/10 justify-center">
                  <a
                    href="https://opencollective.com/nano-collective"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-[#0000EE] dark:bg-foreground text-white dark:text-background px-8 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-colors"
                  >
                    Open Collective
                  </a>
                  <a
                    href="https://discord.gg/ktPDV6rekE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-foreground/20 bg-transparent px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-muted transition-colors"
                  >
                    <FaDiscord className="h-5 w-5" />
                    Discord
                  </a>
                  <a
                    href="mailto:hello@nanocollective.org"
                    className="inline-flex items-center justify-center gap-2 border border-foreground/20 bg-transparent px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-muted transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    Email us
                  </a>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </section>
        </SectionReveal>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<SponsorPageProps> = async () => {
  const [totalDownloads, monthlyVisitors] = await Promise.all([
    fetchTotalDownloads(),
    fetchTotalVisits(),
  ]);

  return {
    props: {
      totalDownloads,
      monthlyVisitors,
    },
  };
};
