import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateStreakForDomain } from "@/lib/streakUtils";

// POST /api/streaks/recalculate - Recalculate streaks for one or all domains
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { domainId } = body;

    if (domainId) {
      // Recalculate for a specific domain
      // Verify the domain belongs to the user
      const domain = await prisma.domain.findFirst({
        where: {
          id: domainId,
          userId: session.user.id,
        },
      });

      if (!domain) {
        return NextResponse.json(
          { error: "Domain not found" },
          { status: 404 }
        );
      }

      // Recalculate and update streak
      const streak = await updateStreakForDomain(domainId);

      return NextResponse.json({
        domainId,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
      });
    } else {
      // Recalculate for all user's domains
      const domains = await prisma.domain.findMany({
        where: { userId: session.user.id },
        include: { goals: true },
      });

      // Only recalculate for domains that have goals
      const domainsWithGoals = domains.filter((d) => d.goals.length > 0);

      const results = await Promise.all(
        domainsWithGoals.map(async (domain) => {
          const streak = await updateStreakForDomain(domain.id);
          return {
            domainId: domain.id,
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
          };
        })
      );

      return NextResponse.json({
        recalculated: results.length,
        streaks: results,
      });
    }
  } catch (error) {
    console.error("POST /api/streaks/recalculate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

