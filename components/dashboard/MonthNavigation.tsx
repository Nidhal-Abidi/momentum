import type { MonthInfo } from "@/lib/types/dashboard";

interface MonthNavigationProps {
  currentMonth: MonthInfo;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
}

export function MonthNavigation({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}: MonthNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <button
        onClick={() => onPreviousMonth?.()}
        className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        aria-label="Previous month"
      >
        <svg
          className="w-5 h-5 text-stone-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="text-sm font-medium text-stone-600 dark:text-stone-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          Previous
        </span>
      </button>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
          {currentMonth.displayName}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Day {currentMonth.currentDay} of the month
        </p>
      </div>

      <button
        onClick={() => onNextMonth?.()}
        className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        aria-label="Next month"
      >
        <span className="text-sm font-medium text-stone-600 dark:text-stone-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          Next
        </span>
        <svg
          className="w-5 h-5 text-stone-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
