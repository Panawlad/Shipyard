// src/app/api/profiles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Roles que tu UI entiende */
type Role =
  | "Builder"
  | "Founder"
  | "Developer"
  | "Designer"
  | "Investor"
  | "Marketer"
  | "ContentCreator"
  | "Mentor"
  | "Legal"
  | "Other";

/** Lo que consume el front */
type ApiProfile = {
  handle: string;
  name: string;
  role: Role;
  avatar: string;
  bio?: string;
  location?: string;
  available?: boolean;
  hiring?: boolean;
  investing?: boolean;
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
  "ContentCreator",
  "Mentor",
  "Legal",
  "Other",
]);

/** Acepta etiquetas en español y devuelve el Role interno */
function normalizeRole(input: unknown): Role {
  const raw = String(input ?? "").trim();
  const map: Record<string, Role> = {
    // ES -> EN
    Desarrollador: "Developer",
    Diseñador: "Designer",
    Inversionista: "Investor",
    "Creador de contenido": "ContentCreator",
    "Creador de Contenido": "ContentCreator",
    Otro: "Other",
    // EN passthrough
    Builder: "Builder",
    Founder: "Founder",
    Developer: "Developer",
    Designer: "Designer",
    Investor: "Investor",
    Marketer: "Marketer",
    ContentCreator: "ContentCreator",
    Mentor: "Mentor",
    Legal: "Legal",
    Other: "Other",
  };
  const candidate = (map[raw] ?? raw) as Role;
  return VALID_ROLES.has(candidate) ? candidate : "Developer";
}

/** Normaliza string|array a string[] */
function normalizeTags(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v.map((s) => String(s).trim()).filter(Boolean).slice(0, 30);
  }
  if (typeof v === "string") {
    return v.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 30);
  }
  return [];
}

/** Prefija http(s) si no viene; devuelve undefined si está vacío */
function normalizeUrl(v: unknown): string | undefined {
  const s = String(v ?? "").trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

function errMsg(e: unknown) {
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

function mapDbToApi(p: {
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  category: string | null;
  skills: string[] | null;
  bio: string | null;
  location: string | null;
  available: boolean | null;
  hiring: boolean | null;
  investing: boolean | null;
  linkedin: string | null;
  x: string | null;
  calendly: string | null;
  telegram: string | null;
  discord: string | null;
}): ApiProfile {
  return {
    handle: p.username ?? "",
    name: p.fullName ?? "",
    avatar: p.avatarUrl ?? "",
    role: (p.category as Role) ?? "Developer",
    tags: Array.isArray(p.skills) ? p.skills : [],
    bio: p.bio ?? undefined,
    location: p.location ?? undefined,
    available: p.available ?? undefined,
    hiring: p.hiring ?? undefined,
    investing: p.investing ?? undefined,
    linkedin: p.linkedin ?? undefined,
    x: p.x ?? undefined,
    calendly: p.calendly ?? undefined,
    telegram: p.telegram ?? undefined,
    discord: p.discord ?? undefined,
  };
}

const SELECT = {
  username: true,
  fullName: true,
  avatarUrl: true,
  category: true,
  skills: true,
  bio: true,
  location: true,
  available: true,
  hiring: true,
  investing: true,
  linkedin: true,
  x: true,
  calendly: true,
  telegram: true,
  discord: true,
} as const;

/* --------------------------------------
   CREAR (solo si no existe, ligado a userId)
--------------------------------------- */
export async function POST(req: Request) {
  try {
    // Requiere sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = (await req.json()) as Record<string, unknown>;

    const handle = String(body.username ?? "").trim();
    const name = String(body.fullName ?? "").trim();
    if (!handle) return NextResponse.json({ error: "El username es obligatorio." }, { status: 400 });
    if (!name)   return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });

    // Si ya tiene perfil, no crear otro
    const already = await prisma.profile.findUnique({
      where: { userId },
      select: { userId: true },
    });
    if (already) {
      return NextResponse.json(
        { error: "Ya existe un perfil para este usuario. Usa PATCH para editar." },
        { status: 409 }
      );
    }

    const created = await prisma.profile.create({
      data: {
        userId,
        username: handle,
        fullName: name,
        avatarUrl: String(body.avatarUrl ?? "").trim(),
        category: normalizeRole(body.category),
        skills: normalizeTags(body.skills),
        bio: String(body.bio ?? "").trim() || undefined,
        location: String(body.location ?? "").trim() || undefined,
        available: Boolean(body.available),
        hiring: Boolean(body.hiring),
        investing: Boolean(body.investing),
        linkedin: normalizeUrl(body.linkedin),
        x: normalizeUrl(body.x),
        calendly: normalizeUrl(body.calendly),
        telegram: String(body.telegram ?? "").trim() || undefined,
        discord: String(body.discord ?? "").trim() || undefined,
      },
      select: SELECT,
    });

    return NextResponse.json({ item: mapDbToApi(created) }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

/* --------------------------------------
   EDITAR (PATCH por userId de la sesión)
--------------------------------------- */
export async function PATCH(req: Request) {
  try {
    // Requiere sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = (await req.json()) as Record<string, unknown>;

    const handle = String(body.username ?? "").trim();
    const name   = String(body.fullName ?? "").trim();
    if (!handle) return NextResponse.json({ error: "El username es obligatorio." }, { status: 400 });
    if (!name)   return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });

    const data = {
      username: handle,
      fullName: name,
      avatarUrl: String(body.avatarUrl ?? "").trim(),
      category: normalizeRole(body.category),
      skills: normalizeTags(body.skills),
      bio: String(body.bio ?? "").trim() || undefined,
      location: String(body.location ?? "").trim() || undefined,
      available: Boolean(body.available),
      hiring: Boolean(body.hiring),
      investing: Boolean(body.investing),
      linkedin: normalizeUrl(body.linkedin),
      x: normalizeUrl(body.x),
      calendly: normalizeUrl(body.calendly),
      telegram: String(body.telegram ?? "").trim() || undefined,
      discord: String(body.discord ?? "").trim() || undefined,
    };

    // Upsert por userId (no por username)
    const saved = await prisma.profile.upsert({
      where: { userId },                // requiere @unique en Prisma
      update: data,
      create: { userId, ...data },
      select: SELECT,
    });

    return NextResponse.json({ item: mapDbToApi(saved) }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
