import { ArrowUp, ArrowDown, Minus, Download, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GrowthMetricsProps {
  totalDownloads: number;
  currentSevenDay: number;
  currentThirtyDay: number;
  trend: 'up' | 'down' | 'neutral';
}

export function GrowthMetrics({
  totalDownloads,
  currentSevenDay,
  currentThirtyDay,
  trend
}: GrowthMetricsProps) {
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Downloads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">All-time NPM downloads</p>
        </CardContent>
      </Card>

      {/* 7-Day Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">7-Day Average</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentSevenDay.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Downloads per day</p>
        </CardContent>
      </Card>

      {/* 30-Day Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">30-Day Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentThirtyDay.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Downloads per day</p>
        </CardContent>
      </Card>

      {/* Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
          <TrendIcon className={`h-4 w-4 ${trendColor}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${trendColor}`}>
            {trend === 'up' ? 'Growing' : trend === 'down' ? 'Declining' : 'Stable'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {trend === 'up' && '7-day avg is increasing'}
            {trend === 'down' && '7-day avg is decreasing'}
            {trend === 'neutral' && 'Minimal change'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
