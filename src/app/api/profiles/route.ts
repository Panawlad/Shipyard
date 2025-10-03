import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3).max(32),
  fullName: z.string().min(2),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().min(10),
  category: z.enum(["Builder","Founder","Developer","Designer","Investor","Marketer"]),
  skills: z.string().optional().or(z.literal("")),
  location: z.string().min(2),
  x: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  calendly: z.string().optional().or(z.literal("")),
  telegram: z.string().optional().or(z.literal("")),
  discord: z.string().optional().or(z.literal("")),
  available: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const upserted = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        ...data,
        avatarUrl: data.avatarUrl || null,
        skills: data.skills || null,
        x: data.x || null,
        linkedin: data.linkedin || null,
        calendly: data.calendly || null,
        telegram: data.telegram || null,
        discord: data.discord || null,
      },
      create: {
        userId: session.user.id,
        ...data,
        avatarUrl: data.avatarUrl || null,
        skills: data.skills || null,
        x: data.x || null,
        linkedin: data.linkedin || null,
        calendly: data.calendly || null,
        telegram: data.telegram || null,
        discord: data.discord || null,
      },
      select: { id: true, username: true },
    });

    return NextResponse.json({ ok: true, profile: upserted });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Invalid payload";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
