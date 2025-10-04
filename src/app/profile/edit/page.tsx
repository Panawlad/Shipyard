"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/** Acepta inglés (valores internos) y español (etiquetas del select) */
type CategoryOption =
  | "Builder" | "Founder" | "Developer" | "Designer" | "Investor" | "Marketer" | "ContentCreator" | "Other"
  | "Desarrollador" | "Diseñador" | "Inversionista" | "Creador de contenido" | "Otro";

type Form = {
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  category: CategoryOption;
  skills: string; // UI -> la API lo normaliza a string[]
  location: string;
  x: string;
  linkedin: string;
  calendly: string;
  telegram: string;
  discord: string;
  available: boolean;
  investing: boolean;
  hiring: boolean;
};

const initial: Form = {
  username: "",
  fullName: "",
  avatarUrl: "",
  bio: "",
  category: "Developer",
  skills: "",
  location: "",
  x: "",
  linkedin: "",
  calendly: "",
  telegram: "",
  discord: "",
  available: false,
  investing: false,
  hiring: false,
};

// Map de rol DB->etiqueta de select (ES)
const roleToEs: Record<string, CategoryOption> = {
  Builder: "Builder",
  Founder: "Founder",
  Developer: "Desarrollador",
  Designer: "Diseñador",
  Investor: "Inversionista",
  Marketer: "Marketer",
  ContentCreator: "Creador de contenido",
  Other: "Otro",
};

