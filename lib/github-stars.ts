// GitHub star history, fetched at build time.
//
// Uses the privacy-safe star history endpoint GitHub shipped on 2026-09-04:
//   GET /repos/{owner}/{repo}/stargazers/history
// It returns stars grouped by calendar week (most recent first), each entry
// carrying a Unix timestamp for the week start, the week's net star count, and
// a `days` array of per-day counts beginning on Sunday. Summing every week's
// total reproduces `stargazers_count` exactly, so the history is complete and
// net of un-stars — no separate repo call is needed for the headline figure.
//
// Unlike the old /stargazers listing this needs no special Accept header and no
// token for public repos (an authenticated build just gets a bigger rate-limit
// budget), and the whole history of any repo fits in at most 100 pages.
//
// Every failure path degrades to an empty series so the site still builds.

const API_VERSION = "2026-03-10";
const PER_PAGE = 30;
const MAX_PAGES = 100; // the endpoint's own page ceiling

export interface StarPoint {
  date: string; // YYYY-MM-DD
  stars: number; // net new stars that day
}

/**
 * Daily counts stored as a dense array rather than one dated object per day.
 * Six repos' full histories is a few thousand days, and the labelled form blows
 * past Next's 128 kB page-data budget on its own.
 */
export interface StarHistory {
  startDate: string; // the day `daily[0]` covers
  daily: number[]; // one entry per day, no gaps
}

export interface RepoStarHistory {
  repo: string; // GitHub "owner/name" slug
  history: StarHistory;
  totalStars: number;
}

const DAY_MS = 86_400_000;

/** Expands the compact form back into dated points, ascending by date. */
export function expandStarHistory(history: StarHistory): StarPoint[] {
  const start = Date.parse(`${history.startDate}T00:00:00Z`);
  return history.daily.map((stars, index) => ({
    date: new Date(start + index * DAY_MS).toISOString().split("T")[0],
    stars,
  }));
}

interface StarHistoryWeek {
  week: number; // Unix seconds, week start (Sunday, UTC)
  total: number;
  days: number[]; // 7 entries, Sunday first
}

function githubHeaders(): HeadersInit {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": API_VERSION,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function toDateString(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString().split("T")[0];
}

/**
 * Fetches the full daily star history for a repository.
 *
 * @param repo - GitHub "owner/name" slug, e.g. "Nano-Collective/nanocoder".
 */
export async function fetchStarHistory(repo: string): Promise<RepoStarHistory> {
  const empty: RepoStarHistory = {
    repo,
    history: { startDate: "", daily: [] },
    totalStars: 0,
  };
  const weeks: StarHistoryWeek[] = [];

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await fetch(
        `https://api.github.com/repos/${repo}/stargazers/history?per_page=${PER_PAGE}&page=${page}`,
        { headers: githubHeaders() },
      );

      if (!response.ok) {
        console.error(
          `GitHub star history error for ${repo}: ${response.status}`,
        );
        // Keep whatever pages already landed rather than losing the series.
        break;
      }

      const batch = (await response.json()) as StarHistoryWeek[];
      if (!Array.isArray(batch) || batch.length === 0) break;

      weeks.push(...batch);
      if (batch.length < PER_PAGE) break;
    }
  } catch (error) {
    console.error(`Error fetching star history for ${repo}:`, error);
    return empty;
  }

  if (weeks.length === 0) return empty;

  // Flatten weeks into a dense day-by-day array, dropping days that have not
  // happened yet (the current week comes padded out to seven entries).
  const today = new Date().toISOString().split("T")[0];
  const starsByDate: Record<string, number> = {};

  weeks.forEach((w) => {
    const days = Array.isArray(w.days) ? w.days : [];
    days.forEach((count, index) => {
      const date = toDateString(w.week + index * 86400);
      if (date > today) return;
      starsByDate[date] = (starsByDate[date] || 0) + count;
    });
  });

  const sortedDates = Object.keys(starsByDate).sort((a, b) =>
    a.localeCompare(b),
  );
  if (sortedDates.length === 0) return empty;

  const startDate = sortedDates[0];
  const endDate = sortedDates[sortedDates.length - 1];
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const dayCount =
    Math.round((Date.parse(`${endDate}T00:00:00Z`) - start) / DAY_MS) + 1;

  const daily = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(start + index * DAY_MS).toISOString().split("T")[0];
    return starsByDate[date] ?? 0;
  });

  return {
    repo,
    history: { startDate, daily },
    totalStars: daily.reduce((sum, count) => sum + count, 0),
  };
}
