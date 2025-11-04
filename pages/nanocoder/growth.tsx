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

interface GrowthPageProps {
  downloadData: DownloadData[];
  releases: Release[];
  totalDownloads: number;
  lastUpdated: string;
}

export default function NanocoderGrowth({
  downloadData,
  releases,
  lastUpdated,
}: GrowthPageProps) {
  const [timePeriod, setTimePeriod] = useState<string>("last-30-days");

  // Filter data based on selected time period
  const filteredData = useMemo(() => {
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
        return downloadData;
    }

    return downloadData.filter((d) => new Date(d.date) >= startDate);
  }, [downloadData, timePeriod]);

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
    if (timePeriod === "all-time") return releases;

    const startDate =
      filteredData.length > 0 ? new Date(filteredData[0].date) : new Date();
    return releases.filter((r) => new Date(r.date) >= startDate);
  }, [releases, filteredData, timePeriod]);

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

  return (
    <>
      <Head>
        <title>Nanocoder Growth Tracker | Nano Collective</title>
        <meta
          name="description"
          content="Track Nanocoder's growth metrics, download statistics, and release impact."
        />
      </Head>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-5 lg:px-16 py-16 max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Nanocoder Growth Tracker
                </h1>
                <p className="text-lg text-muted-foreground">
                  Monitoring NPM downloads and release impact for{" "}
                  <a
                    href="https://github.com/Nano-Collective/nanocoder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Nanocoder
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

              {/* Time Period Selector */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Time Period
                </label>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-full lg:w-[200px]">
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
  const CURRENT_PACKAGE = "@nanocollective/nanocoder";
  const OLD_PACKAGE = "@motesoftware/nanocoder";
  const GITHUB_REPO = "Nano-Collective/nanocoder";

  try {
    // Fetch NPM download statistics for current package
    const npmResponse = await fetch(
      `https://api.npmjs.org/downloads/range/2025-08-01:${
        new Date().toISOString().split("T")[0]
      }/${CURRENT_PACKAGE}`
    );

    if (!npmResponse.ok) {
      throw new Error(
        `NPM API error for ${CURRENT_PACKAGE}: ${npmResponse.status}`
      );
    }

    const npmData = (await npmResponse.json()) as {
      downloads: Array<{ day: string; downloads: number }>;
    };

    // Fetch NPM download statistics for old deprecated package
    const oldNpmResponse = await fetch(
      `https://api.npmjs.org/downloads/range/2025-08-01:${
        new Date().toISOString().split("T")[0]
      }/${OLD_PACKAGE}`
    );

    let oldNpmData: { downloads: Array<{ day: string; downloads: number }> } = {
      downloads: [],
    };
    if (oldNpmResponse.ok) {
      oldNpmData = (await oldNpmResponse.json()) as {
        downloads: Array<{ day: string; downloads: number }>;
      };
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
      `https://api.github.com/repos/${GITHUB_REPO}/releases`,
      {
        headers: process.env.GH_TOKEN
          ? { Authorization: `token ${process.env.GH_TOKEN}` }
          : {},
      }
    );

    if (!githubResponse.ok) {
      throw new Error(`GitHub API error: ${githubResponse.status}`);
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

    return {
      props: {
        downloadData,
        releases,
        totalDownloads,
        lastUpdated: new Date().toISOString(),
      },
      revalidate: false, // Static export, no ISR
    };
  } catch (error) {
    console.error("Error fetching growth data:", error);

    // Return empty data on error
    return {
      props: {
        downloadData: [],
        releases: [],
        totalDownloads: 0,
        lastUpdated: new Date().toISOString(),
      },
    };
  }
};
