import type { GetStaticProps } from "next";
import Head from "next/head";
import { CommunityCTA } from "@/components/CommunityCTA";
import { FeaturedPackages } from "@/components/FeaturedPackages";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LatestDiscussions } from "@/components/LatestDiscussions";
import { Mission } from "@/components/Mission";
import { Products } from "@/components/Products";
import { ProofBar } from "@/components/ProofBar";
import { Sponsors } from "@/components/Sponsors";
import { SectionReveal } from "@/components/ui/motion";
import { fetchRedditSubscribers } from "@/lib/product-stats";

import type { Discussion } from "@/types/discussion";

interface OrgStatsData {
  stars: number;
  contributors: number;
  pullRequests: number;
  discordMembers: number;
  redditSubscribers: number;
  lastUpdated: string;
  error: string | null;
}

interface HomeProps {
  discussions: Discussion[];
  orgStats: OrgStatsData;
  nanocoderVersion: string;
}

export default function Home({
  discussions,
  orgStats,
  nanocoderVersion,
}: HomeProps) {
  return (
    <>
      <Head>
        <title>Nano Collective - Powerful AI Tools, Open for All</title>
        <meta
          name="description"
          content="Building powerful AI tools for the community. Privacy-respecting, local-first and open for all."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* OpenGraph */}
        <meta
          property="og:title"
          content="Nano Collective - Powerful AI Tools, Open for All"
        />
        <meta
          property="og:description"
          content="Building powerful AI tools for the community. Privacy-respecting, local-first and open for all."
        />
        <meta property="og:url" content="https://nanocollective.org" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:alt" content="Nano Collective Logo" />

        {/* Twitter Cards */}
        <meta
          name="twitter:title"
          content="Nano Collective - Powerful AI Tools, Open for All"
        />
        <meta
          name="twitter:description"
          content="Building powerful AI tools for the community. Privacy-respecting, local-first and open for all."
        />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:image:alt" content="Nano Collective Logo" />
      </Head>
      <div className="min-h-screen bg-background font-sans">
        <main>
          <SectionReveal>
            <Hero />
          </SectionReveal>
          <SectionReveal>
            <ProofBar stats={orgStats} />
          </SectionReveal>
          <SectionReveal>
            <Products nanocoderVersion={nanocoderVersion} />
          </SectionReveal>
          <SectionReveal>
            <FeaturedPackages />
          </SectionReveal>
          <SectionReveal>
            <Mission />
          </SectionReveal>
          <SectionReveal>
            <Sponsors />
          </SectionReveal>
          <SectionReveal>
            <LatestDiscussions discussions={discussions} />
          </SectionReveal>
          <SectionReveal>
            <CommunityCTA />
          </SectionReveal>
        </main>
        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Add authorization if token is available
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Fetch discussions (paginated: GitHub returns max 100 per page)
  let discussions: Discussion[] = [];
  try {
    for (let page = 1; page <= 10; page++) {
      const discussionsResponse = await fetch(
        `https://api.github.com/repos/Nano-Collective/organisation/discussions?per_page=100&page=${page}`,
        { headers },
      );

      if (!discussionsResponse.ok) {
        console.error(
          "Failed to fetch discussions (possibly rate limited or REST API not supported):",
          discussionsResponse.statusText,
        );
        break;
      }

      const batch = await discussionsResponse.json();
      if (!Array.isArray(batch) || batch.length === 0) break;
      discussions.push(...batch);
      if (batch.length < 100) break;
    }

    // Sort by newest first
    discussions.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  } catch (error) {
    console.error("Error fetching discussions:", error);
  }

  // Fallback to mock discussions if the API fails (e.g. rate limit, or no GraphQL)
  if (discussions.length === 0) {
    discussions = [
      {
        id: 1,
        number: 1,
        title: "Welcome to Nano Collective!",
        html_url:
          "https://github.com/Nano-Collective/organisation/discussions/1",
        created_at: new Date().toISOString(),
        comments: 12,
        user: {
          login: "nanocoder",
          avatar_url: "https://github.com/nanocoder.png",
        },
        category: { name: "Announcements", emoji: "📢", slug: "announcements" },
        labels: [{ id: 1, name: "official", color: "164efe" }],
      },
      {
        id: 2,
        number: 2,
        title: "How to run local LLMs with Nanocoder?",
        html_url:
          "https://github.com/Nano-Collective/organisation/discussions/2",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        comments: 8,
        user: {
          login: "developer",
          avatar_url: "https://github.com/github.png",
        },
        category: { name: "Q&A", emoji: "❓", slug: "q-a" },
        labels: [{ id: 2, name: "help wanted", color: "00ff00" }],
      },
      {
        id: 3,
        number: 3,
        title: "Feature Request: Real-time collaborative editing",
        html_url:
          "https://github.com/Nano-Collective/organisation/discussions/3",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        comments: 24,
        user: {
          login: "community_member",
          avatar_url: "https://github.com/community.png",
        },
        category: { name: "Ideas", emoji: "💡", slug: "ideas" },
        labels: [{ id: 3, name: "enhancement", color: "ff00ff" }],
      },
    ];
  }

  // Fetch org stats
  const orgStats: OrgStatsData = {
    stars: 0,
    contributors: 0,
    pullRequests: 0,
    discordMembers: 0,
    redditSubscribers: 0,
    lastUpdated: new Date().toISOString(),
    error: null,
  };

  // Fetch Discord member count via invite API
  try {
    const discordRes = await fetch(
      "https://discord.com/api/invites/ktPDV6rekE?with_counts=true",
    );
    if (discordRes.ok) {
      const data = await discordRes.json();
      orgStats.discordMembers = data.approximate_member_count || 0;
    }
  } catch (error) {
    console.error("Error fetching Discord stats:", error);
  }

  // Fetch Reddit subscriber count (folded into the Community metric)
  orgStats.redditSubscribers = await fetchRedditSubscribers("nanocoder");
  const uniqueContributors = new Set<string>();

  try {
    // Fetch all repositories in organization
    let page = 1;
    let repos: Array<{
      stargazers_count: number;
      name: string;
    }> = [];

    while (true) {
      const reposResponse = await fetch(
        `https://api.github.com/orgs/Nano-Collective/repos?type=public&per_page=100&page=${page}`,
        { headers },
      );

      if (!reposResponse.ok) {
        console.error("Failed to fetch repos:", reposResponse.statusText);
        orgStats.error = "Failed to fetch repository data";
        break;
      }

      const pageRepos = await reposResponse.json();
      if (pageRepos.length === 0) break;

      repos = repos.concat(pageRepos);
      page++;
    }

    // Aggregate stats
    for (const repo of repos) {
      orgStats.stars += repo.stargazers_count;

      // Fetch detailed stats for each repo (PRs, contributors)
      try {
        // Fetch PR count
        const prResponse = await fetch(
          `https://api.github.com/repos/Nano-Collective/${repo.name}/pulls?state=all&per_page=1`,
          { headers },
        );

        if (prResponse.ok) {
          const prLink = prResponse.headers.get("Link");
          if (prLink) {
            const match = prLink.match(/page=(\d+)>; rel="last"/);
            if (match) {
              orgStats.pullRequests += parseInt(match[1], 10);
            }
          } else {
            const prs = await prResponse.json();
            if (Array.isArray(prs)) {
              orgStats.pullRequests += prs.length;
            }
          }
        }

        // Fetch contributors to track unique contributors
        const contributorsResponse = await fetch(
          `https://api.github.com/repos/Nano-Collective/${repo.name}/contributors?per_page=100`,
          { headers },
        );

        if (contributorsResponse.ok) {
          const contributors = await contributorsResponse.json();
          if (Array.isArray(contributors)) {
            for (const contributor of contributors) {
              if (contributor.login) {
                uniqueContributors.add(contributor.login);
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching stats for repo ${repo.name}:`, error);
        // Continue with next repo even if one fails
      }
    }

    orgStats.contributors = uniqueContributors.size;
    orgStats.lastUpdated = new Date().toISOString();
  } catch (error) {
    console.error("Error fetching org stats:", error);
    orgStats.error = "Unable to load community statistics";
  }

  // Fetch Nanocoder version from npm
  let nanocoderVersion = "1.0.0";
  try {
    const npmRes = await fetch(
      "https://registry.npmjs.org/@nanocollective/nanocoder/latest",
    );
    if (npmRes.ok) {
      const data = await npmRes.json();
      nanocoderVersion = data.version || "1.0.0";
    }
  } catch (error) {
    console.error("Error fetching nanocoder version:", error);
  }

  return {
    props: {
      discussions,
      orgStats,
      nanocoderVersion,
    },
  };
};
