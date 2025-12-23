import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/goals/[id] - Update a goal
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
    const { targetDays, totalDays } = await req.json();

    // Verify the goal belongs to a domain owned by the user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        domain: {
          userId: session.user.id,
        },
      },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Validate target days if provided
    const finalTotalDays = totalDays ?? existingGoal.totalDays;
    const finalTargetDays = targetDays ?? existingGoal.targetDays;

    if (finalTargetDays < 1 || finalTargetDays > finalTotalDays) {
      return NextResponse.json(
        { error: `Target days must be between 1 and ${finalTotalDays}` },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        ...(targetDays !== undefined && { targetDays }),
        ...(totalDays !== undefined && { totalDays }),
      },
    });

    const transformedGoal = {
      id: goal.id,
      domainId: goal.domainId,
      targetDays: goal.targetDays,
      totalDays: goal.totalDays,
    };

    return NextResponse.json(transformedGoal);
  } catch (error) {
    console.error("PATCH /api/goals/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/goals/[id] - Delete a goal
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the goal belongs to a domain owned by the user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        domain: {
          userId: session.user.id,
        },
      },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/goals/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

