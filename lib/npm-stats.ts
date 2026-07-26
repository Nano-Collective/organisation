export interface NpmPackageConfig {
  packageName: string;
  displayName: string;
  oldPackage?: string | null;
}

export const NC_PACKAGES: NpmPackageConfig[] = [
  {
    packageName: "@nanocollective/nanocoder",
    displayName: "Nanocoder",
    oldPackage: "@motesoftware/nanocoder",
  },
  {
    packageName: "@nanocollective/nanotune",
    displayName: "Nanotune",
  },
  {
    packageName: "@nanocollective/sentinel",
    displayName: "Sentinel",
  },
  {
    packageName: "@nanocollective/get-md",
    displayName: "get-md",
  },
  {
    packageName: "@nanocollective/prompt-scrub",
    displayName: "prompt-scrub",
  },
  {
    packageName: "@nanocollective/json-up",
    displayName: "json-up",
  },
];

const RANGE_START = "2025-08-01";

async function sumDownloads(packageName: string): Promise<number> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(
      `https://api.npmjs.org/downloads/range/${RANGE_START}:${today}/${packageName}`,
    );
    if (!response.ok) return 0;
    const data = (await response.json()) as {
      downloads: Array<{ day: string; downloads: number }>;
    };
    return data.downloads.reduce((sum, d) => sum + d.downloads, 0);
  } catch (error) {
    console.error(`Error fetching downloads for ${packageName}:`, error);
    return 0;
  }
}

export async function fetchTotalDownloads(
  packages: NpmPackageConfig[] = NC_PACKAGES,
): Promise<number> {
  let total = 0;
  for (const pkg of packages) {
    total += await sumDownloads(pkg.packageName);
    if (pkg.oldPackage) {
      total += await sumDownloads(pkg.oldPackage);
    }
  }
  return total;
}
