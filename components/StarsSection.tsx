"use client";

import { ArrowDown, ArrowUp, Minus, Star, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { expandStarHistory, type StarHistory } from "@/lib/github-stars";

export interface StarPackage {
  packageName: string;
  displayName: string;
  githubRepo: string;
  starHistory: StarHistory;
  totalStars: number;
  seriesSlot: number; // 1-8, fixed per product so colours never repaint
}

interface StarsSectionProps {
  packages: StarPackage[];
  selectedPackage: string;
}

type ChartView = "cumulative" | "daily";

// Own window control, matching the traffic section. `days: null` is all time.
const PERIODS = [
  { value: "7", label: "Last 7 Days", days: 7 },
  { value: "30", label: "Last 30 Days", days: 30 },
  { value: "90", label: "Last 90 Days", days: 90 },
  { value: "365", label: "Last 12 Months", days: 365 },
  { value: "all", label: "All Time", days: null },
] as const;

const TOTAL_KEY = "__total__";

// Slots come from the validated categorical palette in styles/globals.css;
// the slot belongs to the product, not to its position in the chart.
const seriesColor = (slot: number) => `var(--series-${((slot - 1) % 8) + 1})`;

const SPARK_WIDTH = 120;
const SPARK_HEIGHT = 32;

// Own-scale cumulative shape for one product. The shared chart shows relative
// magnitude honestly, which flattens everything below the largest repo — this
// is where each product's own trajectory stays readable.
function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * SPARK_WIDTH;
      const y = SPARK_HEIGHT - ((value - min) / span) * (SPARK_HEIGHT - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      width={SPARK_WIDTH}
      height={SPARK_HEIGHT}
      viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`}
      role="presentation"
      aria-hidden="true"
      className="overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StarsSection({ packages, selectedPackage }: StarsSectionProps) {
  const [view, setView] = useState<ChartView>("cumulative");
  const [period, setPeriod] = useState<string>("30");
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const selected = useMemo(
    () =>
      selectedPackage === "__all__"
        ? packages
        : packages.filter((p) => p.packageName === selectedPackage),
    [packages, selectedPackage],
  );

  const showTotal = selected.length > 1;

  // Full date axis across every selected product, plus each product's all-time
  // cumulative count on each of those days (carried forward on quiet days).
  const { dates, cumulativeByPackage, dailyByPackage } = useMemo(() => {
    const dateSet = new Set<string>();
    const expanded = selected.map((pkg) => ({
      pkg,
      points: expandStarHistory(pkg.starHistory),
    }));
    expanded.forEach(({ points }) => {
      points.forEach((d) => {
        dateSet.add(d.date);
      });
    });
    const dates = Array.from(dateSet).sort((a, b) => a.localeCompare(b));

    const cumulativeByPackage: Record<string, Record<string, number>> = {};
    const dailyByPackage: Record<string, Record<string, number>> = {};

    expanded.forEach(({ pkg, points }) => {
      const byDate: Record<string, number> = {};
      points.forEach((d) => {
        byDate[d.date] = d.stars;
      });

      const cumulative: Record<string, number> = {};
      let running = 0;
      dates.forEach((date) => {
        running += byDate[date] ?? 0;
        cumulative[date] = running;
      });

      cumulativeByPackage[pkg.packageName] = cumulative;
      dailyByPackage[pkg.packageName] = byDate;
    });

    return { dates, cumulativeByPackage, dailyByPackage };
  }, [selected]);

  // Trim the axis to the selected period. Cumulative values stay all-time, so
  // the chart opens at the real star count rather than at zero.
  const visibleDates = useMemo(() => {
    const days = PERIODS.find((p) => p.value === period)?.days ?? null;
    if (days === null) return dates;
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - days);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    return dates.filter((d) => d >= cutoffStr);
  }, [dates, period]);

  const chartData = useMemo(() => {
    const source = view === "cumulative" ? cumulativeByPackage : dailyByPackage;
    return visibleDates.map((date) => {
      const row: Record<string, string | number> = { date };
      let total = 0;
      selected.forEach((pkg) => {
        const value = source[pkg.packageName]?.[date] ?? 0;
        row[pkg.packageName] = value;
        total += value;
      });
      row[TOTAL_KEY] = total;
      return row;
    });
  }, [visibleDates, selected, cumulativeByPackage, dailyByPackage, view]);

  // Per-product figures for the period, and the all-time total.
  const breakdown = useMemo(() => {
    const first = visibleDates[0];
    return selected
      .map((pkg) => {
        const cumulative = cumulativeByPackage[pkg.packageName] ?? {};
        const daily = dailyByPackage[pkg.packageName] ?? {};
        const periodStars = visibleDates.reduce(
          (sum, date) => sum + (daily[date] ?? 0),
          0,
        );
        const startingStars = first ? (cumulative[first] ?? 0) : 0;
        const before = startingStars - (daily[first] ?? 0);
        return {
          ...pkg,
          periodStars,
          // Growth relative to where the product started the period.
          growthPercent: before > 0 ? (periodStars / before) * 100 : null,
          // Own-scale shape, so a small product's trajectory stays readable
          // next to one two orders of magnitude bigger.
          spark: visibleDates.map((date) => cumulative[date] ?? 0),
        };
      })
      .sort((a, b) => b.totalStars - a.totalStars);
  }, [selected, visibleDates, cumulativeByPackage, dailyByPackage]);

  const totalSpark = useMemo(
    () =>
      visibleDates.map((_, index) =>
        breakdown.reduce((sum, pkg) => sum + (pkg.spark[index] ?? 0), 0),
      ),
    [visibleDates, breakdown],
  );

  const totalStars = selected.reduce((sum, p) => sum + p.totalStars, 0);
  const periodStars = breakdown.reduce((sum, p) => sum + p.periodStars, 0);
  const avgPerDay = visibleDates.length ? periodStars / visibleDates.length : 0;

  // Last 7 days against the 7 before them.
  const trend = useMemo<"up" | "down" | "neutral">(() => {
    if (dates.length < 14) return "neutral";
    const tail = dates.slice(-14);
    const sumRange = (range: string[]) =>
      range.reduce(
        (sum, date) =>
          sum +
          selected.reduce(
            (s, pkg) => s + (dailyByPackage[pkg.packageName]?.[date] ?? 0),
            0,
          ),
        0,
      );
    const recent = sumRange(tail.slice(7));
    const previous = sumRange(tail.slice(0, 7));
    if (recent === previous) return "neutral";
    return recent > previous ? "up" : "down";
  }, [dates, selected, dailyByPackage]);

  const toggle = (key: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const nameFor = (key: string) =>
    key === TOTAL_KEY
      ? "All Products"
      : (selected.find((p) => p.packageName === key)?.displayName ?? key);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ dataKey: string; value: number | null; color: string }>;
    label?: string;
  }) => {
    if (!active || !payload?.length || !label) return null;
    const rows = [...payload]
      .filter((e) => e.value !== null && e.value !== undefined)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    return (
      <div className="bg-background border border-foreground/20 p-4 font-mono text-sm">
        <p className="font-bold mb-2">{formatDate(label)}</p>
        {rows.map((entry) => (
          <p key={entry.dataKey} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-0.5 shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {nameFor(entry.dataKey)}: {(entry.value ?? 0).toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    );
  };

  const trendIcon =
    trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const TrendIcon = trendIcon;
  const trendColor =
    trend === "up"
      ? "text-green-600 dark:text-green-400"
      : trend === "down"
        ? "text-red-600 dark:text-red-400"
        : "text-foreground";

  const periodLabel =
    PERIODS.find((p) => p.value === period)?.label ?? "Selected period";

  if (packages.length === 0 || dates.length === 0) {
    return null;
  }

  const legendItems = [
    ...(showTotal
      ? [{ key: TOTAL_KEY, label: "All Products", color: "var(--foreground)" }]
      : []),
    ...selected.map((pkg) => ({
      key: pkg.packageName,
      label: pkg.displayName,
      color: seriesColor(pkg.seriesSlot),
    })),
  ];

  return (
    <div className="chart-series mt-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 border-b border-foreground/20 pb-4 sm:pb-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-2">
            GitHub Stars
          </h2>
          <p className="text-sm text-foreground/70 font-mono">
            Star history across our repositories, via the GitHub star history
            API.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="stars-period-select"
              className="text-xs font-semibold uppercase tracking-widest text-foreground/70"
            >
              Time Period
            </label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger
                id="stars-period-select"
                className="w-full lg:w-[250px] rounded-none border-foreground/20"
              >
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
              View
            </span>
            <div className="flex border border-foreground/20">
              {(
                [
                  ["cumulative", "Cumulative"],
                  ["daily", "Daily"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setView(value)}
                  className={`px-4 py-2 text-sm font-mono transition-colors ${
                    view === value
                      ? "bg-foreground text-background"
                      : "bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Headline figures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/20 border border-foreground/20">
        <div className="bg-background p-6 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground/60 font-semibold">
              Total Stars
            </span>
            <Star className="h-4 w-4 text-foreground/50" />
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight">
            {totalStars.toLocaleString()}
          </div>
          <p className="text-xs text-foreground/50 font-mono">All time</p>
        </div>

        <div className="bg-background p-6 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground/60 font-semibold">
              New Stars
            </span>
            <TrendingUp className="h-4 w-4 text-foreground/50" />
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight">
            {periodStars.toLocaleString()}
          </div>
          <p className="text-xs text-foreground/50 font-mono">{periodLabel}</p>
        </div>

        <div className="bg-background p-6 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground/60 font-semibold">
              Avg Per Day
            </span>
            <Star className="h-4 w-4 text-foreground/50" />
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight">
            {avgPerDay.toLocaleString(undefined, {
              maximumFractionDigits: 1,
            })}
          </div>
          <p className="text-xs text-foreground/50 font-mono">Stars per day</p>
        </div>

        <div className="bg-background p-6 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground/60 font-semibold">
              Weekly Trend
            </span>
            <TrendIcon className={`h-4 w-4 ${trendColor}`} />
          </div>
          <div
            className={`font-mono text-2xl md:text-3xl font-bold tracking-tight ${trendColor}`}
          >
            {trend === "up"
              ? "Growing"
              : trend === "down"
                ? "Declining"
                : "Stable"}
          </div>
          <p className="text-xs text-foreground/50 font-mono">
            Last 7 days vs previous 7
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 border border-foreground/20 bg-background p-4 sm:p-8">
        <h3 className="text-xl font-bold tracking-tight mb-8">
          {view === "cumulative" ? "Star Trajectory" : "Stars Gained Per Day"}
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              minTickGap={50}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />

            {selected.map((pkg) => (
              <Line
                key={pkg.packageName}
                // Daily counts get straight segments — smoothing a spiky count
                // series overshoots below zero between points.
                type={view === "cumulative" ? "monotone" : "linear"}
                dataKey={pkg.packageName}
                stroke={seriesColor(pkg.seriesSlot)}
                strokeWidth={2}
                dot={false}
                name={pkg.displayName}
                hide={hidden.has(pkg.packageName)}
              />
            ))}

            {showTotal && (
              <Line
                type={view === "cumulative" ? "monotone" : "linear"}
                dataKey={TOTAL_KEY}
                stroke="var(--foreground)"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
                name="All Products"
                hide={hidden.has(TOTAL_KEY)}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        {legendItems.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 pt-5 font-mono text-sm">
            {legendItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggle(item.key)}
                className="flex items-center gap-2 cursor-pointer select-none bg-transparent border-0 p-0"
                style={{ opacity: hidden.has(item.key) ? 0.3 : 1 }}
              >
                <span
                  className="inline-block w-5 h-0.5"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Per-product breakdown — also the text relief for the chart colours */}
      <div className="mt-8 border border-foreground/20 overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <caption className="sr-only">
            GitHub stars per product, {periodLabel.toLowerCase()}
          </caption>
          <thead>
            <tr className="border-b border-foreground/20 text-left">
              <th className="p-4 font-semibold uppercase tracking-widest text-xs text-foreground/60">
                Product
              </th>
              <th className="p-4 font-semibold uppercase tracking-widest text-xs text-foreground/60">
                Shape ({periodLabel})
              </th>
              <th className="p-4 font-semibold uppercase tracking-widest text-xs text-foreground/60 text-right">
                Total Stars
              </th>
              <th className="p-4 font-semibold uppercase tracking-widest text-xs text-foreground/60 text-right">
                New ({periodLabel})
              </th>
              <th className="p-4 font-semibold uppercase tracking-widest text-xs text-foreground/60 text-right">
                Growth
              </th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((pkg) => (
              <tr
                key={pkg.packageName}
                className="border-b border-foreground/10 last:border-b-0"
              >
                <td className="p-4">
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 shrink-0"
                      style={{ backgroundColor: seriesColor(pkg.seriesSlot) }}
                    />
                    <a
                      href={`https://github.com/${pkg.githubRepo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0000EE] dark:text-[#A1A1AA] hover:underline font-semibold"
                    >
                      {pkg.displayName}
                    </a>
                  </span>
                </td>
                <td className="p-4">
                  <Sparkline
                    values={pkg.spark}
                    color={seriesColor(pkg.seriesSlot)}
                  />
                </td>
                <td className="p-4 text-right tabular-nums font-bold">
                  {pkg.totalStars.toLocaleString()}
                </td>
                <td className="p-4 text-right tabular-nums">
                  +{pkg.periodStars.toLocaleString()}
                </td>
                <td className="p-4 text-right tabular-nums text-foreground/70">
                  {pkg.growthPercent === null
                    ? "—"
                    : `+${pkg.growthPercent.toLocaleString(undefined, {
                        maximumFractionDigits: 1,
                      })}%`}
                </td>
              </tr>
            ))}
            {breakdown.length > 1 && (
              <tr className="border-t border-foreground/20 bg-muted/30">
                <td className="p-4 font-bold">All Products</td>
                <td className="p-4">
                  <Sparkline values={totalSpark} color="var(--foreground)" />
                </td>
                <td className="p-4 text-right tabular-nums font-bold">
                  {totalStars.toLocaleString()}
                </td>
                <td className="p-4 text-right tabular-nums font-bold">
                  +{periodStars.toLocaleString()}
                </td>
                <td className="p-4 text-right tabular-nums text-foreground/70">
                  —
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
