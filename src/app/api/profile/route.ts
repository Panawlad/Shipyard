import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json(); // { username, fullName, bio, ... }
  const exists = await prisma.profile.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (exists) return NextResponse.json({ error: "Profile already exists" }, { status: 400 });

  const profile = await prisma.profile.create({
    data: { userId: user.id, ...body },
  });
  return NextResponse.json({ ok: true, profile });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const profile = await prisma.profile.update({
    where: { userId: user.id },
    data: body,
  });
  return NextResponse.json({ ok: true, profile });
}
