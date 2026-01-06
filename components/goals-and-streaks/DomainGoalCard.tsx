import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Target,
  Flame,
  TrendingUp,
} from "lucide-react";
import { getColorClasses } from "@/lib/colorUtils";
import { type DomainGoal } from "@/lib/hooks/goals-and-streaks";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { WeeklyHistory } from "./WeeklyHistory";
import { DomainIcon } from "./DomainIcon";
import { format, isSameMonth, isSameYear, parse } from "date-fns";

interface DomainGoalCardProps {
  domain: DomainGoal;
  onSetGoal?: () => void;
  onRemoveGoal?: () => void;
  onViewHistory?: () => void;
  onEditDomain?: () => void;
}

function formatWeekRange(startDate: string, endDate: string): string {
  const start = parse(startDate, "yyyy-MM-dd", new Date());
  const end = parse(endDate, "yyyy-MM-dd", new Date());

  const startDay = format(start, "d");
  const endDay = format(end, "d");
  const startMonth = format(start, "MMMM");
  const startYear = format(start, "yyyy");
  const endYear = format(end, "yyyy");

  // Same month and year
  if (isSameMonth(start, end) && isSameYear(start, end)) {
    return `${startDay}-${endDay} ${startMonth}`;
  }

  // Different years
  if (!isSameYear(start, end)) {
    return `${startDay} ${format(
      start,
      "MMM"
    )} ${startYear} - ${endDay} ${format(end, "MMM")} ${endYear}`;
  }

  // Different months, same year
  return `${startDay} ${format(start, "MMM")} - ${endDay} ${format(
    end,
    "MMM"
  )}`;
}

export function DomainGoalCard({
  domain,
  onSetGoal,
  onRemoveGoal,
  onViewHistory,
  onEditDomain,
}: DomainGoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = getColorClasses(domain.color);

  const hasGoal = domain.goal !== null;
  const hasActiveStreak = domain.streak.currentWeeks > 0;
  const isGoalAchieved = hasGoal && domain.currentWeek.percentComplete >= 100;
  const isGoalExceeded = hasGoal && domain.currentWeek.percentComplete > 100;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border-2 bg-white dark:bg-stone-900
        transition-all duration-300
        ${
          hasActiveStreak
            ? `${colors.border} shadow-lg ${colors.shadow}`
            : "border-stone-200 dark:border-stone-800 shadow-sm"
        }
      `}
    >
      {/* Background Accent */}
      <div
        className={`absolute top-0 right-0 w-48 h-48 opacity-5 dark:opacity-10 blur-3xl ${colors.bg} rounded-full -translate-y-12 translate-x-12`}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <DomainIcon emoji={domain.emoji} color={domain.color} />
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                {domain.name}
              </h3>
              {hasGoal && domain.goal && (
                <p className="text-sm text-stone-600 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                  <Target className="size-3.5" />
                  <span>{domain.goal.target} days/week</span>
                </p>
              )}
            </div>
          </div>

          {/* Set/Edit Goal Button */}
          <Button
            variant={hasGoal ? "outline" : "default"}
            size="sm"
            onClick={onSetGoal}
            className={
              hasGoal ? "" : `${colors.bg} ${colors.hover} text-white border-0`
            }
          >
            {hasGoal ? "Edit Goal" : "Set Goal"}
          </Button>
        </div>

        {/* Progress Section */}
        {hasGoal ? (
          <div className="mb-4">
            {/* Progress Bar */}
            <ProgressBar
              current={domain.currentWeek.daysCompleted}
              target={domain.goal?.target || 0}
              color={domain.color}
              percentComplete={domain.currentWeek.percentComplete}
            />

            {/* Motivational Message */}
            {isGoalExceeded && (
              <div className="mt-3 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <TrendingUp className="size-4" />
                  <span>Amazing! You exceeded your goal! 🎉</span>
                </p>
              </div>
            )}
            {isGoalAchieved && !isGoalExceeded && (
              <div className="mt-3 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Goal achieved for the week{" "}
                  {formatWeekRange(
                    domain.currentWeek.weekStart,
                    domain.currentWeek.weekEnd
                  )}
                  ! Keep it up! 🎉
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 px-4 py-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              No goal set yet. Set a weekly target to start tracking your
              streak!
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Current Streak */}
          <div className="text-center p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              {hasActiveStreak && <Flame className={`size-4 ${colors.text}`} />}
              <p
                className={`text-2xl font-bold ${
                  hasActiveStreak
                    ? colors.text
                    : "text-stone-900 dark:text-white"
                }`}
              >
                {domain.streak.currentWeeks}
              </p>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Current Streak
            </p>
          </div>

          {/* Longest Streak */}
          <div className="text-center p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50">
            <p className="text-2xl font-bold text-stone-900 dark:text-white mb-1">
              {domain.streak.longestWeeks}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Best Streak
            </p>
          </div>

          {/* This Month */}
          <div className="text-center p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50">
            <p className="text-2xl font-bold text-stone-900 dark:text-white mb-1">
              {domain.thisMonth.daysCompleted}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Days This Month
            </p>
          </div>
        </div>

        {/* Monthly Goal Progress */}
        {hasGoal && domain.goal && (
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-stone-600 dark:text-stone-400">
              Monthly target
            </span>
            <span className="font-medium text-stone-900 dark:text-white">
              {domain.thisMonth.daysCompleted}/{domain.goal.target * 4} days
            </span>
          </div>
        )}

        {/* View History Toggle */}
        {domain.weeklyHistory.length > 0 && (
          <>
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                onViewHistory?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="size-4" />
                  <span>Hide History</span>
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" />
                  <span>View Last 4 Weeks</span>
                </>
              )}
            </button>

            {/* Expandable History */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                <WeeklyHistory
                  history={domain.weeklyHistory}
                  color={domain.color}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
