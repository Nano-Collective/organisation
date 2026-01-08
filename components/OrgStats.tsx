"use client";

import { Star, GitCommit, GitPullRequest, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrgStatsProps {
  stars: number;
  commits: number;
  issues: number;
  pullRequests: number;
  lastUpdated: string;
  isLoading?: boolean;
  error?: string | null;
}

export function OrgStats({
  stars,
  commits,
  issues,
  pullRequests,
  lastUpdated,
  isLoading = false,
  error = null,
}: OrgStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Stats Temporarily Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Stars */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stars</CardTitle>
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : formatNumber(stars)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Across all repos</p>
        </CardContent>
      </Card>

      {/* Commits */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Commits</CardTitle>
          <GitCommit className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : formatNumber(commits)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total contributions
          </p>
        </CardContent>
      </Card>

      {/* Issues */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Issues</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : formatNumber(issues)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Open & closed</p>
        </CardContent>
      </Card>

      {/* Pull Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pull Requests</CardTitle>
          <GitPullRequest className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : formatNumber(pullRequests)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Merged & open</p>
        </CardContent>
      </Card>
    </div>
  );
}
