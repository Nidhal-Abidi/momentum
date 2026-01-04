"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { Domain } from "@/lib/types";
import {
  getWeekBoundaries,
  getWeeklyHistory,
  getThisMonthStats,
  getCurrentWeekProgressFromArray,
} from "@/lib/streakUtils";

interface Goal {
  id: string;
  domainId: string;
  targetDays: number;
  totalDays: number;
  motivationNote: string;
}

interface Streak {
  id: string;
  domainId: string;
  currentStreak: number;
  longestStreak: number;
}

interface Completion {
  id: string;
  domainId: string;
  date: string; // YYYY-MM-DD format
}

export interface DomainGoal {
  id: string;
  name: string;
  color: string;
  emoji: string;
  goal: {
    target: number;
    motivationNote: string;
  } | null;
  currentWeek: {
    weekStart: string;
    weekEnd: string;
    completions: Array<{ date: string; completed: boolean }>;
    daysCompleted: number;
    percentComplete: number;
  };
  streak: {
    currentWeeks: number;
    longestWeeks: number;
  };
  thisMonth: {
    daysCompleted: number;
    totalDays: number;
    percentage: number;
  };
  weeklyHistory: Array<{
    weekStart: string;
    weekEnd: string;
    achieved: boolean;
    daysCompleted: number;
    target: number;
  }>;
}

async function fetchDomainGoals(): Promise<DomainGoal[]> {
  // Fetch all data in parallel
  const [domainsRes, goalsRes, streaksRes, completionsRes] = await Promise.all([
    fetch("/api/domains"),
    fetch("/api/goals"),
    fetch("/api/streaks"),
    fetch("/api/completions"),
  ]);

  if (!domainsRes.ok || !goalsRes.ok || !streaksRes.ok || !completionsRes.ok) {
    throw new Error("Failed to fetch domain goals data");
  }

  const domains: Domain[] = await domainsRes.json();
  const goals: Goal[] = await goalsRes.json();
  const streaks: Streak[] = await streaksRes.json();
  const completions: Completion[] = await completionsRes.json();

  // Create lookup maps
  const goalsMap = new Map(goals.map((g) => [g.domainId, g]));
  const streaksMap = new Map(streaks.map((s) => [s.domainId, s]));
  const completionsMap = new Map<string, Completion[]>();

  // Group completions by domain
  completions.forEach((c) => {
    if (!completionsMap.has(c.domainId)) {
      completionsMap.set(c.domainId, []);
    }
    completionsMap.get(c.domainId)!.push(c);
  });

  // Transform to DomainGoal interface
  const domainGoals: DomainGoal[] = domains.map((domain) => {
    const goal = goalsMap.get(domain.id);
    const streak = streaksMap.get(domain.id);
    const domainCompletions = completionsMap.get(domain.id) || [];
    const completionDates = domainCompletions.map((c) => c.date);

    // Calculate current week data
    const { weekStart, weekEnd } = getWeekBoundaries(new Date());
    const weekStartStr = weekStart.toISOString().split("T")[0];
    const weekEndStr = weekEnd.toISOString().split("T")[0];

    // Generate all 7 days of the week with completion status
    const currentWeekCompletions = [];
    const currentDate = new Date(weekStart);
    while (currentDate <= weekEnd) {
      const dateStr = currentDate.toISOString().split("T")[0];
      currentWeekCompletions.push({
        date: dateStr,
        completed: completionDates.includes(dateStr),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate progress
    const target = goal?.targetDays || 0;
    const progress = target > 0
      ? getCurrentWeekProgressFromArray(completionDates, target)
      : { daysCompleted: 0, percentComplete: 0 };

    // Calculate weekly history
    const history = goal
      ? getWeeklyHistory(completionDates, goal.targetDays, 4)
      : [];

    // Calculate this month's stats
    const monthStats = getThisMonthStats(completionDates);

    return {
      id: domain.id,
      name: domain.name,
      color: domain.color,
      emoji: domain.emoji,
      goal: goal
        ? {
            target: goal.targetDays,
            motivationNote: goal.motivationNote || "",
          }
        : null,
      currentWeek: {
        weekStart: weekStartStr,
        weekEnd: weekEndStr,
        completions: currentWeekCompletions,
        daysCompleted: progress.daysCompleted,
        percentComplete: progress.percentComplete,
      },
      streak: {
        currentWeeks: streak?.currentStreak || 0,
        longestWeeks: streak?.longestStreak || 0,
      },
      thisMonth: monthStats,
      weeklyHistory: history,
    };
  });

  // Sort: active streaks first, then by completion %, domains without goals last
  return domainGoals.sort((a, b) => {
    // Domains without goals at the end
    if (a.goal === null && b.goal !== null) return 1;
    if (a.goal !== null && b.goal === null) return -1;

    // Active streaks first
    if (a.streak.currentWeeks > 0 && b.streak.currentWeeks === 0) return -1;
    if (a.streak.currentWeeks === 0 && b.streak.currentWeeks > 0) return 1;

    // Then by completion percentage
    return b.currentWeek.percentComplete - a.currentWeek.percentComplete;
  });
}

export function useDomainGoals() {
  return useQuery({
    queryKey: [...queryKeys.domains, "goals-and-streaks"],
    queryFn: fetchDomainGoals,
    staleTime: 30 * 1000, // 30 seconds
  });
}

