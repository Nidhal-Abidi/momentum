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
import { format } from "date-fns";

// Helper function to get days in a month
function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

// Helper function to format date range for week
function formatDateRange(
  year: number,
  month: number,
  startDay: number,
  endDay: number
): string {
  const monthNames = [
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
  const monthName = monthNames[month - 1];
  return `${monthName} ${startDay}-${endDay}`;
}

// GET /api/analytics - Get analytics data
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const today = new Date();
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

    if (domains.length === 0) {
      // Return empty state for users with no domains
      const monthInfo: MonthInfo = {
        displayName: new Date(targetYear, targetMonth - 1).toLocaleDateString(
          "en-US",
          { month: "long", year: "numeric" }
        ),
        year: targetYear,
        month: targetMonth,
        currentDay:
          targetMonth === today.getMonth() + 1 &&
          targetYear === today.getFullYear()
            ? today.getDate()
            : getDaysInMonth(targetMonth, targetYear),
      };

      return NextResponse.json({
        allTime: {
          totalDaysTracked: 0,
          overallCompletionRate: 0,
          accountStartDate: format(user.createdAt, "yyyy-MM-dd"),
          accountAgeDays: Math.floor(
            (today.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
          ),
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

    const accountAgeDays = Math.floor(
      (today.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate overall completion rate
    // Total possible completions = number of domains * days since account creation
    const totalPossibleCompletions =
      domains.length * Math.max(accountAgeDays, 1);
    const overallCompletionRate = Math.round(
      (totalCompletions / totalPossibleCompletions) * 100
    );

    const allTime: AllTimeStats = {
      totalDaysTracked: totalCompletions,
      overallCompletionRate: overallCompletionRate,
      accountStartDate: format(user.createdAt, "yyyy-MM-dd"),
      accountAgeDays: accountAgeDays,
    };

    // =========================================================================
    // Calculate Month Info
    // =========================================================================

    const isCurrentMonth =
      targetMonth === today.getMonth() + 1 &&
      targetYear === today.getFullYear();
    const currentDay = isCurrentMonth
      ? today.getDate()
      : getDaysInMonth(targetMonth, targetYear);

    const monthInfo: MonthInfo = {
      displayName: new Date(targetYear, targetMonth - 1).toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" }
      ),
      year: targetYear,
      month: targetMonth,
      currentDay: currentDay,
    };

    // =========================================================================
    // Calculate Domain Stats (This Month vs Last Month)
    // =========================================================================

    const domainStats: DomainStat[] = [];

    // Calculate last month
    const prevMonth = targetMonth === 1 ? 12 : targetMonth - 1;
    const prevMonthYear = targetMonth === 1 ? targetYear - 1 : targetYear;
    const prevMonthDays = getDaysInMonth(prevMonth, prevMonthYear);

    for (const domain of domains) {
      // This month range
      const thisMonthStart = new Date(targetYear, targetMonth - 1, 1);
      const thisMonthEnd = new Date(
        targetYear,
        targetMonth - 1,
        currentDay,
        23,
        59,
        59
      );

      // Adjust for domains created mid-month
      const domainCreatedAt = new Date(domain.createdAt);
      const effectiveThisMonthStart =
        domainCreatedAt > thisMonthStart ? domainCreatedAt : thisMonthStart;

      // Count this month completions
      const thisMonthCompletions = await prisma.completion.count({
        where: {
          domainId: domain.id,
          date: {
            gte: effectiveThisMonthStart,
            lte: thisMonthEnd,
          },
        },
      });

      // Calculate total days for this month (considering domain creation date)
      let thisMonthTotalDays = currentDay;
      if (domainCreatedAt > thisMonthStart) {
        const domainStartDay = domainCreatedAt.getDate();
        if (
          domainCreatedAt.getMonth() + 1 === targetMonth &&
          domainCreatedAt.getFullYear() === targetYear
        ) {
          thisMonthTotalDays = currentDay - domainStartDay + 1;
        }
      }
      thisMonthTotalDays = Math.max(thisMonthTotalDays, 1); // At least 1 day

      const thisMonthRate = Math.round(
        (thisMonthCompletions / thisMonthTotalDays) * 100
      );

      // Last month range
      const lastMonthStart = new Date(prevMonthYear, prevMonth - 1, 1);
      const lastMonthEnd = new Date(
        prevMonthYear,
        prevMonth - 1,
        prevMonthDays,
        23,
        59,
        59
      );

      // Adjust for domains created during last month
      const effectiveLastMonthStart =
        domainCreatedAt > lastMonthStart ? domainCreatedAt : lastMonthStart;

      // Count last month completions
      const lastMonthCompletions = await prisma.completion.count({
        where: {
          domainId: domain.id,
          date: {
            gte: effectiveLastMonthStart,
            lte: lastMonthEnd,
          },
        },
      });

      // Calculate total days for last month (considering domain creation date)
      let lastMonthTotalDays = prevMonthDays;
      if (domainCreatedAt > lastMonthStart && domainCreatedAt <= lastMonthEnd) {
        const domainStartDay = domainCreatedAt.getDate();
        lastMonthTotalDays = prevMonthDays - domainStartDay + 1;
      } else if (domainCreatedAt > lastMonthEnd) {
        // Domain didn't exist last month
        lastMonthTotalDays = 0;
      }
      lastMonthTotalDays = Math.max(lastMonthTotalDays, 1); // At least 1 day for calculation

      const lastMonthRate =
        lastMonthTotalDays > 0
          ? Math.round((lastMonthCompletions / lastMonthTotalDays) * 100)
          : 0;

      // Calculate trend
      const trend = thisMonthRate - lastMonthRate;
      const trendDirection = trend > 0 ? "up" : trend < 0 ? "down" : "neutral";

      const thisMonth: MonthlyCompletion = {
        completed: thisMonthCompletions,
        total: thisMonthTotalDays,
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
    const totalDaysInMonth = getDaysInMonth(targetMonth, targetYear);
    const daysToProcess = isCurrentMonth ? currentDay : totalDaysInMonth;

    // Split month into 7-day chunks (Week 1: 1-7, Week 2: 8-14, etc.)
    const numberOfWeeks = Math.ceil(daysToProcess / 7);

    for (let weekNum = 1; weekNum <= numberOfWeeks; weekNum++) {
      const weekStartDay = (weekNum - 1) * 7 + 1;
      const weekEndDay = Math.min(weekNum * 7, daysToProcess);

      const weekStart = new Date(targetYear, targetMonth - 1, weekStartDay);
      const weekEnd = new Date(
        targetYear,
        targetMonth - 1,
        weekEndDay,
        23,
        59,
        59
      );

      const weekData: WeeklyData = {
        week: `Week ${weekNum}`,
        weekNumber: weekNum,
        dateRange: formatDateRange(
          targetYear,
          targetMonth,
          weekStartDay,
          weekEndDay
        ),
      };

      // Count completions for each domain in this week
      for (const domain of domains) {
        const domainCreatedAt = new Date(domain.createdAt);
        const effectiveWeekStart =
          domainCreatedAt > weekStart ? domainCreatedAt : weekStart;

        // Only count if domain existed during this week
        if (domainCreatedAt <= weekEnd) {
          const completionsInWeek = await prisma.completion.count({
            where: {
              domainId: domain.id,
              date: {
                gte: effectiveWeekStart,
                lte: weekEnd,
              },
            },
          });

          weekData[domain.name] = completionsInWeek;
        } else {
          weekData[domain.name] = 0;
        }
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
