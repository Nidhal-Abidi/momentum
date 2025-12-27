import { cn } from "@/lib/utils";
import type { Domain } from "@/lib/types";

interface ProgressBarProps {
  completed: number;
  target: number;
  color: Domain["color"];
}

const COLOR_VARIANTS = {
  lime: "bg-lime-500 dark:bg-lime-400",
  blue: "bg-blue-500 dark:bg-blue-400",
  purple: "bg-purple-500 dark:bg-purple-400",
  emerald: "bg-emerald-500 dark:bg-emerald-400",
  orange: "bg-orange-500 dark:bg-orange-400",
  red: "bg-red-500 dark:bg-red-400",
  pink: "bg-pink-500 dark:bg-pink-400",
  cyan: "bg-cyan-500 dark:bg-cyan-400",
  amber: "bg-amber-500 dark:bg-amber-400",
  indigo: "bg-indigo-500 dark:bg-indigo-400",
};

export function ProgressBar({ completed, target, color }: ProgressBarProps) {
  const percentage = Math.min((completed / target) * 100, 100);
  const isComplete = completed >= target;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
          Weekly Goal
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-sm font-bold",
              isComplete
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-stone-900 dark:text-white"
            )}
          >
            {completed}/{target}
          </span>
          {isComplete && <span className="text-sm">✓</span>}
        </div>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            COLOR_VARIANTS[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
