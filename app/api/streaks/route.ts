import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/streaks - Get all streaks for user's domains
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const streaks = await prisma.streak.findMany({
      where: {
        domain: {
          userId: session.user.id,
        },
      },
      include: {
        domain: true,
      },
    });

    // Transform to match frontend types
    const transformedStreaks = streaks.map((streak) => ({
      id: streak.id,
      domainId: streak.domainId,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
    }));

    return NextResponse.json(transformedStreaks);
  } catch (error) {
    console.error("GET /api/streaks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/streaks - Create or update a streak for a domain
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domainId, currentStreak, longestStreak } = await req.json();

    if (!domainId || currentStreak === undefined || longestStreak === undefined) {
      return NextResponse.json(
        { error: "Domain ID, current streak, and longest streak are required" },
        { status: 400 }
      );
    }

    // Verify the domain belongs to the user
    const domain = await prisma.domain.findFirst({
      where: {
        id: domainId,
        userId: session.user.id,
      },
    });

    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    // Upsert the streak (create or update if exists)
    const streak = await prisma.streak.upsert({
      where: {
        domainId,
      },
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

    const transformedStreak = {
      id: streak.id,
      domainId: streak.domainId,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
    };

    return NextResponse.json(transformedStreak, { status: 201 });
  } catch (error) {
    console.error("POST /api/streaks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

