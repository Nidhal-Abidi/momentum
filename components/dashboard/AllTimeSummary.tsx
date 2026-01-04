import type { AllTimeStats } from "@/lib/types/dashboard";

interface AllTimeSummaryProps {
  stats: AllTimeStats;
}

export function AllTimeSummary({ stats }: AllTimeSummaryProps) {
  const startDate = new Date(stats.accountStartDate);
  const formattedDate = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-2xl p-8 text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/40">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"></div>
        <p className="text-sm font-medium text-indigo-100 uppercase tracking-wider">
          All-Time Performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold tabular-nums">
              {stats.totalDaysTracked.toLocaleString()}
            </span>
            <span className="text-indigo-200 text-sm font-medium">
              completions
            </span>
          </div>
          <p className="text-indigo-200 text-sm">Total days tracked</p>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold tabular-nums">
              {stats.overallCompletionRate}%
            </span>
          </div>
          <p className="text-indigo-200 text-sm">Overall completion rate</p>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold tabular-nums">
              {stats.accountAgeDays}
            </span>
            <span className="text-indigo-200 text-sm font-medium">days</span>
          </div>
          <p className="text-indigo-200 text-sm">Since {formattedDate}</p>
        </div>
      </div>
    </div>
  );
}
