import type { Streak } from "@/lib/types";

interface StreakDisplayProps {
  streak: Streak;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {streak.currentStreak > 0 && <span className="text-base">🔥</span>}
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Current
          </span>
        </div>
        <span className="text-lg font-bold text-stone-900 dark:text-white">
          {streak.currentStreak}
        </span>
        <span className="text-xs text-stone-500 dark:text-stone-400">
          {streak.currentStreak === 1 ? "wk" : "wks"}
        </span>
      </div>
      <div className="h-8 w-px bg-stone-200 dark:bg-stone-700" />
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-base">🏆</span>
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Best
          </span>
        </div>
        <span className="text-lg font-bold text-stone-900 dark:text-white">
          {streak.longestStreak}
        </span>
        <span className="text-xs text-stone-500 dark:text-stone-400">
          {streak.longestStreak === 1 ? "wk" : "wks"}
        </span>
      </div>
    </div>
  );
}
