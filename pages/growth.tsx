import type { GetStaticProps } from "next";
import Head from "next/head";
import { useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { GrowthChart } from "@/components/GrowthChart";
import { GrowthMetrics } from "@/components/GrowthMetrics";
import { TrafficSection } from "@/components/TrafficSection";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";
import { fetchTraffic, type SiteTraffic } from "@/lib/cloudflare-stats";

interface DownloadData {
  date: string;
  downloads: number;
}

interface Release {
  tag: string;
  date: string;
  name: string;
}

interface PackageData {
  packageName: string;
  displayName: string;
  githubRepo: string;
  downloadData: DownloadData[];
  releases: Release[];
  totalDownloads: number;
}

interface GrowthPageProps {
  packages: PackageData[];
  traffic: SiteTraffic[];
  lastUpdated: string;
}

export default function Growth({
  packages,
  traffic,
  lastUpdated,
}: GrowthPageProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("__all__");
  const [timePeriod, setTimePeriod] = useState<string>("last-30-days");

  const currentPackageData = useMemo(() => {
    if (selectedPackage === "__all__") {
      // Aggregate all packages
      const allDownloadsByDate: Record<string, number> = {};
      const allReleases: Release[] = [];
      let totalDownloads = 0;

      packages.forEach((pkg) => {
        // Combine downloads
        pkg.downloadData.forEach((d) => {
          allDownloadsByDate[d.date] =
            (allDownloadsByDate[d.date] || 0) + d.downloads;
        });

        // Combine releases
        allReleases.push(...pkg.releases);

        // Sum total downloads
        totalDownloads += pkg.totalDownloads;
      });

      // Convert to array and sort by date
      const downloadData: DownloadData[] = Object.entries(allDownloadsByDate)
        .map(([date, downloads]) => ({ date, downloads }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Sort releases by date and remove duplicates by tag
      const uniqueReleases = Array.from(
        new Map(allReleases.map((r) => [r.tag, r])).values(),
      ).sort((a, b) => a.date.localeCompare(b.date));

      return {
        packageName: "__all__",
        displayName: "All Packages",
        githubRepo: "Nano-Collective",
        downloadData,
        releases: uniqueReleases,
        totalDownloads,
      };
    }

    return packages.find((pkg) => pkg.packageName === selectedPackage);
  }, [packages, selectedPackage]);

  // Filter data based on selected time period
  const filteredData = useMemo(() => {
    if (!currentPackageData) return [];

    const now = new Date();
    // Cut off today and yesterday (NPM downloads are incomplete for these days)
    // Also cut off day before yesterday since data is built at midnight
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 2);
    cutoff.setHours(0, 0, 0, 0);

    const cutoffDate = cutoff;

    let startDate: Date;

    switch (timePeriod) {
      case "last-30-days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "last-60-days":
        startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        break;
      case "last-90-days":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        return currentPackageData.downloadData.filter(
          (d) => new Date(d.date) < cutoffDate,
        );
    }

    return currentPackageData.downloadData.filter(
      (d) => new Date(d.date) >= startDate && new Date(d.date) < cutoffDate,
    );
  }, [currentPackageData, timePeriod]);

  // Calculate rolling averages
  const calculateRollingAverage = (
    data: DownloadData[],
    windowSize: number,
  ) => {
    return data.map((_, index) => {
      const start = Math.max(0, index - windowSize + 1);
      const window = data.slice(start, index + 1);
      const average =
        window.reduce((sum, d) => sum + d.downloads, 0) / window.length;
      return {
        date: data[index].date,
        average: Math.round(average),
      };
    });
  };

  const sevenDayAvg = calculateRollingAverage(filteredData, 7);
  const thirtyDayAvg = calculateRollingAverage(filteredData, 30);

  // Calculate cumulative downloads for filtered data
  const cumulativeData = filteredData.reduce(
    (acc, curr, index) => {
      const cumulative =
        index === 0
          ? curr.downloads
          : acc[index - 1].cumulative + curr.downloads;
      acc.push({ date: curr.date, cumulative });
      return acc;
    },
    [] as { date: string; cumulative: number }[],
  );

  // Calculate total downloads for the filtered period
  const periodTotalDownloads = useMemo(() => {
    return filteredData.reduce((sum, d) => sum + d.downloads, 0);
  }, [filteredData]);

  // Filter releases to match time period
  const filteredReleases = useMemo(() => {
    if (!currentPackageData) return [];
    if (timePeriod === "all-time") return currentPackageData.releases;

    const startDate =
      filteredData.length > 0 ? new Date(filteredData[0].date) : new Date();
    return currentPackageData.releases.filter(
      (r) => new Date(r.date) >= startDate,
    );
  }, [currentPackageData, filteredData, timePeriod]);

  const currentTrend =
    sevenDayAvg.length > 7
      ? sevenDayAvg[sevenDayAvg.length - 1].average >
        sevenDayAvg[sevenDayAvg.length - 7].average
        ? "up"
        : "down"
      : "neutral";

  if (!currentPackageData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">
          No package data available
        </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Package Growth Tracker | Nano Collective</title>
        <meta
          name="description"
          content="Track Nano Collective package growth metrics, download statistics, and release impact."
        />
      </Head>

      <div className="min-h-screen bg-background font-sans flex flex-col">
        {/* Hero */}
        <SectionReveal>
          <section className="relative pt-12 pb-12 sm:pb-20 px-4 md:px-6 container mx-auto border-b border-foreground/20">
            <StaggerContainer className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="space-y-4 sm:space-y-8 max-w-4xl flex-1">
                <StaggerItem>
                  <div className="flex items-center gap-2 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-widest border-b border-foreground/20 pb-2 max-w-[200px]">
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                      &gt;
                    </span>
                    Metrics
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <h1 className="text-3xl sm:text-5xl lg:text-[4rem] leading-[1.05] font-bold tracking-tight text-foreground break-words">
                    Growth Tracker
                  </h1>
                </StaggerItem>

                <StaggerItem>
                  <p className="text-xs sm:text-lg lg:text-xl text-foreground/70 leading-relaxed max-w-[800px]">
                    Tracking NPM downloads for{" "}
                    <a
                      href={`https://github.com/${currentPackageData.githubRepo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0000EE] dark:text-[#A1A1AA] hover:underline font-semibold"
                    >
                      {currentPackageData.displayName}
                    </a>
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <p className="text-xs sm:text-sm text-foreground/50">
                    Last updated:{" "}
                    {new Date(lastUpdated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </StaggerItem>
              </div>

              {/* Package and Time Period Selectors */}
              <StaggerItem className="flex flex-col sm:flex-row gap-4 lg:w-auto mt-8 lg:mt-0 pb-2">
                {/* Package Selector */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="package-select"
                    className="text-xs font-semibold uppercase tracking-widest text-foreground/70"
                  >
                    Package
                  </label>
                  <select
                    id="package-select"
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="border border-foreground/20 bg-background text-foreground text-sm px-4 py-2 min-w-[200px] lg:w-[250px] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-foreground hover:bg-muted transition-colors"
                  >
                    <option value="__all__">All Packages</option>
                    {packages.map((pkg) => (
                      <option key={pkg.packageName} value={pkg.packageName}>
                        {pkg.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Period Selector */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="time-period-select"
                    className="text-xs font-semibold uppercase tracking-widest text-foreground/70"
                  >
                    Time Period
                  </label>
                  <select
                    id="time-period-select"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="border border-foreground/20 bg-background text-foreground text-sm px-4 py-2 min-w-[200px] lg:w-[250px] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-foreground hover:bg-muted transition-colors"
                  >
                    <option value="last-30-days">Last 30 Days</option>
                    <option value="last-60-days">Last 60 Days</option>
                    <option value="last-90-days">Last 90 Days</option>
                    <option value="all-time">All Time</option>
                  </select>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </section>
        </SectionReveal>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-24">
          <StaggerContainer>
            {/* Key Metrics */}
            <StaggerItem>
              <GrowthMetrics
                totalDownloads={periodTotalDownloads}
                currentSevenDay={
                  sevenDayAvg[sevenDayAvg.length - 1]?.average || 0
                }
                currentThirtyDay={
                  thirtyDayAvg[thirtyDayAvg.length - 1]?.average || 0
                }
                trend={currentTrend}
              />
            </StaggerItem>

            {/* Chart */}
            <StaggerItem>
              <div className="mt-12 border border-foreground/20 p-4 sm:p-8 bg-background">
                <h2 className="text-xl font-bold tracking-tight mb-8">
                  Download Trajectory
                </h2>
                <GrowthChart
                  downloadData={filteredData}
                  sevenDayAvg={sevenDayAvg}
                  thirtyDayAvg={thirtyDayAvg}
                  cumulativeData={cumulativeData}
                  releases={filteredReleases}
                />
              </div>
            </StaggerItem>

            {/* Website Traffic */}
            <StaggerItem>
              <TrafficSection traffic={traffic} />
            </StaggerItem>
          </StaggerContainer>
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<GrowthPageProps> = async () => {
  // Define packages to track
  const packagesConfig = [
    {
      packageName: "@nanocollective/nanocoder",
      displayName: "Nanocoder",
      githubRepo: "Nano-Collective/nanocoder",
      oldPackage: "@motesoftware/nanocoder",
    },
    {
      packageName: "@nanocollective/nanotune",
      displayName: "Nanotune",
      githubRepo: "Nano-Collective/nanotune",
      oldPackage: null,
    },
    {
      packageName: "@nanocollective/sentinel",
      displayName: "Sentinel",
      githubRepo: "Nano-Collective/sentinel",
      oldPackage: null,
    },
    {
      packageName: "@nanocollective/get-md",
      displayName: "get-md",
      githubRepo: "Nano-Collective/get-md",
      oldPackage: null,
    },
    {
      packageName: "@nanocollective/prompt-scrub",
      displayName: "prompt-scrub",
      githubRepo: "Nano-Collective/prompt-scrubber",
      oldPackage: null,
    },
    {
      packageName: "@nanocollective/json-up",
      displayName: "json-up",
      githubRepo: "Nano-Collective/json-up",
      oldPackage: null,
    },
  ];

  const packages: PackageData[] = [];

  for (const config of packagesConfig) {
    try {
      // Fetch NPM download statistics for current package
      const npmResponse = await fetch(
        `https://api.npmjs.org/downloads/range/2025-08-01:${
          new Date().toISOString().split("T")[0]
        }/${config.packageName}`,
      );

      if (!npmResponse.ok) {
        console.error(
          `NPM API error for ${config.packageName}: ${npmResponse.status}`,
        );
        continue;
      }

      const npmData = (await npmResponse.json()) as {
        downloads: Array<{ day: string; downloads: number }>;
      };

      // Fetch old package downloads if applicable
      let oldNpmData: {
        downloads: Array<{ day: string; downloads: number }>;
      } = { downloads: [] };

      if (config.oldPackage) {
        const oldNpmResponse = await fetch(
          `https://api.npmjs.org/downloads/range/2025-08-01:${
            new Date().toISOString().split("T")[0]
          }/${config.oldPackage}`,
        );

        if (oldNpmResponse.ok) {
          oldNpmData = (await oldNpmResponse.json()) as {
            downloads: Array<{ day: string; downloads: number }>;
          };
        }
      }

      // Combine downloads from both packages by date
      const downloadsByDate: Record<string, number> = {};

      // Add current package downloads
      npmData.downloads.forEach((d) => {
        downloadsByDate[d.day] = (downloadsByDate[d.day] || 0) + d.downloads;
      });

      // Add old package downloads
      oldNpmData.downloads.forEach((d) => {
        downloadsByDate[d.day] = (downloadsByDate[d.day] || 0) + d.downloads;
      });

      // Convert to array and sort by date
      const downloadData: DownloadData[] = Object.entries(downloadsByDate)
        .map(([date, downloads]) => ({ date, downloads }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const totalDownloads = downloadData.reduce(
        (sum, d) => sum + d.downloads,
        0,
      );

      // Fetch GitHub releases
      const githubResponse = await fetch(
        `https://api.github.com/repos/${config.githubRepo}/releases`,
        {
          headers:
            process.env.GH_TOKEN || process.env.GITHUB_TOKEN
              ? {
                  Authorization: `token ${process.env.GH_TOKEN || process.env.GITHUB_TOKEN}`,
                }
              : {},
        },
      );

      if (!githubResponse.ok) {
        console.error(
          `GitHub API error for ${config.githubRepo}: ${githubResponse.status}`,
        );
        continue;
      }

      const githubData = (await githubResponse.json()) as Array<{
        tag_name: string;
        published_at: string;
        name: string | null;
      }>;

      const releases: Release[] = githubData
        .map((release) => ({
          tag: `${config.displayName} ${release.tag_name}`,
          date: release.published_at.split("T")[0],
          name: `${config.displayName} ${release.tag_name}`,
        }))
        .reverse(); // Oldest first

      packages.push({
        packageName: config.packageName,
        displayName: config.displayName,
        githubRepo: config.githubRepo,
        downloadData,
        releases,
        totalDownloads,
      });
    } catch (error) {
      console.error(`Error fetching data for ${config.packageName}:`, error);
    }
  }

  const traffic = await fetchTraffic();

  return {
    props: {
      packages,
      traffic,
      lastUpdated: new Date().toISOString(),
    },
    revalidate: false, // Static export, no ISR
  };
};
