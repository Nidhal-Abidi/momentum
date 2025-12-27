import type { Domain, Completion } from "@/lib/types";
import { MiniMonthCalendar } from "./MiniMonthCalendar";
import { Button } from "@/components/shadcn/button";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";

interface YearCalendarViewProps {
  domain: Domain;
  domains: Domain[];
  completions: Completion[];
  currentYear: number;
  onYearChange: (delta: number) => void;
  onDomainSelect: (domainId: string) => void;
  onToggleCompletion?: (domainId: string, date: string) => void;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function YearCalendarView({
  domain,
  domains,
  completions,
  currentYear,
  onYearChange,
  onDomainSelect,
  onToggleCompletion,
}: YearCalendarViewProps) {
  // Filter completions for this domain
  const domainCompletions = completions.filter((c) => c.domainId === domain.id);

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Domain Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-14 w-full justify-between rounded-xl shadow-sm sm:w-80"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
                  <span className="text-xl">{domain.icon}</span>
                </div>
                <span className="font-bold">{domain.name}</span>
              </div>
              <ChevronDown className="ml-2 size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80">
            {domains.map((d) => (
              <DropdownMenuItem
                key={d.id}
                onClick={() => onDomainSelect(d.id)}
                className="flex items-center gap-3 p-3"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
                  <span className="text-xl">{d.icon}</span>
                </div>
                <span className="font-semibold">{d.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Year Navigation */}
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onYearChange(-1)}
            className="size-12 rounded-xl shadow-sm transition-all hover:scale-105 hover:shadow"
          >
            <ChevronLeft className="size-5" />
            <span className="sr-only">Previous year</span>
          </Button>
          <h2 className="min-w-[120px] text-center text-2xl font-bold text-stone-900 dark:text-white">
            {currentYear}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onYearChange(1)}
            className="size-12 rounded-xl shadow-sm transition-all hover:scale-105 hover:shadow"
          >
            <ChevronRight className="size-5" />
            <span className="sr-only">Next year</span>
          </Button>
        </div>
      </div>

      {/* Year Grid - 12 Mini Calendars */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {MONTH_NAMES.map((monthName, monthIndex) => (
          <MiniMonthCalendar
            key={monthIndex}
            domain={domain}
            completions={domainCompletions}
            month={monthIndex}
            year={currentYear}
            monthName={monthName}
            onToggleCompletion={onToggleCompletion}
          />
        ))}
      </div>
    </div>
  );
}
