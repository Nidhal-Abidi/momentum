import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

// GET /api/domains/[id] - Get a single domain
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const domain = await prisma.domain.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            completions: true,
          },
        },
        streaks: {
          select: {
            currentStreak: true,
          },
        },
      },
    });

    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    const transformedDomain = {
      id: domain.id,
      name: domain.name,
      color: domain.color,
      emoji: domain.icon, // Map icon field to emoji for frontend
      createdAt: format(domain.createdAt, "yyyy-MM-dd"),
      totalCompletions: domain._count.completions,
      currentStreak: domain.streaks?.[0]?.currentStreak || 0,
    };

    return NextResponse.json(transformedDomain);
  } catch (error) {
    console.error("GET /api/domains/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/domains/[id] - Update a domain
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
    const { name, color, icon } = await req.json();

    // Validate name length if provided
    if (name && name.length > 30) {
      return NextResponse.json(
        { error: "Name must be 30 characters or less" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingDomain = await prisma.domain.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingDomain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    // Check for duplicate name (case-insensitive), excluding current domain
    if (name) {
      const duplicateDomain = await prisma.domain.findFirst({
        where: {
          userId: session.user.id,
          name: {
            equals: name,
            mode: "insensitive",
          },
          id: {
            not: id,
          },
        },
      });

      if (duplicateDomain) {
        return NextResponse.json(
          { error: "A domain with this name already exists" },
          { status: 400 }
        );
      }
    }

    const domain = await prisma.domain.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color && { color }),
        ...(icon && { icon }),
      },
      include: {
        _count: {
          select: {
            completions: true,
          },
        },
        streaks: {
          select: {
            currentStreak: true,
          },
        },
      },
    });

    const transformedDomain = {
      id: domain.id,
      name: domain.name,
      color: domain.color,
      emoji: domain.icon, // Map icon field to emoji for frontend
      createdAt: format(domain.createdAt, "yyyy-MM-dd"),
      totalCompletions: domain._count.completions,
      currentStreak: domain.streaks?.[0]?.currentStreak || 0,
    };

    return NextResponse.json(transformedDomain);
  } catch (error) {
    console.error("PATCH /api/domains/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/domains/[id] - Delete a domain
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

    // Verify ownership
    const existingDomain = await prisma.domain.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingDomain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    // Delete the domain (cascade will delete related completions, goals, streaks)
    await prisma.domain.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Domain deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/domains/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
