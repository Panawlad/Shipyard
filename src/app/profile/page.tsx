"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role =
  | "Builder" | "Founder" | "Developer" | "Designer"
  | "Investor" | "Marketer" | "ContentCreator" | "Other";

type Form = {
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  category: Role;
  skills: string;      // CSV para el input
  location: string;
  x: string;
  linkedin: string;
  calendly: string;
  telegram: string;
  discord: string;
  available: boolean;
  hiring: boolean;
  investing: boolean;
};

const empty: Form = {
  username: "", fullName: "", avatarUrl: "", bio: "",
  category: "Developer", skills: "", location: "",
  x: "", linkedin: "", calendly: "", telegram: "", discord: "",
  available: false, hiring: false, investing: false,
};

export default function EditProfilePage() {
  const router = useRouter();
  const [values, setValues] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Cargar perfil
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profiles/me", { cache: "no-store" });
        if (res.status === 401) {
          router.replace("/auth/login?next=/profile");
          return;
        }
        const data = await res.json();
        if (!data?.exists) {
          router.replace("/profile/new");
          return;
        }
        const p = data.profile;
        if (!cancelled) {
          setValues({
            username:  p.handle ?? "",
            fullName:  p.name ?? "",
            avatarUrl: p.avatar ?? "",
            bio:       p.bio ?? "",
            category:  (p.role as Role) ?? "Developer",
            skills:    (p.tags ?? []).join(", "),
            location:  p.location ?? "",
            x:         p.x ?? "",
            linkedin:  p.linkedin ?? "",
            calendly:  p.calendly ?? "",
            telegram:  p.telegram ?? "",
            discord:   p.discord ?? "",
            available: !!p.available,
            hiring:    !!p.hiring,
            investing: !!p.investing,
          });
        }
      } catch (e) {
        if (!cancelled) setErr("No se pudo cargar tu perfil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo guardar");
      router.push("/directory");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-hero grid place-items-center">
        <div className="card px-6 py-5">Cargando tu perfil…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero">
      <div className="wrap py-12">
        <div className="card max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Editar mi Perfil</h1>

          <form onSubmit={submit} className="grid gap-4">
            <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
              placeholder="Foto de perfil (URL)"
              value={values.avatarUrl}
              onChange={(e) => setValues(v => ({ ...v, avatarUrl: e.target.value }))} />

            <div className="grid md:grid-cols-2 gap-3">
              <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Usuario *"
                value={values.username}
                onChange={(e) => setValues(v => ({ ...v, username: e.target.value }))} required />
              <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Nombre completo *"
                value={values.fullName}
                onChange={(e) => setValues(v => ({ ...v, fullName: e.target.value }))} required />
            </div>

            <textarea className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 min-h-[120px]"
              placeholder="Bio *"
              value={values.bio}
              onChange={(e) => setValues(v => ({ ...v, bio: e.target.value }))} required />

            <div className="grid md:grid-cols-2 gap-3">
              <select className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                value={values.category}
                onChange={(e) =>
                  setValues(v => ({ ...v, category: e.target.value as Role }))
                }>
                <option value="Developer">Desarrollador</option>
                <option value="Designer">Diseñador</option>
                <option value="Founder">Founder</option>
                <option value="Builder">Builder</option>
                <option value="Investor">Inversionista</option>
                <option value="Marketer">Marketer</option>
                <option value="ContentCreator">Creador de contenido</option>
                <option value="Other">Otro</option>
              </select>

              <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Localización *"
                value={values.location}
                onChange={(e) => setValues(v => ({ ...v, location: e.target.value }))} required />
            </div>

            <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
              placeholder="Habilidades (separado por coma)"
              value={values.skills}
              onChange={(e) => setValues(v => ({ ...v, skills: e.target.value }))} />

            <div className="grid md:grid-cols-2 gap-3">
              <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="X (link)" value={values.x}
                onChange={(e) => setValues(v => ({ ...v, x: e.target.value }))} />
              <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="LinkedIn (link)" value={values.linkedin}
                onChange={(e) => setValues(v => ({ ...v, linkedin: e.target.value }))} />
              <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Calendly (link)" value={values.calendly}
                onChange={(e) => setValues(v => ({ ...v, calendly: e.target.value }))} />
              <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Telegram @" value={values.telegram}
                onChange={(e) => setValues(v => ({ ...v, telegram: e.target.value }))} />
              <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Discord @" value={values.discord}
                onChange={(e) => setValues(v => ({ ...v, discord: e.target.value }))} />
            </div>

            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="accent-[color:var(--brand-neon)]"
                checked={values.available}
                onChange={(e) => setValues(v => ({ ...v, available: e.target.checked }))} />
              Disponible
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="accent-[color:var(--brand-neon)]"
                checked={values.hiring}
                onChange={(e) => setValues(v => ({ ...v, hiring: e.target.checked }))} />
              Contratando
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="accent-[color:var(--brand-neon)]"
                checked={values.investing}
                onChange={(e) => setValues(v => ({ ...v, investing: e.target.checked }))} />
              Buscando invertir
            </label>

            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button className="btn-neon" disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
