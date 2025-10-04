// src/app/api/profiles/me/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const p = await prisma.profile.findUnique({
    where: { userId },
    select: {
      username: true, fullName: true, avatarUrl: true, bio: true,
      category: true, skills: true, location: true,
      x: true, linkedin: true, calendly: true, telegram: true, discord: true,
      available: true, hiring: true, investing: true,
    },
  });

  if (!p) return NextResponse.json({ exists: false });

  // adapta al shape que usa el front en Directory
  return NextResponse.json({
    exists: true,
    profile: {
      handle: p.username,
      name: p.fullName,
      avatar: p.avatarUrl,
      bio: p.bio,
      role: p.category,
      tags: Array.isArray(p.skills) ? p.skills : [],
      location: p.location,
      x: p.x, linkedin: p.linkedin, calendly: p.calendly,
      telegram: p.telegram, discord: p.discord,
      available: p.available, hiring: p.hiring, investing: p.investing,
    },
  });
}
