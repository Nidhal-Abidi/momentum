import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  isWithinInterval,
  parseISO,
  format,
} from "date-fns";
import { prisma } from "./prisma";

/**
 * Get the start and end of a week (Monday-Sunday)
 * @param date - The date to get the week boundaries for
 * @returns Object with weekStart and weekEnd
 */
export function getWeekBoundaries(date: Date) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 }); // Sunday
  return { weekStart, weekEnd };
}

/**
 * Count how many completions fall within a specific week
 * @param completions - Array of completion dates (YYYY-MM-DD strings)
 * @param weekStart - Start of the week
 * @param weekEnd - End of the week
 * @returns Number of completions in that week
 */
function countCompletionsInWeek(
  completions: string[],
  weekStart: Date,
  weekEnd: Date
): number {
  return completions.filter((dateStr) => {
    const date = parseISO(dateStr);
    return isWithinInterval(date, { start: weekStart, end: weekEnd });
  }).length;
}

/**
 * Calculate the active streak from today going backward
 * @param completionDates - Array of completion date strings
 * @param targetDays - Weekly goal target
 * @param earliestCompletion - The earliest completion date
 * @returns Number of consecutive weeks with goal met (from now backward)
 */
function calculateCurrentStreak(
  completionDates: string[],
  targetDays: number,
  earliestCompletion: Date
): number {
  const currentDate = new Date();
  let streak = 0;
  let checkDate = currentDate;

  // Check if current week has met the goal
  const { weekStart: currentWeekStart, weekEnd: currentWeekEnd } =
    getWeekBoundaries(currentDate);
  const currentWeekCompletions = countCompletionsInWeek(
    completionDates,
    currentWeekStart,
    currentWeekEnd
  );

  // If current week hasn't met goal yet, start from last week
  if (currentWeekCompletions < targetDays) {
    checkDate = subWeeks(currentDate, 1);
  }

  // Count consecutive weeks going backward
  while (checkDate >= earliestCompletion) {
    const { weekStart, weekEnd } = getWeekBoundaries(checkDate);
    const weekCompletions = countCompletionsInWeek(
      completionDates,
      weekStart,
      weekEnd
    );

    if (weekCompletions >= targetDays) {
      streak++;
      checkDate = subWeeks(checkDate, 1);
    } else {
      break;
    }

    // Safety check: max 520 weeks (~10 years)
    if (streak >= 520) break;
  }

  return streak;
}

/**
 * Scan through entire completion history to find the longest streak ever
 * @param completionDates - Array of completion date strings
 * @param targetDays - Weekly goal target
 * @param earliestCompletion - The earliest completion date
 * @param currentStreak - The current active streak (minimum return value)
 * @returns The longest consecutive weeks with goal met
 */
function findLongestStreakInHistory(
  completionDates: string[],
  targetDays: number,
  earliestCompletion: Date,
  currentStreak: number
): number {
  let longestStreak = currentStreak;
  let tempStreak = 0;
  let scanDate = earliestCompletion;
  const endDate = new Date();

  while (scanDate <= endDate) {
    const { weekStart, weekEnd } = getWeekBoundaries(scanDate);
    const weekCompletions = countCompletionsInWeek(
      completionDates,
      weekStart,
      weekEnd
    );

    if (weekCompletions >= targetDays) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }

    // Move to next week
    scanDate = subWeeks(scanDate, -1); // Add 1 week

    // Safety check: max 520 weeks (~10 years)
    const weeksDiff = Math.floor(
      (scanDate.getTime() - earliestCompletion.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );
    if (weeksDiff > 520) break;
  }

  return longestStreak;
}

/**
 * Calculate the current streak for a domain based on weekly goal completion
 * A streak continues as long as the user meets or exceeds their weekly goal
 * Starting from the most recent completed week, counting backward
 *
 * @param domainId - The domain to calculate streak for
 * @returns Object with currentStreak and longestStreak
 */
