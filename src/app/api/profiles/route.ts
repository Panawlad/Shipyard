// src/app/api/profiles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Roles que tu UI entiende */
type Role =
  | "Builder"
  | "Founder"
  | "Developer"
  | "Designer"
  | "Investor"
  | "Marketer";

/** Lo que consume el front (lo que espera <ProfileCard />) */
type ApiProfile = {
  handle: string;
  name: string;
  role: Role;
  avatar: string;
  bio?: string;
  location?: string;
  available?: boolean;
  tags: string[];
  linkedin?: string;
  x?: string;
  calendly?: string;
  telegram?: string;
  discord?: string;
};

const VALID_ROLES: ReadonlySet<Role> = new Set([
  "Builder",
  "Founder",
  "Developer",
  "Designer",
  "Investor",
  "Marketer",
]);

function errMsg(e: unknown) {
  if (e instanceof Error) return e.message;
  try { return JSON.stringify(e); } catch { return String(e); }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    // --- Normalización desde el form (nombres del formulario que ya usas) ---
    const handle = String(body.username ?? "").trim();
    const name = String(body.fullName ?? "").trim();
    const avatar = String(body.avatarUrl ?? "").trim();
    const bio = String(body.bio ?? "").trim();

    const rawRole = String(body.category ?? "Developer").trim();
    const role: Role = VALID_ROLES.has(rawRole as Role)
      ? (rawRole as Role)
      : "Developer";

    const location = String(body.location ?? "").trim();
    const available = Boolean(body.available);

    const rawSkills = body.skills;
    const tags: string[] =
      typeof rawSkills === "string"
        ? rawSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : Array.isArray(rawSkills)
        ? rawSkills.map((s) => String(s).trim()).filter(Boolean)
        : [];

    const linkedin = body.linkedin ? String(body.linkedin).trim() : undefined;
    const x        = body.x        ? String(body.x).trim()        : undefined;
    const calendly = body.calendly ? String(body.calendly).trim() : undefined;
    const telegram = body.telegram ? String(body.telegram).trim() : undefined;
    const discord  = body.discord  ? String(body.discord).trim()  : undefined;

    // --- Guardado (usa los nombres de columnas de tu Prisma/BD) ---
    const created = await prisma.profile.create({
      data: {
        username:  handle,      // <- a tu columna username
        fullName:  name,        // <- a tu columna fullName
        avatarUrl: avatar,      // <- a tu columna avatarUrl
        category:  role,        // <- string/enum
        skills:    tags,        // <- text[] en Postgres

        bio,
        location,
        available,

        linkedin,
        x,
        calendly,
        telegram,
        discord,
      },
      select: {
        username: true,
        fullName: true,
        avatarUrl: true,
        category: true,
        skills: true,
        bio: true,
        location: true,
        available: true,
        linkedin: true,
        x: true,
        calendly: true,
        telegram: true,
        discord: true,
      },
    });

    // --- Mapear al shape que pinta el front ---
    const item: ApiProfile = {
      handle:   created.username ?? "",
      name:     created.fullName ?? "",
      avatar:   created.avatarUrl ?? "",
      role:     (created.category as Role) ?? "Developer",
      tags:     Array.isArray(created.skills) ? created.skills : [],
      bio:      created.bio ?? undefined,
      location: created.location ?? undefined,
      available: created.available ?? undefined,
      linkedin: created.linkedin ?? undefined,
      x:        created.x ?? undefined,
      calendly: created.calendly ?? undefined,
      telegram: created.telegram ?? undefined,
      discord:  created.discord ?? undefined,
    };

    return NextResponse.json({ item }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
