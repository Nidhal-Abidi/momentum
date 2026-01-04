import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/goals - Get all goals for user's domains
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: {
        domain: {
          userId: session.user.id,
        },
      },
    });

    // Transform to match frontend types
    const transformedGoals = goals.map((goal) => ({
      id: goal.id,
      domainId: goal.domainId,
      targetDays: goal.targetDays,
      totalDays: goal.totalDays,
      motivationNote: goal.motivationNote || "",
    }));

    return NextResponse.json(transformedGoals);
  } catch (error) {
    console.error("GET /api/goals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/goals - Create or update a goal for a domain
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domainId, targetDays, totalDays = 7, motivationNote = "" } = await req.json();

    if (!domainId || targetDays === undefined) {
      return NextResponse.json(
        { error: "Domain ID and target days are required" },
        { status: 400 }
      );
    }

    // Validate target days
    if (targetDays < 1 || targetDays > totalDays) {
      return NextResponse.json(
        { error: `Target days must be between 1 and ${totalDays}` },
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

    // Upsert the goal (create or update if exists)
    const goal = await prisma.goal.upsert({
      where: {
        domainId,
      },
      update: {
        targetDays,
        totalDays,
        motivationNote,
      },
      create: {
        domainId,
        targetDays,
        totalDays,
        motivationNote,
      },
    });

    const transformedGoal = {
      id: goal.id,
      domainId: goal.domainId,
      targetDays: goal.targetDays,
      totalDays: goal.totalDays,
      motivationNote: goal.motivationNote || "",
    };

    return NextResponse.json(transformedGoal, { status: 201 });
  } catch (error) {
    console.error("POST /api/goals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

