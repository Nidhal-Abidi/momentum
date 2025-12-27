import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateStreakForDomain } from "@/lib/streakUtils";

// DELETE /api/completions/[id] - Delete a completion
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

    // Verify the completion belongs to a domain owned by the user
    const completion = await prisma.completion.findFirst({
      where: {
        id,
        domain: {
          userId: session.user.id,
        },
      },
    });

    if (!completion) {
      return NextResponse.json(
        { error: "Completion not found" },
        { status: 404 }
      );
    }

    // Store domainId before deletion for streak recalculation
    const domainId = completion.domainId;

    await prisma.completion.delete({
      where: { id },
    });

    // Update streak calculation after deleting completion
    await updateStreakForDomain(domainId);

    return NextResponse.json({ message: "Completion deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/completions/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
