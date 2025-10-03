// src/app/directory/page.tsx
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import { PROFILES } from "@/lib/mock";
import type { Profile } from "@/types/profile";

/**
 * Estructura que devuelve tu API (/api/profiles/list).
 * Ajusta los nombres si tu route devuelve otros campos.
 */
type APIProfile = {
  id: string;
  username: string;
  fullName: string;
  category?: string | null; // p.ej. "Developer", "Founder", etc.
  bio: string;
  avatarUrl?: string | null;
  location?: string | null;
  skills?: string | null;   // "Solidity, React, DeFi"
  available?: boolean | null;
};

/**
 * El handler /api/profiles/list devuelve { items: APIProfile[] }
 */
type APIResponse = {
  items: APIProfile[];
};

/**
 * Normaliza un APIProfile a tu shape local Profile
 * para que <ProfileCard {...p} /> siga funcionando igual.
 * Si tu tipo Profile tiene otros nombres, ajústalos aquí.
 */
function normalize(item: APIProfile): Profile {
  const tags =
    item.skills
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  // Rellenamos tanto role como title por compatibilidad
  const role = item.category ?? "Member";
  const title = role;

  const mapped = {
    name: item.fullName,
    handle: `@${item.username}`,
    role,            // <- si tu Profile espera 'role'
    title,           // <- si tu Profile espera 'title'
    bio: item.bio,
    avatar: item.avatarUrl ?? "/brand/shipyard-logo.svg",
    location: item.location ?? "",
    tags,
    available: Boolean(item.available),
  };

  // Si tu tipo Profile necesita más props, añádelas aquí:
  return mapped as Profile;
}

async function fetchProfiles(): Promise<Profile[]> {
  try {
    // Usar ruta relativa funciona en SSR y en producción
    const res = await fetch("/api/profiles/list", { cache: "no-store" });
    if (!res.ok) throw new Error("Bad response");

    const data: APIResponse = await res.json();
    return data.items.map(normalize);
  } catch {
    // Fallback a mock en dev/si falla la API
    return PROFILES as Profile[];
  }
}

export default async function DirectoryPage() {
  const items = await fetchProfiles();

  return (
    <>
      <Navbar />
      <main className="wrap pb-24">
        {/* Header */}
        <div className="pt-8 pb-6">
          <h2 className="text-3xl font-bold">Crypto Hub Directory</h2>
          <p className="text-white/60">Descubre y conecta con profesionales cripto.</p>
          <p className="text-white/40 text-sm mt-1">
            Mostrando {items.length} perfil{items.length === 1 ? "" : "es"}.
          </p>
        </div>

        {/* Barra de filtros (decorativa por ahora) */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <input
            placeholder="Busca por nombre, skills, ubicación…"
            className="flex-1 bg-transparent outline-none px-3 py-2 rounded-xl border border-white/10 focus:border-[color:var(--brand-neon)]/40"
          />
          <select className="bg-transparent outline-none px-3 py-2 rounded-xl border border-white/10">
            <option className="bg-[#0B1324]">Todos</option>
            <option className="bg-[#0B1324]">Builders</option>
            <option className="bg-[#0B1324]">Developers</option>
            <option className="bg-[#0B1324]">Designers</option>
            <option className="bg-[#0B1324]">Investors</option>
            <option className="bg-[#0B1324]">Marketers</option>
          </select>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-[color:var(--brand-neon)]" />
            Solo disponibles
          </label>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {items.map((p) => (
            <ProfileCard key={p.handle} {...p} />
          ))}
          {!items.length && (
            <div className="text-white/70">Aún no hay perfiles.</div>
          )}
        </div>
      </main>
    </>
  );
}
