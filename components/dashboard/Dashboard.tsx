import type { DashboardProps } from "@/lib/types/dashboard";
import { AllTimeSummary } from "./AllTimeSummary";
import { MonthNavigation } from "./MonthNavigation";
import { DomainStatCard } from "./DomainStatCard";
import { WeeklyChart } from "./WeeklyChart";

export function Dashboard({
  allTime,
  currentMonth,
  domainStats,
  weeklyData,
  onPreviousMonth,
  onNextMonth,
  onDomainClick,
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* All-Time Summary */}
        <div className="mb-12">
          <AllTimeSummary stats={allTime} />
        </div>

        {/* Month Navigation */}
        <MonthNavigation
          currentMonth={currentMonth}
          onPreviousMonth={onPreviousMonth}
          onNextMonth={onNextMonth}
        />

        {/* Domain Stats Grid */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-4">
            Monthly Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {domainStats.map((stat) => (
              <DomainStatCard
                key={stat.id}
                stat={stat}
                onClick={() => onDomainClick?.(stat.id)}
              />
            ))}
          </div>
        </div>

        {/* Weekly Chart */}
        <WeeklyChart weeklyData={weeklyData} domainStats={domainStats} />
      </div>
    </div>
  );
}
