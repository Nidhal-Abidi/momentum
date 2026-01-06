import type { AllTimeStats } from "@/lib/types/analytics";

interface AllTimeSummaryProps {
  stats: AllTimeStats;
}

export function AllTimeSummary({ stats }: AllTimeSummaryProps) {
  // Convert the rate back to actual average (it's stored as avg * 100)
  const avgPerDay = (stats.overallCompletionRate / 100).toFixed(1);

  return (
    <div className="bg-linear-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-2xl p-8 text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/40">
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
          <p className="text-indigo-200 text-sm">Total completions tracked</p>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold tabular-nums">{avgPerDay}</span>
            <span className="text-indigo-200 text-sm font-medium">per day</span>
          </div>
          <p className="text-indigo-200 text-sm">Average daily completions</p>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold tabular-nums">
              {stats.longestDailyStreak}
            </span>
            <span className="text-indigo-200 text-sm font-medium">days</span>
          </div>
          <p className="text-indigo-200 text-sm">
            Most consecutive days active
          </p>
        </div>
      </div>
    </div>
  );
}
