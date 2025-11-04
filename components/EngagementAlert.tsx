import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EngagementAlertProps {
  sevenDayAvg: number;
  thirtyDayAvg: number;
  needsEngagement: boolean;
}

export function EngagementAlert({
  sevenDayAvg,
  thirtyDayAvg,
  needsEngagement,
}: EngagementAlertProps) {
  const difference = thirtyDayAvg - sevenDayAvg;
  const percentageDown = ((difference / thirtyDayAvg) * 100).toFixed(1);

  if (needsEngagement) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="mb-2">Engagement Needed!</AlertTitle>
        <AlertDescription>
          <p className="mb-3">
            The 7-day average ({sevenDayAvg.toLocaleString()} downloads/day) has
            dropped below the 30-day average ({thirtyDayAvg.toLocaleString()}{" "}
            downloads/day) by <strong>{percentageDown}%</strong>.
          </p>
          <div className="bg-background/50 p-4 rounded-md">
            <p className="font-semibold mb-2">Recommended Actions:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Create a social media post highlighting recent features</li>
              <li>
                Write a blog article or tutorial about Nanocoder use cases
              </li>
              <li>Engage with the community on Reddit, Discord, or Twitter</li>
              <li>Consider planning a new release with requested features</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Positive status - growth is healthy
  return (
    <Alert className="mb-8 border-emerald-500/50 bg-emerald-500/10">
      <CheckCircle className="h-5 w-5 text-emerald-500" />
      <AlertTitle className="mb-2 text-emerald-500">
        Growth is Healthy!
      </AlertTitle>
      <AlertDescription>
        <p className="text-emerald-500">
          The 7-day average ({sevenDayAvg.toLocaleString()} downloads/day) is{" "}
          {sevenDayAvg >= thirtyDayAvg ? "above" : "within 20% of"} the 30-day
          average ({thirtyDayAvg.toLocaleString()} downloads/day). Keep up the
          great work!
        </p>
      </AlertDescription>
    </Alert>
  );
}
