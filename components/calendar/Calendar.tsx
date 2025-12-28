"use client";

import { useState, useMemo, useEffect } from "react";
import type { Domain, Completion, Goal, Streak } from "@/lib/types";
import { MonthCalendarGrid } from "./MonthCalendarGrid";
import { YearCalendarView } from "./YearCalendarView";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/shadcn/button";
import { LayoutGrid, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarView = "grid" | "single";

export interface CalendarProps {
  domains: Domain[];
  completions: Completion[];
  goals: Goal[];
  streaks: Streak[];
  view?: CalendarView;
  currentMonth?: number;
  currentYear?: number;
  onToggleCompletion?: (domainId: string, date: string) => void;
  onViewChange?: (view: CalendarView) => void;
  onDomainSelect?: (domainId: string) => void;
  onMonthChange?: (year: number, month: number) => void;
  onYearChange?: (year: number) => void;
}

/**
 * Calendar component supporting both Grid View (monthly calendars for all domains)
 * and Single View (yearly calendar for one domain).
 *
 * Design tokens: indigo (primary), emerald (secondary), stone (neutral)
 * Typography: DM Sans
 */
export function Calendar({
  domains,
  completions,
  goals,
  streaks,
  view = "grid",
  currentMonth: controlledMonth,
  currentYear: controlledYear,
  onToggleCompletion,
  onViewChange,
  onDomainSelect,
  onMonthChange,
  onYearChange,
}: CalendarProps) {
  // Use controlled props if provided, otherwise fall back to local state
  const today = new Date();
  const [internalMonth, setInternalMonth] = useState(today.getMonth());
  const [internalYear, setInternalYear] = useState(today.getFullYear());

  // Use controlled values if provided, otherwise use internal state
  const currentMonth =
    controlledMonth !== undefined ? controlledMonth : internalMonth;
  const currentYear =
    controlledYear !== undefined ? controlledYear : internalYear;

  // Manage selectedDomainId - reset to first domain if current selection becomes invalid
  const [selectedDomainId, setSelectedDomainId] = useState(() =>
    domains.length > 0 ? domains[0].id : ""
  );

  // Compute the actual selectedDomainId to use (ensures it's always valid)
  const validSelectedDomainId = useMemo(() => {
    if (domains.length === 0) return "";
    const currentExists = domains.some((d) => d.id === selectedDomainId);
    return currentExists ? selectedDomainId : domains[0].id;
  }, [domains, selectedDomainId]);

  // Update state when selection becomes invalid
  // This is necessary to sync state when domains list changes (e.g., domain deleted)
  // We need to update state here because the selectedDomainId becomes invalid when domains change
  // This is a valid use case for setState in useEffect as we're syncing with external data
  useEffect(() => {
    if (validSelectedDomainId !== selectedDomainId && validSelectedDomainId) {
      setSelectedDomainId(validSelectedDomainId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validSelectedDomainId]); // Only depend on validSelectedDomainId to avoid loops

  // Empty state
  if (domains.length === 0) {
    return <EmptyState />;
  }

  // Handle month navigation (Grid View)
  const handleMonthChange = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;

    // Handle year boundaries
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    // If controlled, notify parent; otherwise update internal state
    if (controlledMonth !== undefined || controlledYear !== undefined) {
      onMonthChange?.(newYear, newMonth);
    } else {
      setInternalMonth(newMonth);
      setInternalYear(newYear);
      onMonthChange?.(newYear, newMonth);
    }
  };

  // Handle year navigation (Single View)
  const handleYearChange = (delta: number) => {
    const newYear = currentYear + delta;

    // If controlled, notify parent; otherwise update internal state
    if (controlledYear !== undefined) {
      onYearChange?.(newYear);
    } else {
      setInternalYear(newYear);
      onYearChange?.(newYear);
    }
  };

  // Handle domain selection (Single View)
  const handleDomainSelect = (domainId: string) => {
    setSelectedDomainId(domainId);
    onDomainSelect?.(domainId);
  };

  // Handle view toggle
  const handleViewChange = (newView: "grid" | "single") => {
    onViewChange?.(newView);
  };

  // Get selected domain for Single View
  const selectedDomain = domains.find((d) => d.id === validSelectedDomainId);

  return (
    <div className="w-full">
      {/* Header with View Toggle */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-white">
            Calendar
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            {view === "grid"
              ? "Track your daily completions across all life domains"
              : "View yearly patterns for a specific domain"}
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex rounded-xl border border-stone-200 bg-white p-1 shadow-sm dark:border-stone-800 dark:bg-stone-950">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange("grid")}
            className={cn(
              "rounded-lg transition-all",
              view === "grid"
                ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-600 hover:text-white dark:bg-indigo-600 dark:hover:bg-indigo-700"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-100"
            )}
          >
            <LayoutGrid className="mr-2 size-4" />
            Grid View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange("single")}
            className={cn(
              "rounded-lg transition-all",
              view === "single"
                ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-600 hover:text-white dark:bg-indigo-600 dark:hover:bg-indigo-700"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-100"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            Year View
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <MonthCalendarGrid
          domains={domains}
          completions={completions}
          goals={goals}
          streaks={streaks}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onMonthChange={handleMonthChange}
          onToggleCompletion={onToggleCompletion}
        />
      )}

      {/* Single View */}
      {view === "single" && selectedDomain && (
        <YearCalendarView
          domain={selectedDomain}
          domains={domains}
          completions={completions}
          currentYear={currentYear}
          onYearChange={handleYearChange}
          onDomainSelect={handleDomainSelect}
          onToggleCompletion={onToggleCompletion}
        />
      )}
    </div>
  );
}
