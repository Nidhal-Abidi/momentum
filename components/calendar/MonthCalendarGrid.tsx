import type { Domain, Completion, Goal, Streak } from "@/lib/types";
import { MonthCalendar } from "./MonthCalendar";
import { Button } from "@/components/shadcn/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthCalendarGridProps {
  domains: Domain[];
  completions: Completion[];
  goals: Goal[];
  streaks: Streak[];
  currentMonth: number;
  currentYear: number;
  onMonthChange: (delta: number) => void;
  onToggleCompletion?: (domainId: string, date: string) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MonthCalendarGrid({
  domains,
  completions,
  goals,
  streaks,
  currentMonth,
  currentYear,
  onMonthChange,
  onToggleCompletion,
}: MonthCalendarGridProps) {
  return (
    <div>
      {/* Month Navigation */}
      <div className="mb-8 flex items-center justify-center gap-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onMonthChange(-1)}
          className="size-12 rounded-xl shadow-sm transition-all hover:scale-105 hover:shadow"
        >
          <ChevronLeft className="size-5" />
          <span className="sr-only">Previous month</span>
        </Button>
        <h2 className="min-w-[240px] text-center text-2xl font-bold text-stone-900 dark:text-white">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onMonthChange(1)}
          className="size-12 rounded-xl shadow-sm transition-all hover:scale-105 hover:shadow"
        >
          <ChevronRight className="size-5" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {domains.map((domain) => {
          const domainCompletions = completions.filter(
            (c) => c.domainId === domain.id
          );
          const domainGoal = goals.find((g) => g.domainId === domain.id);
          const domainStreak = streaks.find((s) => s.domainId === domain.id);

          return (
            <MonthCalendar
              key={domain.id}
              domain={domain}
              completions={domainCompletions}
              goal={domainGoal}
              streak={domainStreak}
              month={currentMonth}
              year={currentYear}
              onToggleCompletion={onToggleCompletion}
            />
          );
        })}
      </div>
    </div>
  );
}
