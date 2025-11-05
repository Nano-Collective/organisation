import { GetStaticProps } from "next";
import Head from "next/head";
import { useState, useMemo } from "react";
import { GrowthChart } from "@/components/GrowthChart";
import { GrowthMetrics } from "@/components/GrowthMetrics";
import { EngagementAlert } from "@/components/EngagementAlert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  lastUpdated: string;
}

export default function Growth({ packages, lastUpdated }: GrowthPageProps) {
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
        new Map(allReleases.map((r) => [r.tag, r])).values()
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
      case "all-time":
      default:
        return currentPackageData.downloadData;
    }

    return currentPackageData.downloadData.filter(
      (d) => new Date(d.date) >= startDate
    );
  }, [currentPackageData, timePeriod]);

  // Calculate rolling averages
  const calculateRollingAverage = (
    data: DownloadData[],
    windowSize: number
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
  const cumulativeData = filteredData.reduce((acc, curr, index) => {
    const cumulative =
      index === 0 ? curr.downloads : acc[index - 1].cumulative + curr.downloads;
    acc.push({ date: curr.date, cumulative });
    return acc;
  }, [] as { date: string; cumulative: number }[]);

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
      (r) => new Date(r.date) >= startDate
    );
  }, [currentPackageData, filteredData, timePeriod]);

  // Check if engagement is needed (7-day is 20%+ below 30-day average)
  const needsEngagement = (() => {
    if (sevenDayAvg.length < 1 || thirtyDayAvg.length < 1) return false;

    const currentSevenDay = sevenDayAvg[sevenDayAvg.length - 1].average;
    const currentThirtyDay = thirtyDayAvg[thirtyDayAvg.length - 1].average;

    // Alert if 7-day average is 20% or more below 30-day average
    const percentageBelow =
      ((currentThirtyDay - currentSevenDay) / currentThirtyDay) * 100;
    return percentageBelow >= 20;
  })();

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

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-5 lg:px-16 py-16 max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Package Growth Tracker
                </h1>
                <p className="text-lg text-muted-foreground">
                  Monitoring NPM downloads and release impact for{" "}
                  <a
                    href={`https://github.com/${currentPackageData.githubRepo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {currentPackageData.displayName}
                  </a>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Last updated: </strong>
                  {new Date(lastUpdated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Package and Time Period Selectors */}
              <div className="flex flex-col gap-4 mt-2">
                {/* Package Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Package
                  </label>
                  <Select
                    value={selectedPackage}
                    onValueChange={setSelectedPackage}
                  >
                    <SelectTrigger className="w-full lg:w-[250px]">
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All Packages</SelectItem>
                      {packages.map((pkg) => (
                        <SelectItem
                          key={pkg.packageName}
                          value={pkg.packageName}
                        >
                          {pkg.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Period Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Time Period
                  </label>
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger className="w-full lg:w-[250px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                      <SelectItem value="last-60-days">Last 60 Days</SelectItem>
                      <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                      <SelectItem value="all-time">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Alert */}
          {sevenDayAvg.length > 0 && thirtyDayAvg.length > 0 && (
            <EngagementAlert
              sevenDayAvg={sevenDayAvg[sevenDayAvg.length - 1].average}
              thirtyDayAvg={thirtyDayAvg[thirtyDayAvg.length - 1].average}
              needsEngagement={needsEngagement}
            />
          )}

          {/* Key Metrics */}
          <GrowthMetrics
            totalDownloads={periodTotalDownloads}
            currentSevenDay={sevenDayAvg[sevenDayAvg.length - 1]?.average || 0}
            currentThirtyDay={
              thirtyDayAvg[thirtyDayAvg.length - 1]?.average || 0
            }
            trend={currentTrend}
          />

          {/* Chart */}
          <div className="mt-12">
            <GrowthChart
              downloadData={filteredData}
              sevenDayAvg={sevenDayAvg}
              thirtyDayAvg={thirtyDayAvg}
              cumulativeData={cumulativeData}
              releases={filteredReleases}
            />
          </div>
        </div>
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
      packageName: "@nanocollective/get-md",
      displayName: "get-md",
      githubRepo: "Nano-Collective/get-md",
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
        }/${config.packageName}`
      );

      if (!npmResponse.ok) {
        console.error(
          `NPM API error for ${config.packageName}: ${npmResponse.status}`
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
          }/${config.oldPackage}`
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
        0
      );

      // Fetch GitHub releases
      const githubResponse = await fetch(
        `https://api.github.com/repos/${config.githubRepo}/releases`,
        {
          headers: process.env.GH_TOKEN
            ? { Authorization: `token ${process.env.GH_TOKEN}` }
            : {},
        }
      );

      if (!githubResponse.ok) {
        console.error(
          `GitHub API error for ${config.githubRepo}: ${githubResponse.status}`
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
          tag: release.tag_name,
          date: release.published_at.split("T")[0],
          name: release.name || release.tag_name,
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

  return {
    props: {
      packages,
      lastUpdated: new Date().toISOString(),
    },
    revalidate: false, // Static export, no ISR
  };
};
