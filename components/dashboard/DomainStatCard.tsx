import type { DomainStat } from "@/lib/types/dashboard";

interface DomainStatCardProps {
  stat: DomainStat;
  onClick?: () => void;
}

const colorMap: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    dot: "bg-purple-500",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    dot: "bg-green-500",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    dot: "bg-orange-500",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-500",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800",
    dot: "bg-indigo-500",
  },
  lime: {
    bg: "bg-lime-50 dark:bg-lime-950/30",
    text: "text-lime-700 dark:text-lime-300",
    border: "border-lime-200 dark:border-lime-800",
    dot: "bg-lime-500",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/30",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-200 dark:border-pink-800",
    dot: "bg-pink-500",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-800",
    dot: "bg-cyan-500",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
};

export function DomainStatCard({ stat, onClick }: DomainStatCardProps) {
  const colors = colorMap[stat.color] || colorMap.blue;
  const trendIsPositive = stat.trendDirection === "up";
  const trendIsNeutral = stat.trendDirection === "neutral";

  return (
    <button
      onClick={() => onClick?.()}
      className={`${colors.bg} ${colors.border} border rounded-xl p-6 text-left hover:shadow-lg hover:scale-[1.02] transition-all duration-200 w-full group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${colors.dot} shadow-sm`}></div>
          <h3 className={`font-semibold ${colors.text} text-lg`}>
            {stat.name}
          </h3>
        </div>

        {!trendIsNeutral && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              trendIsPositive
                ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
            }`}
          >
            {trendIsPositive ? (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            <span>{Math.abs(stat.trend)}%</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* This Month */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
              This Month
            </span>
            <span className={`text-2xl font-bold ${colors.text} tabular-nums`}>
              {stat.thisMonth.rate}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-500">
            <span>
              {stat.thisMonth.completed} of {stat.thisMonth.total} days
            </span>
          </div>
        </div>

        {/* Last Month */}
        <div className="pt-3 border-t border-stone-200/50 dark:border-stone-700/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-500">
              Last Month
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-stone-600 dark:text-stone-400 tabular-nums">
                {stat.lastMonth.rate}%
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-500">
                ({stat.lastMonth.completed}/{stat.lastMonth.total})
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
