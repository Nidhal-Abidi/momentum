"use client";

import { GoalsStreaksView } from "@/components/goals-and-streaks";
import { useDomainGoals } from "@/lib/hooks/goals-and-streaks";
import { CalendarSkeleton } from "@/components/calendar/CalendarSkeleton";

export default function GoalsAndStreaksPage() {
  const { data: domainGoals, isLoading, error } = useDomainGoals();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CalendarSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-4">
            Error Loading Goals
          </h2>
          <p className="text-stone-600 dark:text-stone-400">
            Failed to load your goals and streaks. Please try refreshing the
            page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GoalsStreaksView domainGoals={domainGoals || []} />
    </div>
  );
}
