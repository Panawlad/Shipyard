// src/app/api/profiles/list/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Role = "Builder" | "Founder" | "Developer" | "Designer" | "Investor" | "Marketer"| "ContentCreator"| "Other";

type Row = {
  username:  string | null;
  fullName:  string | null;
  avatarUrl: string | null;
  category:  string | null;
  skills:    string[] | string | null;

  bio:       string | null;
  location:  string | null;
  available: boolean | null;
  hiring:    boolean | null;     // ✅
  investing: boolean | null;     // ✅

  linkedin:  string | null;
  x:         string | null;
  calendly:  string | null;
  telegram:  string | null;
  discord:   string | null;
};

type ApiProfile = {
  handle: string;
  name: string;
  role: Role;
  avatar: string;
  tags: string[];

  bio?: string;
  location?: string;
  available?: boolean;
  hiring?: boolean;      // ✅
  investing?: boolean;   // ✅

  linkedin?: string;
  x?: string;
  calendly?: string;
  telegram?: string;
  discord?: string;
};

function toRole(v: string | null): Role {
  return (v ?? "Developer") as Role;
}
function toTags(v: string[] | string | null): string[] {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === "string") return v.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}
function errMsg(e: unknown) {
  if (e instanceof Error) return e.message;
  try { return JSON.stringify(e); } catch { return String(e); }
}

export async function GET() {
  try {
    const rows: Row[] = await prisma.profile.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        username: true,
        fullName: true,
        avatarUrl: true,
        category: true,
        skills: true,

        bio: true,
        location: true,
        available: true,
        hiring: true,       // ✅
        investing: true,    // ✅

        linkedin: true,
        x: true,
        calendly: true,
        telegram: true,
        discord: true,
      },
    });

    const items: ApiProfile[] = rows.map((p): ApiProfile => ({
      handle:    p.username ?? "",
      name:      p.fullName ?? "",
      avatar:    p.avatarUrl ?? "",
      role:      toRole(p.category),
      tags:      toTags(p.skills),

      bio:       p.bio ?? undefined,
      location:  p.location ?? undefined,
      available: p.available ?? undefined,
      hiring:    p.hiring ?? undefined,      // ✅
      investing: p.investing ?? undefined,   // ✅

      linkedin:  p.linkedin ?? undefined,
      x:         p.x ?? undefined,
      calendly:  p.calendly ?? undefined,
      telegram:  p.telegram ?? undefined,
      discord:   p.discord ?? undefined,
    }));

    return NextResponse.json({ items });
  } catch (e: unknown) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
