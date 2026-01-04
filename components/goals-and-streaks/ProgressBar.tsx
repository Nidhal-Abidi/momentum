import { getColorClasses } from "@/lib/colorUtils";

interface ProgressBarProps {
  current: number;
  target: number;
  color: string;
  percentComplete: number;
}

export function ProgressBar({
  current,
  target,
  color,
  percentComplete,
}: ProgressBarProps) {
  const displayPercent = Math.min(percentComplete, 100); // Cap visual at 100%
  const isExceeded = percentComplete > 100;
  const colors = getColorClasses(color);

  return (
    <div>
      {/* Label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
          Weekly Progress
        </span>
        <span className="text-sm font-bold text-stone-900 dark:text-white">
          {current}/{target} days
          {isExceeded && (
            <span className={`ml-1 ${colors.text}`}>
              ({percentComplete}%)
            </span>
          )}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
        <div
          className={`h-full ${colors.bgDark} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${displayPercent}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
        </div>

        {/* Exceeded indicator */}
        {isExceeded && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <div
              className={`size-2 rounded-full ${colors.bgDark} animate-pulse`}
            />
          </div>
        )}
      </div>

      {/* Percentage */}
      <div className="mt-1 text-right">
        <span
          className={`text-xs font-medium ${
            isExceeded
              ? colors.text
              : "text-stone-500 dark:text-stone-500"
          }`}
        >
          {percentComplete}% complete
        </span>
      </div>
    </div>
  );
}

