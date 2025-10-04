// src/app/api/profiles/me/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Role =
  | "Builder" | "Founder" | "Developer" | "Designer"
  | "Investor" | "Marketer" | "ContentCreator" | "Other";

const VALID: ReadonlySet<Role> = new Set([
  "Builder","Founder","Developer","Designer","Investor","Marketer","ContentCreator","Other",
]);

function roleOf(v: unknown): Role {
  const raw = String(v ?? "").trim();
  const map: Record<string, Role> = {
    Desarrollador: "Developer",
    Diseñador: "Designer",
    Inversionista: "Investor",
    "Creador de contenido": "ContentCreator",
    "Creador de Contenido": "ContentCreator",
    Otro: "Other",
    Builder:"Builder", Founder:"Founder", Developer:"Developer", Designer:"Designer",
    Investor:"Investor", Marketer:"Marketer", ContentCreator:"ContentCreator", Other:"Other",
  };
  const r = (map[raw] ?? raw) as Role;
  return VALID.has(r) ? r : "Developer";
}
function tagsOf(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(s => String(s).trim()).filter(Boolean).slice(0, 30);
  if (typeof v === "string") return v.split(",").map(s => s.trim()).filter(Boolean).slice(0, 30);
  return [];
}
function urlOrUndef(v: unknown) {
  const s = String(v ?? "").trim();
  if (!s) return undefined;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ exists: false }, { status: 401 });

  const p = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      username: true, fullName: true, avatarUrl: true, bio: true,
      category: true, skills: true, location: true,
      x: true, linkedin: true, calendly: true, telegram: true, discord: true,
      available: true, hiring: true, investing: true,
    },
  });

  if (!p) return NextResponse.json({ exists: false });

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

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const body = await req.json() as Record<string, unknown>;

  const handle = String(body.username ?? "").trim();
  const name   = String(body.fullName ?? "").trim();
  if (!handle) return NextResponse.json({ error: "El username es obligatorio." }, { status: 400 });
  if (!name)   return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });

  const data = {
    username: handle,
    fullName: name,
    avatarUrl: String(body.avatarUrl ?? "").trim(),
    category: roleOf(body.category),
    skills:   tagsOf(body.skills),
    bio:      String(body.bio ?? "").trim() || undefined,
    location: String(body.location ?? "").trim() || undefined,
    available: Boolean(body.available),
    hiring:    Boolean(body.hiring),
    investing: Boolean(body.investing),
    linkedin:  urlOrUndef(body.linkedin),
    x:         urlOrUndef(body.x),
    calendly:  urlOrUndef(body.calendly),
    telegram:  String(body.telegram ?? "").trim() || undefined,
    discord:   String(body.discord ?? "").trim() || undefined,
  };

  // upsert POR userId (no por username)
  const saved = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: data,
    create: { userId: session.user.id, ...data },
    select: {
      username: true, fullName: true, avatarUrl: true, category: true, skills: true,
      bio: true, location: true, available: true, hiring: true, investing: true,
      linkedin: true, x: true, calendly: true, telegram: true, discord: true,
    },
  });

  return NextResponse.json({ item: saved });
}
