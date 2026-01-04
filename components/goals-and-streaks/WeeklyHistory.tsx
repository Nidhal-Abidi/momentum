import { Check, X } from "lucide-react";
import { getColorClasses } from "@/lib/colorUtils";

export interface WeeklyHistoryItem {
  weekStart: string;
  weekEnd: string;
  achieved: boolean;
  daysCompleted: number;
  target: number;
}

interface WeeklyHistoryProps {
  history: WeeklyHistoryItem[];
  color: string;
}

function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = new Date(weekStart);
  const end = new Date(weekEnd);

  const startMonth = start.toLocaleString("default", { month: "short" });
  const endMonth = end.toLocaleString("default", { month: "short" });

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()}-${end.getDate()}`;
  }

  return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
}

export function WeeklyHistory({ history, color }: WeeklyHistoryProps) {
  const colors = getColorClasses(color);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
        Last 4 Weeks
      </h4>

      {history.map((week, index) => {
        const isExceeded = week.daysCompleted > week.target;

        return (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-700"
          >
            {/* Week Info */}
            <div className="flex items-center gap-3">
              {/* Achievement Icon */}
              <div
                className={`
                  flex items-center justify-center size-8 rounded-full
                  ${
                    week.achieved
                      ? `${colors.bgLight} ${colors.text}`
                      : "bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500"
                  }
                `}
              >
                {week.achieved ? (
                  <Check className="size-4 stroke-[3]" />
                ) : (
                  <X className="size-4 stroke-[3]" />
                )}
              </div>

              {/* Date and Stats */}
              <div>
                <p className="text-sm font-medium text-stone-900 dark:text-white">
                  {formatWeekRange(week.weekStart, week.weekEnd)}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {week.daysCompleted}/{week.target} days
                  {isExceeded && (
                    <span className={`ml-1 ${colors.text} font-medium`}>
                      (exceeded!)
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            {week.achieved ? (
              <div className={colors.bgLight}>
                <span className={`text-xs font-semibold ${colors.textLight} px-2 py-1`}>
                  ✓ Goal Met
                </span>
              </div>
            ) : (
              <div className="px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-700">
                <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                  Try again
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

