import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
      orderBy: {
        createdAt: "asc",
      },
    });

    // Transform to match frontend types (DateTime to ISO string)
    const transformedDomains = domains.map((domain) => ({
      id: domain.id,
      name: domain.name,
      color: domain.color,
      icon: domain.icon,
      createdAt: domain.createdAt.toISOString(),
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

    const domain = await prisma.domain.create({
      data: {
        userId: session.user.id,
        name,
        color,
        icon,
      },
    });

    // Transform to match frontend types
    const transformedDomain = {
      id: domain.id,
      name: domain.name,
      color: domain.color,
      icon: domain.icon,
      createdAt: domain.createdAt.toISOString(),
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
