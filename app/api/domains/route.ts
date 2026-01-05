import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

// GET /api/domains - Get all domains for the authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const domains = await prisma.domain.findMany({
      where: {
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
      orderBy: {
        createdAt: "asc",
      },
    });

    // Transform to match frontend types (DateTime to ISO string, icon to emoji, add stats)
    const transformedDomains = domains.map((domain) => ({
      id: domain.id,
      name: domain.name,
      color: domain.color,
      emoji: domain.icon, // Map icon field to emoji for frontend
      createdAt: format(domain.createdAt, "yyyy-MM-dd"),
      totalCompletions: domain._count.completions,
      currentStreak: domain.streaks?.[0]?.currentStreak || 0,
    }));

    return NextResponse.json(transformedDomains);
  } catch (error) {
    console.error("GET /api/domains error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/domains - Create a new domain
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, color, icon } = await req.json();

    if (!name || !color || !icon) {
      return NextResponse.json(
        { error: "Name, color, and icon are required" },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length > 30) {
      return NextResponse.json(
        { error: "Name must be 30 characters or less" },
        { status: 400 }
      );
    }

    // Check domain limit (max 10 domains per user)
    const domainCount = await prisma.domain.count({
      where: {
        userId: session.user.id,
      },
    });

    if (domainCount >= 10) {
      return NextResponse.json(
        {
          error:
            "Maximum 10 domains reached. Delete a domain to add a new one.",
        },
        { status: 400 }
      );
    }

    // Check for duplicate name (case-insensitive)
    const existingDomain = await prisma.domain.findFirst({
      where: {
        userId: session.user.id,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingDomain) {
      return NextResponse.json(
        { error: "A domain with this name already exists" },
        { status: 400 }
      );
    }

    // Create domain and streak record in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const domain = await tx.domain.create({
        data: {
          userId: session.user.id,
          name,
          color,
          icon,
        },
      });

      // Auto-create streak record
      await tx.streak.create({
        data: {
          domainId: domain.id,
          currentStreak: 0,
          longestStreak: 0,
        },
      });

      return domain;
    });

    // Transform to match frontend types (icon to emoji)
    const transformedDomain = {
      id: result.id,
      name: result.name,
      color: result.color,
      emoji: result.icon,
      createdAt: format(result.createdAt, "yyyy-MM-dd"),
      totalCompletions: 0,
      currentStreak: 0,
    };

    return NextResponse.json(transformedDomain, { status: 201 });
  } catch (error) {
    console.error("POST /api/domains error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
