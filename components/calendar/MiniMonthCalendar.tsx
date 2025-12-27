import type { Domain, Completion } from "@/lib/types";
import { DayCell } from "./DayCell";

interface MiniMonthCalendarProps {
  domain: Domain;
  completions: Completion[];
  month: number;
  year: number;
  monthName: string;
  onToggleCompletion?: (domainId: string, date: string) => void;
}

const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

export function MiniMonthCalendar({
  domain,
  completions,
  month,
  year,
  monthName,
  onToggleCompletion,
}: MiniMonthCalendarProps) {
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

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
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-stone-800 dark:bg-stone-950">
      {/* Month Name */}
      <h3 className="mb-4 text-center text-base font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
        {monthName}
      </h3>

      {/* Weekday Headers */}
      <div className="mb-2.5 grid grid-cols-7 gap-2">
        {WEEKDAY_INITIALS.map((day, index) => (
          <div
            key={index}
            className="text-center text-xs font-bold text-stone-400 dark:text-stone-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
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
    </div>
  );
}
