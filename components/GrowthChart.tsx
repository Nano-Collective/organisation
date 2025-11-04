"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface DownloadData {
  date: string;
  downloads: number;
}

interface Release {
  tag: string;
  date: string;
  name: string;
}

interface GrowthChartProps {
  downloadData: DownloadData[];
  sevenDayAvg: { date: string; average: number }[];
  thirtyDayAvg: { date: string; average: number }[];
  cumulativeData: { date: string; cumulative: number }[];
  releases: Release[];
}

export function GrowthChart({
  downloadData,
  sevenDayAvg,
  thirtyDayAvg,
  cumulativeData,
  releases
}: GrowthChartProps) {
  // Combine all data by date
  const chartData = downloadData.map((d, index) => ({
    date: d.date,
    daily: d.downloads,
    sevenDay: sevenDayAvg[index]?.average || null,
    thirtyDay: thirtyDayAvg[index]?.average || null,
    cumulative: cumulativeData[index]?.cumulative || 0
  }));

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ dataKey: string; value: number | null; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length && label) {
      const release = releases.find(r => r.date === label);

      return (
        <div className="bg-card border border-border p-4 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{formatDate(label)}</p>
          {release && (
            <p className="text-xs text-primary mb-2 font-semibold">
              🚀 Release: {release.name}
            </p>
          )}
          {payload.map((entry) => {
            if (entry.value === null || entry.value === undefined) return null;

            let label = '';
            switch (entry.dataKey) {
              case 'daily':
                label = 'Daily Downloads';
                break;
              case 'sevenDay':
                label = '7-Day Avg';
                break;
              case 'thirtyDay':
                label = '30-Day Avg';
                break;
              case 'cumulative':
                label = 'Total Downloads';
                break;
            }

            return (
              <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
                {label}: {entry.value.toLocaleString()}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card p-6 rounded-lg border">
      <h2 className="text-2xl font-serif font-bold mb-6">Download Trends</h2>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            minTickGap={50}
          />

          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            label={{ value: 'Daily Downloads', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            label={{ value: 'Total Downloads', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />

          {/* Release markers */}
          {releases.map((release) => (
            <ReferenceLine
              key={release.tag}
              x={release.date}
              yAxisId="left"
              stroke="#ffc658"
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{
                value: release.tag,
                position: 'top',
                fontSize: 11,
                fill: '#ffc658',
                fontWeight: 600
              }}
            />
          ))}

          {/* Cumulative total line (dashed) */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulative"
            stroke="oklch(0.5 0.05 280)"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={false}
            name="Total Downloads"
          />

          {/* 30-Day rolling average (blue) */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="thirtyDay"
            stroke="oklch(0.6 0.15 250)"
            strokeWidth={2.5}
            dot={false}
            name="30-Day Avg"
          />

          {/* 7-Day rolling average (orange/red) */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sevenDay"
            stroke="oklch(0.65 0.2 30)"
            strokeWidth={2.5}
            dot={false}
            name="7-Day Avg"
          />

          {/* Daily downloads (pink solid line on top) */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="daily"
            stroke="oklch(0.7 0.15 340)"
            strokeWidth={2}
            dot={false}
            name="Daily"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
