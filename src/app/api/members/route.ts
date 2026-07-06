import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/members – list all members
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(members);
}

// POST /api/members – create one or many members
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  // Accept either a single object or an array
  const items: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  }[] = Array.isArray(body) ? body : [body];

  if (items.length === 0) {
    return NextResponse.json(
      { error: "No member data provided" },
      { status: 400 }
    );
  }

  const created = await prisma.$transaction(
    items.map((m) =>
      prisma.member.create({
        data: {
          name: m.name,
          email: m.email,
          phone: m.phone ?? null,
          address: m.address ?? null,
        },
      })
    )
  );

  return NextResponse.json(created, { status: 201 });
}
