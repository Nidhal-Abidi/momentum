import type { Domain, Completion, Goal, Streak } from "@/lib/types";
import { DayCell } from "./DayCell";
import { StreakDisplay } from "./StreakDisplay";
import { ProgressBar } from "./ProgressBar";
import { startOfWeek } from "date-fns";

interface MonthCalendarProps {
  domain: Domain;
  completions: Completion[];
  goal?: Goal;
  streak?: Streak;
  month: number;
  year: number;
  onToggleCompletion?: (domainId: string, date: string) => void;
}

const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthCalendar({
  domain,
  completions,
  goal,
  streak,
  month,
  year,
  onToggleCompletion,
}: MonthCalendarProps) {
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Convert from Sunday-based (0-6) to Monday-based (0-6)
  // Sunday = 0 -> 6, Monday = 1 -> 0, Tuesday = 2 -> 1, etc.
  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;

  // Create array of days with padding
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Get current date
  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year;

  // Calculate weekly progress (Monday as start of week)
  const getWeekProgress = () => {
    if (!goal) return null;

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday

    const completedThisWeek = completions.filter((c) => {
      const completionDate = new Date(c.date + "T00:00:00");
      return completionDate >= weekStart && completionDate <= now;
    }).length;

    return {
      completed: completedThisWeek,
      target: goal.targetDays,
    };
  };

  const weekProgress = getWeekProgress();

  // Check if date is completed
  const isCompleted = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return completions.some((c) => c.date === dateStr);
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    onToggleCompletion?.(domain.id, dateStr);
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-stone-800 dark:bg-stone-950">
      {/* Domain Header with gradient accent */}
      <div className="border-b border-stone-100 bg-linear-to-br from-stone-50 to-white px-6 py-4 dark:border-stone-800 dark:from-stone-900 dark:to-stone-950">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-stone-900">
            <span className="text-2xl">{domain.emoji}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              {domain.name}
            </h3>
            {weekProgress && (
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {weekProgress.completed}/{weekProgress.target} this week
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Weekday Headers */}
        <div className="mb-3 grid grid-cols-7 gap-2">
          {WEEKDAY_NAMES.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="mb-5 grid grid-cols-7 gap-2">
          {days.map((day, index) =>
            day === null ? (
              <div key={`empty-${index}`} className="aspect-square" />
            ) : (
              <DayCell
                key={day}
                day={day}
                color={domain.color}
                isCompleted={isCompleted(day)}
                isToday={isCurrentMonth && day === today.getDate()}
                isFuture={
                  new Date(year, month, day) > today ||
                  (isCurrentMonth && day > today.getDate())
                }
                onClick={() => handleDayClick(day)}
              />
            )
          )}
        </div>

        {/* Weekly Progress */}
        {weekProgress && (
          <div className="mb-4">
            <ProgressBar
              completed={weekProgress.completed}
              target={weekProgress.target}
              color={domain.color}
            />
          </div>
        )}

        {/* Streak Display */}
        {streak && (
          <div className="rounded-lg bg-stone-50 p-3 dark:bg-stone-900">
            <StreakDisplay streak={streak} />
          </div>
        )}
      </div>
    </div>
  );
}