export default function EditProfilePage() {
  const router = useRouter();
  const { status } = useSession(); // "loading" | "authenticated" | "unauthenticated"

  const [values, setValues] = useState<Form>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Cargar perfil del usuario
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        if (status === "unauthenticated") {
          router.replace("/auth/login?next=/profile/edit");
          return;
        }
        if (status !== "authenticated") return;

        const res = await fetch("/api/profiles/me", { cache: "no-store" });
        if (res.status === 401) {
          router.replace("/auth/login?next=/profile/edit");
          return;
        }
        const data = await res.json();
        if (!alive) return;

        if (!data?.exists) {
          router.replace("/profile/new");
          return;
        }

        const p = data.profile as {
          handle: string;
          name: string;
          avatar?: string;
          bio?: string;
          role?: string;
          tags?: string[];
          location?: string;
          x?: string;
          linkedin?: string;
          calendly?: string;
          telegram?: string;
          discord?: string;
          available?: boolean;
          hiring?: boolean;
          investing?: boolean;
        };

        setValues({
          username: p.handle || "",
          fullName: p.name || "",
          avatarUrl: p.avatar || "",
          bio: p.bio || "",
          category: (roleToEs[p.role ?? ""] ?? (p.role as CategoryOption) ?? "Developer"),
          skills: (p.tags ?? []).join(", "),
          location: p.location || "",
          x: p.x || "",
          linkedin: p.linkedin || "",
          calendly: p.calendly || "",
          telegram: p.telegram || "",
          discord: p.discord || "",
          available: Boolean(p.available),
          hiring: Boolean(p.hiring),
          investing: Boolean(p.investing),
        });
      } catch {
        setErr("No se pudo cargar tu perfil.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [status, router]);

  // Normalizador de categoría UI->API (ES/EN)
  const normalizeCategory = useMemo(() => {
    const esToEn: Record<CategoryOption, CategoryOption> = {
      Desarrollador: "Developer",
      Diseñador: "Designer",
      Inversionista: "Investor",
      "Creador de contenido": "ContentCreator",
      Otro: "Other",
      Builder: "Builder",
      Founder: "Founder",
      Developer: "Developer",
      Designer: "Designer",
      Investor: "Investor",
      Marketer: "Marketer",
      ContentCreator: "ContentCreator",
      Other: "Other",
    };
    return (c: CategoryOption) => esToEn[c] ?? c;
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    try {
      const payload = { ...values, category: normalizeCategory(values.category) };

      const res = await fetch("/api/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo guardar");
      router.push("/directory");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-hero grid place-items-center">
        <div className="card px-6 py-5 text-center">
          <p className="text-white/80">Cargando tu perfil…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero relative overflow-hidden">
      {/* decor opcional */}
      <img
        src="/assets/shipyard/cactus7.svg"
        alt=""
        aria-hidden
        className="pointer-events-none select-none fixed -right-16 bottom-10 w-[380px] opacity-[.18]"
      />
      <img
        src="/assets/shipyard/cactus2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none select-none fixed -left-24 top-10 w-[360px] opacity-[.10]"
      />

      <div className="wrap py-12">
        <div className="card max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Editar mi Perfil</h1>

          <form onSubmit={submit} className="grid gap-4">
            {/* Avatar URL + ayuda */}
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Foto de perfil (Enlace directo)"
                value={values.avatarUrl}
                onChange={(e) => setValues((v) => ({ ...v, avatarUrl: e.target.value }))}
              />
              <a
                href="https://postimages.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost whitespace-nowrap"
                title="Sube tu imagen y copia el enlace directo"
              >
                Crear URL
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {/* username como clave en PATCH -> no editable */}
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 opacity-70"
                placeholder="Usuario"
                value={values.username}
                onChange={(e) => setValues((v) => ({ ...v, username: e.target.value }))}
                disabled
              />
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Nombre completo *"
                value={values.fullName}
                onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
                required
              />
            </div>

            <textarea
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 min-h-[120px]"
              placeholder="Bio *"
              value={values.bio}
              onChange={(e) => setValues((v) => ({ ...v, bio: e.target.value }))}
              required
            />

            <div className="grid md:grid-cols-2 gap-3">
              {/* Select con flechita SIEMPRE dentro del contenedor */}
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 pr-10
                             focus:ring-2 focus:ring-[color:var(--brand-neon)]/40"
                  value={values.category}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, category: e.target.value as CategoryOption }))
                  }
                >
                  <option>Desarrollador</option>
                  <option>Diseñador</option>
                  <option>Founder</option>
                  <option>Builder</option>
                  <option>Inversionista</option>
                  <option>Marketer</option>
                  <option>Creador de contenido</option>
                  <option>Otro</option>
                </select>

                {/* Icono: ocupa toda la altura del select y queda centrado */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-white/60"
                >
                  ▾
                </span>
              </div>

              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Localización *"
                value={values.location}
                onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))}
                required
              />
            </div>

            <input
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
              placeholder="Habilidades (separado por coma)"
              value={values.skills}
              onChange={(e) => setValues((v) => ({ ...v, skills: e.target.value }))}
            />

            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="X (link)"
                value={values.x}
                onChange={(e) => setValues((v) => ({ ...v, x: e.target.value }))}
              />
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="LinkedIn (link)"
                value={values.linkedin}
                onChange={(e) => setValues((v) => ({ ...v, linkedin: e.target.value }))}
              />
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Calendly (link)"
                value={values.calendly}
                onChange={(e) => setValues((v) => ({ ...v, calendly: e.target.value }))}
              />
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Telegram @"
                value={values.telegram}
                onChange={(e) => setValues((v) => ({ ...v, telegram: e.target.value }))}
              />
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Discord @"
                value={values.discord}
                onChange={(e) => setValues((v) => ({ ...v, discord: e.target.value }))}
              />
            </div>

            <label className="inline-flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                className="accent-[color:var(--brand-neon)]"
                checked={values.available}
                onChange={(e) => setValues((v) => ({ ...v, available: e.target.checked }))}
              />
              <span className="text-sm text-white/80">Disponible para trabajo</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-[color:var(--brand-neon)]"
                checked={values.hiring}
                onChange={(e) => setValues((v) => ({ ...v, hiring: e.target.checked }))}
              />
              <span>Contratando</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-[color:var(--brand-neon)]"
                checked={values.investing}
                onChange={(e) => setValues((v) => ({ ...v, investing: e.target.checked }))}
              />
              <span>Buscando invertir</span>
            </label>

            {err && <p className="text-red-400 text-sm">{err}</p>}

            <button className="btn-neon mt-2" disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
