"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import type { Profile } from "@/types/profile";

type ApiListResponse = { items?: Profile[]; error?: string };

/** Clave estable para cada card: usa handle y de respaldo name+location+index */
function profileKey(p: Profile, idx: number): string {
  const base = p.handle || `${p.name ?? "profile"}-${p.location ?? ""}`;
  return `${base}-${idx}`;
}

export default function DirectoryPage() {
  // filtros
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // datos crudos del server
  const [items, setItems] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // modal
  const [selected, setSelected] = useState<Profile | null>(null);

  // --- carga inicial (sin depender de que el endpoint filtre) ---
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch("/api/profiles/list", { cache: "no-store" });
        const data: ApiListResponse = await res.json();
        if (!res.ok) throw new Error(data?.error || "Error cargando perfiles");

        // Normaliza tags
        const normalized: Profile[] = (data.items ?? []).map((p) => ({
          ...p,
          tags: Array.isArray(p.tags) ? p.tags : [],
        }));

        if (!cancelled) setItems(normalized);
      } catch (e: unknown) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // --- filtrado en cliente: texto, rol, disponibles ---
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((p) => {
      if (onlyAvailable && !p.available) return false;
      if (role !== "all" && p.role !== role) return false;
      if (!needle) return true;

      const haystack = [
        p.name ?? "",
        p.handle ?? "",
        p.bio ?? "",
        p.location ?? "",
        ...(p.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [items, q, role, onlyAvailable]);

  return (
    <>
      <Navbar />

      {/* decorativos brand */}
      <img
        src="/assets/shipyard/cactus1.svg"
        alt=""
        aria-hidden
        className="pointer-events-none select-none fixed -left-24 top-16 w-[420px] opacity-[.10] hidden md:block"
      />
      <img
        src="/assets/shipyard/cactus2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none select-none fixed -right-24 bottom-10 w-[460px] opacity-[.12] hidden md:block"
      />

      <main className="max-w-7xl mx-auto px-6 pb-24 relative">
        <div className="pt-8 pb-6">
          <h2 className="text-3xl font-bold">
            Shipyard <span className="text-[color:var(--brand-neon)]">HUB</span>
          </h2>
          <p className="text-white/60">
            Explora el directorio de talento del ecosistema. Encuentra skills, conecta con builders y lleva tu proyecto más lejos.
          </p>
        </div>

        {/* Filtros */}
        <div
          className="rounded-2xl border border-[color:var(--brand-neon)]/15 p-4 flex flex-col md:flex-row gap-3 md:items-center"
          style={{
            background:
              "color-mix(in oklab, var(--brand-neon) 10%, var(--brand-dark))",
          }}
        >
          <input
            placeholder="Busca por nombre, skills, ubicación…"
            className="flex-1 bg-transparent outline-none px-3 py-2 rounded-xl border border-white/10 focus:ring-2 focus:ring-[color:var(--brand-neon)]/40 focus:border-[color:var(--brand-neon)]/40"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="relative">
            <select
              className="appearance-none bg-transparent outline-none px-3 py-2 rounded-xl border border-white/10 focus:ring-2 focus:ring-[color:var(--brand-neon)]/40 focus:border-[color:var(--brand-neon)]/40 pr-8"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="all" className="bg-[color:var(--brand-dark)]">
                Todos
              </option>
              <option value="Builder" className="bg-[color:var(--brand-dark)]">
                Builders
              </option>
              <option value="Developer" className="bg-[color:var(--brand-dark)]">
                Desarrollador
              </option>
              <option value="Designer" className="bg-[color:var(--brand-dark)]">
                Diseñadores
              </option>
              <option value="Founder" className="bg-[color:var(--brand-dark)]">
                Founders
              </option>
              <option value="Investor" className="bg-[color:var(--brand-dark)]">
                Inversionistas
              </option>
              <option value="Marketer" className="bg-[color:var(--brand-dark)]">
                Marketers
              </option>
              <option value="ContentCreator" className="bg-[color:var(--brand-dark)]">
                Creador de contenido
              </option>
              <option value="Mentor" className="bg-[color:var(--brand-dark)]">
                Mentor
              </option>
              <option value="Legal" className="bg-[color:var(--brand-dark)]">
                Legal
              </option>
              <option value="Other" className="bg-[color:var(--brand-dark)]">
                Otro
              </option>
            </select>
            {/* flecha */}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
              ▾
            </span>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-[color:var(--brand-neon)]"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            Solo disponibles
          </label>
        </div>

        {/* Estado */}
        {err && <p className="mt-4 text-red-400 text-sm">{err}</p>}
        {loading && <p className="mt-4 text-white/60 text-sm">Cargando…</p>}

        {/* Resultados */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((p, i) => (
            <ProfileCard key={profileKey(p, i)} {...p} onClick={setSelected} />
          ))}
        </div>

        {!loading && !err && filtered.length === 0 && (
          <p className="mt-6 text-white/60 text-sm">
            No encontramos perfiles con esos filtros.
          </p>
        )}

        {/* MODAL (expandir card) */}
        {selected && (
          <>
            {/* Glow verde sutil detrás */}
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 z-40"
              style={{
                background:
                  "radial-gradient(600px 300px at 50% 20%, rgba(0,245,160,0.10), transparent 60%)",
                filter: "blur(20px)",
              }}
            />
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelected(null)}
            />
            <div
              role="dialog"
              aria-modal="true"
              className="fixed z-50 inset-0 grid place-items-center px-6"
            >
              <div
                className="w-full max-w-2xl rounded-2xl border border-white/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.50)]"
                style={{
                  background:
                    "color-mix(in oklab, var(--brand-dark) 94%, transparent)",
                }}
              >
                {/* header */}
                <div className="flex items-center gap-4">
                  <img
                    src={selected.avatar || "/brand/shipyard-logo.svg"}
                    alt={selected.name}
                    className="h-16 w-16 rounded-full object-cover ring-1 ring-white/10"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold truncate">
                      {selected.name}
                    </h3>
                    <div className="text-white/60">@{selected.handle}</div>
                  </div>
                  <span className="ml-auto text-xs px-3 py-1 rounded-full bg-[color:var(--brand-neon)]/10 border border-[color:var(--brand-neon)]/30 text-[color:var(--brand-neon)]">
                    {selected.role}
                  </span>
                </div>

                {/* body */}
                <div className="mt-5 grid gap-4">
                  {selected.bio && (
                    <p className="text-white/80 leading-relaxed">
                      {selected.bio}
                    </p>
                  )}

                  {selected.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selected.tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="grid sm:grid-cols-2 gap-3 text-sm text-white/75">
                    <div>
                      📍 <span className="text-white/90">{selected.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selected.available ? (
                        <>
                          <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--brand-neon)]" />
                          <span className="text-[color:var(--brand-neon)]">
                            Disponible para trabajo
                          </span>
                        </>
                      ) : (
                        <span>No disponible</span>
                      )}
                    </div>

                    {selected.linkedin && (
                      <a
                        href={selected.linkedin}
                        target="_blank"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                                   bg-[color:var(--brand-neon)]/15 border border-[color:var(--brand-neon)]/30
                                   text-[color:var(--brand-neon)] hover:bg-[color:var(--brand-neon)]/25"
                      >
                        LinkedIn
                      </a>
                    )}
                    {selected.x && (
                      <a
                        href={selected.x}
                        target="_blank"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                                   bg-[color:var(--brand-neon)]/15 border border-[color:var(--brand-neon)]/30
                                   text-[color:var(--brand-neon)] hover:bg-[color:var(--brand-neon)]/25"
                      >
                        X (Twitter)
                      </a>
                    )}
                    {selected.calendly && (
                      <a
                        href={selected.calendly}
                        target="_blank"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                                   bg-[color:var(--brand-neon)]/15 border border-[color:var(--brand-neon)]/30
                                   text-[color:var(--brand-neon)] hover:bg-[color:var(--brand-neon)]/25"
                      >
                        Calendly
                      </a>
                    )}
                    {selected.telegram && (
                      <span>
                        Telegram:{" "}
                        <span className="text-white/90">
                          {selected.telegram}
                        </span>
                      </span>
                    )}
                    {selected.discord && (
                      <span>
                        Discord:{" "}
                        <span className="text-white/90">
                          {selected.discord}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* actions */}
                <div className="mt-6 flex justify-end">
                  <button className="btn-ghost" onClick={() => setSelected(null)}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