export async function calculateStreak(domainId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
}> {
  // Get the domain's goal
  const goal = await prisma.goal.findUnique({
    where: { domainId },
  });

  // If no goal exists, streak is always 0
  if (!goal) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Get all completions for this domain
  const completions = await prisma.completion.findMany({
    where: { domainId },
    orderBy: { date: "asc" },
  });

  if (completions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Convert to date strings and get earliest date
  const completionDates = completions.map((c) => format(c.date, "yyyy-MM-dd"));
  const earliestCompletion = parseISO(completionDates[0]);

  // Calculate current active streak
  const currentStreak = calculateCurrentStreak(
    completionDates,
    goal.targetDays,
    earliestCompletion
  );

  // Find longest streak in entire history
  const longestStreak = findLongestStreakInHistory(
    completionDates,
    goal.targetDays,
    earliestCompletion,
    currentStreak
  );

  return { currentStreak, longestStreak };
}

/**
 * Update the streak record in the database for a domain
 * @param domainId - The domain to update
 * @returns The updated streak record
 */
export async function updateStreakForDomain(domainId: string) {
  const { currentStreak, longestStreak } = await calculateStreak(domainId);

  // Upsert the streak record
  const streak = await prisma.streak.upsert({
    where: { domainId },
    update: {
      currentStreak,
      longestStreak,
    },
    create: {
      domainId,
      currentStreak,
      longestStreak,
    },
  });

  return streak;
}

/**
 * Get the current week's progress for a domain
 * Useful for displaying progress bars
 * @param domainId - The domain to check
 * @returns Object with completedDays, targetDays, totalDays
 */
export async function getCurrentWeekProgress(domainId: string): Promise<{
  completedDays: number;
  targetDays: number;
  totalDays: number;
}> {
  // Get the domain's goal
  const goal = await prisma.goal.findUnique({
    where: { domainId },
  });

  // Default to 0 target if no goal exists
  const targetDays = goal?.targetDays || 0;
  const totalDays = goal?.totalDays || 7;

  // Get current week boundaries
  const { weekStart, weekEnd } = getWeekBoundaries(new Date());

  // Count completions in current week
  const completions = await prisma.completion.findMany({
    where: {
      domainId,
      date: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
  });

  return {
    completedDays: completions.length,
    targetDays,
    totalDays,
  };
}

/**
 * Check if a goal was achieved for a specific week
 * @param completions - Array of completion date strings (YYYY-MM-DD)
 * @param target - The weekly goal target
 * @param weekStart - Start of the week
 * @param weekEnd - End of the week
 * @returns True if goal was met or exceeded
 */
export function isGoalAchieved(
  completions: string[],
  target: number,
  weekStart: Date,
  weekEnd: Date
): boolean {
  const count = countCompletionsInWeek(completions, weekStart, weekEnd);
  return count >= target;
}

/**
 * Get weekly history for a domain showing last N weeks
 * @param completions - Array of completion date strings (YYYY-MM-DD)
 * @param target - The weekly goal target
 * @param weeksCount - Number of weeks to retrieve (default 4)
 * @returns Array of weekly history items
 */
export function getWeeklyHistory(
  completions: string[],
  target: number,
  weeksCount: number = 4
): Array<{
  weekStart: string;
  weekEnd: string;
  achieved: boolean;
  daysCompleted: number;
  target: number;
}> {
  const history: Array<{
    weekStart: string;
    weekEnd: string;
    achieved: boolean;
    daysCompleted: number;
    target: number;
  }> = [];

  const currentDate = new Date();

  // Start from last week (not current week)
  for (let i = 1; i <= weeksCount; i++) {
    const checkDate = subWeeks(currentDate, i);
    const { weekStart, weekEnd } = getWeekBoundaries(checkDate);

    const daysCompleted = countCompletionsInWeek(
      completions,
      weekStart,
      weekEnd
    );
    const achieved = daysCompleted >= target;

    history.push({
      weekStart: format(weekStart, "yyyy-MM-dd"),
      weekEnd: format(weekEnd, "yyyy-MM-dd"),
      achieved,
      daysCompleted,
      target,
    });
  }

  return history;
}

/**
 * Get this month's statistics
 * @param completions - Array of completion date strings (YYYY-MM-DD)
 * @returns Object with daysCompleted, totalDays, and percentage
 */
export function getThisMonthStats(completions: string[]): {
  daysCompleted: number;
  totalDays: number;
  percentage: number;
} {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Count completions in current month
  const daysCompleted = completions.filter((dateStr) => {
    const date = parseISO(dateStr);
    return isWithinInterval(date, { start: monthStart, end: monthEnd });
  }).length;

  // Total days from start of month to today (or end of month if today is past month)
  const today = now > monthEnd ? monthEnd : now;
  const totalDays =
    Math.floor(
      (today.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  const percentage =
    totalDays > 0 ? Math.round((daysCompleted / totalDays) * 100) : 0;

  return {
    daysCompleted,
    totalDays,
    percentage,
  };
}

/**
 * Get current week progress with completion details
 * Client-side version that works with arrays
 * @param completions - Array of completion date strings (YYYY-MM-DD)
 * @param target - The weekly goal target
 * @returns Object with daysCompleted and percentComplete
 */
export function getCurrentWeekProgressFromArray(
  completions: string[],
  target: number
): {
  daysCompleted: number;
  percentComplete: number;
} {
  const { weekStart, weekEnd } = getWeekBoundaries(new Date());
  const daysCompleted = countCompletionsInWeek(completions, weekStart, weekEnd);
  const percentComplete =
    target > 0 ? Math.round((daysCompleted / target) * 100) : 0;

  return {
    daysCompleted,
    percentComplete,
  };
}
