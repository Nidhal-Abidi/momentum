"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/calendar";
import { CalendarSkeleton } from "@/components/calendar/CalendarSkeleton";
import type { CalendarView } from "@/components/calendar/Calendar";
import { useDomains } from "@/lib/hooks/domains";
import {
  useCompletions,
  useGoals,
  useStreaks,
  useToggleCompletion,
} from "@/lib/hooks/calendar";
import {
  getCalendarViewClient,
  setCalendarViewClient,
} from "@/lib/cookieUtils";
import { startOfMonth, endOfMonth, format } from "date-fns";

export default function CalendarPage() {
  // Get initial view from cookie
  const [view, setView] = useState<CalendarView>("grid");
  //const [mounted, setMounted] = useState(false);

  // Date range for fetching completions (current month by default)
  const today = new Date();
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(today), "yyyy-MM-dd"),
    endDate: format(endOfMonth(today), "yyyy-MM-dd"),
  });

  // Initialize view from cookie on client
  useEffect(() => {
    //setMounted(true);
    //const savedView = getCalendarViewClient();
    //setView(savedView);
  }, []);

  // Fetch data using TanStack Query hooks
  const {
    data: domains = [],
    isLoading: isLoadingDomains,
    error: domainsError,
  } = useDomains();

  const {
    data: completions = [],
    isLoading: isLoadingCompletions,
    error: completionsError,
  } = useCompletions(dateRange);

  const {
    data: goals = [],
    isLoading: isLoadingGoals,
    error: goalsError,
  } = useGoals();

  const {
    data: streaks = [],
    isLoading: isLoadingStreaks,
    error: streaksError,
  } = useStreaks();

  // Toggle completion mutation
  const toggleCompletion = useToggleCompletion();

  // Handle completion toggle
  const handleToggleCompletion = (domainId: string, date: string) => {
    toggleCompletion.mutate({ domainId, date });
  };

  // Handle view change
  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
    setCalendarViewClient(newView);
  };

  // Handle month change (Grid View)
  const handleMonthChange = (year: number, month: number) => {
    const newDate = new Date(year, month, 1);
    setDateRange({
      startDate: format(startOfMonth(newDate), "yyyy-MM-dd"),
      endDate: format(endOfMonth(newDate), "yyyy-MM-dd"),
    });
  };

  // Handle year change (Single View)
  const handleYearChange = (year: number) => {
    // For year view, fetch entire year
    setDateRange({
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
    });
  };

  // Loading state
  const isLoading =
    //!mounted ||
    isLoadingDomains ||
    isLoadingCompletions ||
    isLoadingGoals ||
    isLoadingStreaks;

  // Error state
  const error = domainsError || completionsError || goalsError || streaksError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CalendarSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="mb-2 text-2xl font-bold text-stone-900 dark:text-white">
            Something went wrong
          </h2>
          <p className="mb-4 text-stone-600 dark:text-stone-400">
            {error instanceof Error ? error.message : "Failed to load calendar"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-indigo-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Calendar
        domains={domains}
        completions={completions}
        goals={goals}
        streaks={streaks}
        view={view}
        onToggleCompletion={handleToggleCompletion}
        onViewChange={handleViewChange}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onDomainSelect={() => {
          // Domain selection doesn't need additional data fetching
          // The Calendar component handles it internally
        }}
      />

      {/* Show mutation error if any */}
      {toggleCompletion.isError && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-red-50 p-4 text-red-900 shadow-lg dark:bg-red-950 dark:text-red-100">
          <p className="font-semibold">Failed to update completion</p>
          <p className="text-sm">
            {toggleCompletion.error instanceof Error
              ? toggleCompletion.error.message
              : "Please try again"}
          </p>
        </div>
      )}
    </div>
  );
}
