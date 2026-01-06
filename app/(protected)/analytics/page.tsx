"use client";

import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/analytics";
import { useDashboardData, useMonthNavigation } from "@/lib/hooks/analytics";

export default function AnalyticsPage() {
  const router = useRouter();
  const { month, year, goToPreviousMonth, goToNextMonth, canGoNext } =
    useMonthNavigation();

  const { data, isLoading, error } = useDashboardData({ month, year });
  console.log("data->", data);

  const handleDomainClick = (domainId: string) => {
    router.push(`/calendar?domain=${domainId}`);
  };

  const handleNextMonth = () => {
    if (canGoNext) {
      goToNextMonth();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading skeleton for all-time summary */}
          <div className="mb-12">
            <div className="bg-linear-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-2xl p-8 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/40 animate-pulse">
              <div className="h-4 w-48 bg-white/20 rounded mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <div className="h-10 w-32 bg-white/20 rounded mb-2"></div>
                  <div className="h-4 w-40 bg-white/20 rounded"></div>
                </div>
                <div>
                  <div className="h-10 w-24 bg-white/20 rounded mb-2"></div>
                  <div className="h-4 w-48 bg-white/20 rounded"></div>
                </div>
                <div>
                  <div className="h-10 w-20 bg-white/20 rounded mb-2"></div>
                  <div className="h-4 w-36 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading skeleton for month navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="h-10 w-32 bg-stone-200 dark:bg-stone-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-48 bg-stone-200 dark:bg-stone-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-stone-200 dark:bg-stone-800 rounded-lg animate-pulse"></div>
          </div>

          {/* Loading skeleton for domain cards */}
          <div className="mb-12">
            <div className="h-4 w-48 bg-stone-200 dark:bg-stone-800 rounded mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-stone-200 dark:bg-stone-800 rounded-xl p-6 h-48 animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Loading skeleton for chart */}
          <div className="bg-stone-200 dark:bg-stone-800 rounded-2xl p-6 sm:p-8 h-[500px] animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 p-8 text-center">
            <div className="mx-auto max-w-md space-y-4">
              <div className="text-6xl">⚠️</div>
              <h2 className="text-2xl font-semibold text-red-900 dark:text-red-100">
                Failed to Load Analytics
              </h2>
              <p className="text-red-700 dark:text-red-300">
                {error instanceof Error
                  ? error.message
                  : "An error occurred while loading the analytics data."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950 p-12 text-center">
            <div className="mx-auto max-w-md space-y-4">
              <div className="text-6xl">📊</div>
              <h2 className="text-2xl font-semibold text-stone-900 dark:text-white">
                No Data Available
              </h2>
              <p className="text-stone-600 dark:text-stone-400">
                Start tracking your domains to see analytics and insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main analytics with data
  return (
    <Dashboard
      allTime={data.allTime}
      currentMonth={data.currentMonth}
      domainStats={data.domainStats}
      weeklyData={data.weeklyData}
      onPreviousMonth={goToPreviousMonth}
      onNextMonth={handleNextMonth}
      onDomainClick={handleDomainClick}
    />
  );
}
