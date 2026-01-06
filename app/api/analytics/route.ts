import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type {
  AllTimeStats,
  MonthInfo,
  DomainStat,
  WeeklyData,
  MonthlyCompletion,
} from "@/lib/types/analytics";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  differenceInDays,
  subMonths,
  getDaysInMonth,
} from "date-fns";

// GET /api/analytics - Get analytics data
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const today = startOfDay(new Date());
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    // Default to current month/year if not provided
    const targetMonth = monthParam
      ? parseInt(monthParam)
      : today.getMonth() + 1;
    const targetYear = yearParam ? parseInt(yearParam) : today.getFullYear();

    // Validate month and year
    if (targetMonth < 1 || targetMonth > 12) {
      return NextResponse.json(
        { error: "Invalid month parameter" },
        { status: 400 }
      );
    }

    // Get user to fetch account creation date
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all user's domains
    const domains = await prisma.domain.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });

    // Create the target month date object
    const targetMonthDate = new Date(targetYear, targetMonth - 1, 1);
    const thisMonthStart = startOfMonth(targetMonthDate);
    const thisMonthEnd = endOfMonth(targetMonthDate);
    const isCurrentMonth =
      format(thisMonthStart, "yyyy-MM") === format(today, "yyyy-MM");

    // For current month, only count up to today
    const effectiveMonthEnd = isCurrentMonth ? endOfDay(today) : thisMonthEnd;
    const currentDay = isCurrentMonth
      ? today.getDate()
      : getDaysInMonth(targetMonthDate);

    // Month info
    const monthInfo: MonthInfo = {
      displayName: format(targetMonthDate, "MMMM yyyy"),
      year: targetYear,
      month: targetMonth,
      currentDay: currentDay,
    };

    if (domains.length === 0) {
      // Return empty state for users with no domains
      return NextResponse.json({
        allTime: {
          totalDaysTracked: 0,
          overallCompletionRate: 0,
          accountStartDate: format(user.createdAt, "yyyy-MM-dd"),
          longestDailyStreak: 0,
        },
        currentMonth: monthInfo,
        domainStats: [],
        weeklyData: [],
      });
    }

    // =========================================================================
    // Calculate All-Time Stats
    // =========================================================================

    const totalCompletions = await prisma.completion.count({
      where: {
        domain: {
          userId: session.user.id,
        },
      },
    });

    const accountAgeDays = Math.max(
      differenceInDays(today, startOfDay(user.createdAt)),
      1
    );

    // Average completions per day - much clearer metric than percentage
    const avgCompletionsPerDay = totalCompletions / accountAgeDays;
    const overallCompletionRate = Math.round(avgCompletionsPerDay * 100);

    // Calculate longest daily streak (consecutive days with at least one completion across ANY domain)
    // Get all unique dates where user had completions (any domain counts)
    const completionDates = await prisma.completion.findMany({
      where: {
        domain: {
          userId: session.user.id,
        },
      },
      select: {
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Extract unique dates and convert to comparable format
    const uniqueDates = Array.from(
      new Set(
        completionDates.map((c) => format(startOfDay(c.date), "yyyy-MM-dd"))
      )
    ).sort();

    // Calculate longest consecutive streak
    let longestDailyStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const daysDiff = differenceInDays(currDate, prevDate);

        if (daysDiff === 1) {
          // Consecutive day
          currentStreak++;
        } else {
          // Streak broken
          longestDailyStreak = Math.max(longestDailyStreak, currentStreak);
          currentStreak = 1;
        }
      }
    }
    longestDailyStreak = Math.max(longestDailyStreak, currentStreak);

    const allTime: AllTimeStats = {
      totalDaysTracked: totalCompletions,
      overallCompletionRate: overallCompletionRate, // Now represents avg completions/day * 100
      accountStartDate: format(user.createdAt, "yyyy-MM-dd"),
      longestDailyStreak: longestDailyStreak,
    };

    // =========================================================================
    // Calculate Domain Stats (This Month vs Last Month)
    // =========================================================================

    const domainStats: DomainStat[] = [];

    // Calculate last month date range
    const lastMonthDate = subMonths(targetMonthDate, 1);
    const lastMonthStart = startOfMonth(lastMonthDate);
    const lastMonthEnd = endOfMonth(lastMonthDate);
    const lastMonthTotalDays = getDaysInMonth(lastMonthDate);

    for (const domain of domains) {
      // This month completions
      const thisMonthCompletions = await prisma.completion.count({
        where: {
          domainId: domain.id,
          date: {
            gte: thisMonthStart,
            lte: effectiveMonthEnd,
          },
        },
      });

      const thisMonthRate = Math.round(
        (thisMonthCompletions / currentDay) * 100
      );

      // Last month completions
      const lastMonthCompletions = await prisma.completion.count({
        where: {
          domainId: domain.id,
          date: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      });

      const lastMonthRate = Math.round(
        (lastMonthCompletions / lastMonthTotalDays) * 100
      );

      // Calculate trend
      const trend = thisMonthRate - lastMonthRate;
      const trendDirection = trend > 0 ? "up" : trend < 0 ? "down" : "neutral";

      const thisMonth: MonthlyCompletion = {
        completed: thisMonthCompletions,
        total: currentDay,
        rate: thisMonthRate,
      };

      const lastMonth: MonthlyCompletion = {
        completed: lastMonthCompletions,
        total: lastMonthTotalDays,
        rate: lastMonthRate,
      };

      domainStats.push({
        id: domain.id,
        name: domain.name,
        color: domain.color,
        thisMonth,
        lastMonth,
        trend,
        trendDirection,
      });
    }

    // =========================================================================
    // Calculate Weekly Data for Bar Chart
    // =========================================================================

    const weeklyData: WeeklyData[] = [];
    const numberOfWeeks = Math.ceil(currentDay / 7);

    for (let weekNum = 1; weekNum <= numberOfWeeks; weekNum++) {
      const weekStartDay = (weekNum - 1) * 7 + 1;
      const weekEndDay = Math.min(weekNum * 7, currentDay);

      const weekStart = startOfDay(
        new Date(targetYear, targetMonth - 1, weekStartDay)
      );
      const weekEnd = endOfDay(
        new Date(targetYear, targetMonth - 1, weekEndDay)
      );

      const weekData: WeeklyData = {
        week: `Week ${weekNum}`,
        weekNumber: weekNum,
        dateRange: `${format(weekStart, "MMM")} ${weekStartDay}-${weekEndDay}`,
      };

      // Count completions for each domain in this week
      for (const domain of domains) {
        const completionsInWeek = await prisma.completion.count({
          where: {
            domainId: domain.id,
            date: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
        });

        weekData[domain.name] = completionsInWeek;
      }

      weeklyData.push(weekData);
    }

    // =========================================================================
    // Return Response
    // =========================================================================

    return NextResponse.json({
      allTime,
      currentMonth: monthInfo,
      domainStats,
      weeklyData,
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
