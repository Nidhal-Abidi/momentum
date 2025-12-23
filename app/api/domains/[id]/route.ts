import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
    });

    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    const transformedDomain = {
      id: domain.id,
      name: domain.name,
      color: domain.color,
      icon: domain.icon,
      createdAt: domain.createdAt.toISOString(),
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

    const domain = await prisma.domain.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color && { color }),
        ...(icon && { icon }),
      },
    });

    const transformedDomain = {
      id: domain.id,
      name: domain.name,
      color: domain.color,
      icon: domain.icon,
      createdAt: domain.createdAt.toISOString(),
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

