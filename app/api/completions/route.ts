import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/completions - Get completions (optionally filtered by domain or date range)
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const domainId = searchParams.get("domainId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build query conditions
    const where: any = {
      domain: {
        userId: session.user.id,
      },
    };

    if (domainId) {
      where.domainId = domainId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const completions = await prisma.completion.findMany({
      where,
      orderBy: {
        date: "desc",
      },
    });

    // Transform to match frontend types
    const transformedCompletions = completions.map((completion) => ({
      id: completion.id,
      domainId: completion.domainId,
      date: completion.date.toISOString().split("T")[0], // YYYY-MM-DD format
    }));

    return NextResponse.json(transformedCompletions);
  } catch (error) {
    console.error("GET /api/completions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/completions - Create a new completion
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domainId, date } = await req.json();

    if (!domainId || !date) {
      return NextResponse.json(
        { error: "Domain ID and date are required" },
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

    // Check if completion already exists for this domain and date
    const existingCompletion = await prisma.completion.findUnique({
      where: {
        domainId_date: {
          domainId,
          date: new Date(date),
        },
      },
    });

    if (existingCompletion) {
      return NextResponse.json(
        { error: "Completion already exists for this date" },
        { status: 400 }
      );
    }

    const completion = await prisma.completion.create({
      data: {
        domainId,
        date: new Date(date),
      },
    });

    const transformedCompletion = {
      id: completion.id,
      domainId: completion.domainId,
      date: completion.date.toISOString().split("T")[0],
    };

    return NextResponse.json(transformedCompletion, { status: 201 });
  } catch (error) {
    console.error("POST /api/completions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

