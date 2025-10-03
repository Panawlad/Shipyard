"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Form = {
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  category: "Builder" | "Founder" | "Developer" | "Designer" | "Investor" | "Marketer";
  skills: string;
  location: string;
  x: string;
  linkedin: string;
  calendly: string;
  telegram: string;
  discord: string;
  available: boolean;
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
};

export default function CreateProfilePage() {
  const router = useRouter();
  const { status } = useSession(); // "loading" | "authenticated" | "unauthenticated"

  const [values, setValues] = useState<Form>(initial);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [gate, setGate] = useState<"checking" | "open">("checking");

  // Guard 1: si no hay sesión -> login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login?next=/profile/new");
    }
  }, [status, router]);

  // Guard 2: si hay sesión, verificar si ya tiene perfil -> directory
  useEffect(() => {
    let done = false;

    async function check() {
      if (status !== "authenticated") return;
      try {
        const res = await fetch("/api/profiles/me", { cache: "no-store" });
        if (res.status === 401) {
          // por si perdió la sesión a mitad
          router.replace("/auth/login?next=/profile/new");
          return;
        }
        const data = await res.json();
        if (data?.exists) {
          router.replace("/directory");
          return;
        }
        // no existe perfil: permitir ver el formulario
        if (!done) setGate("open");
      } catch {
        // si falla, deja pasar al form (peor caso)
        if (!done) setGate("open");
      }
    }
    check();

    return () => {
      done = true;
    };
  }, [status, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not save profile");
      router.push("/directory");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  // Bloqueo visual mientras resolvemos sesión/perfil
  if (status === "loading" || gate === "checking") {
    return (
      <div className="min-h-screen bg-hero grid place-items-center">
        <div className="card px-6 py-5 text-center">
          <p className="text-white/80">Comprobando tu sesión…</p>
        </div>
      </div>
    );
  }

  // Si llegó aquí: sesión OK y sin perfil previo
  return (
    <div className="min-h-screen bg-hero relative overflow-hidden">
      {/* decor (opcional) */}
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
          <h1 className="text-2xl font-bold mb-6">Create Your Profile</h1>

          <form onSubmit={submit} className="grid gap-4">
            <input
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
              placeholder="Avatar URL"
              value={values.avatarUrl}
              onChange={(e) => setValues((v) => ({ ...v, avatarUrl: e.target.value }))}
            />

            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Username *"
                value={values.username}
                onChange={(e) => setValues((v) => ({ ...v, username: e.target.value }))}
                required
              />
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Full Name *"
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
              <select
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                value={values.category}
                onChange={(e) =>
                  setValues((v) => ({ ...v, category: e.target.value as Form["category"] }))
                }
              >
                <option>Developer</option>
                <option>Designer</option>
                <option>Founder</option>
                <option>Builder</option>
                <option>Investor</option>
                <option>Marketer</option>
              </select>

              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Location *"
                value={values.location}
                onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))}
                required
              />
            </div>

            <input
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
              placeholder="Skills (comma-separated)"
              value={values.skills}
              onChange={(e) => setValues((v) => ({ ...v, skills: e.target.value }))}
            />

            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="X (Twitter)"
                value={values.x}
                onChange={(e) => setValues((v) => ({ ...v, x: e.target.value }))}
              />
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="LinkedIn"
                value={values.linkedin}
                onChange={(e) => setValues((v) => ({ ...v, linkedin: e.target.value }))}
              />
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Calendly"
                value={values.calendly}
                onChange={(e) => setValues((v) => ({ ...v, calendly: e.target.value }))}
              />
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Telegram"
                value={values.telegram}
                onChange={(e) => setValues((v) => ({ ...v, telegram: e.target.value }))}
              />
              <input
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Discord"
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
              <span className="text-sm text-white/80">Available for work</span>
            </label>

            {err && <p className="text-red-400 text-sm">{err}</p>}

            <button className="btn-neon mt-2" disabled={loading}>
              {loading ? "Saving…" : "Create Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
