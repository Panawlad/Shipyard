import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      fullName: true,
      avatarUrl: true,
      bio: true,
      category: true,
      skills: true,
      location: true,
      available: true,
    },
  });
  return NextResponse.json({ items });
}
