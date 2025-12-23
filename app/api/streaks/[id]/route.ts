import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/streaks/[id] - Update a streak
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { currentStreak, longestStreak } = await req.json();

    // Verify the streak belongs to a domain owned by the user
    const existingStreak = await prisma.streak.findFirst({
      where: {
        id,
        domain: {
          userId: session.user.id,
        },
      },
    });

    if (!existingStreak) {
      return NextResponse.json({ error: "Streak not found" }, { status: 404 });
    }

    const streak = await prisma.streak.update({
      where: { id },
      data: {
        ...(currentStreak !== undefined && { currentStreak }),
        ...(longestStreak !== undefined && { longestStreak }),
      },
    });

    const transformedStreak = {
      id: streak.id,
      domainId: streak.domainId,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
    };

    return NextResponse.json(transformedStreak);
  } catch (error) {
    console.error("PATCH /api/streaks/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

