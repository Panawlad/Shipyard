"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  try { return JSON.stringify(err); } catch { return String(err); }
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Registro fallido");

      const loginRes = await signIn("credentials", { email, password, redirect: false });
      if (loginRes?.error) throw new Error("No se pudo iniciar sesión");

      router.push("/profile/new");
    } catch (err: unknown) {
      setErr(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero relative overflow-hidden">
      {/* Glow superior izquierdo + glow inferior derecho (más envolvente) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-56 -left-40 h-[720px] w-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,245,160,0.22), transparent 60%)",
          filter: "blur(42px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-72 -right-40 h-[820px] w-[820px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,245,160,0.18), transparent 60%)",
          filter: "blur(48px)",
        }}
      />

      {/* Decoraciones grandes (envolviendo al form) */}
      {/* Top-right enorme */}
      <Image
        src="/assets/shipyard/cactus1.svg"
        alt=""
        width={840}
        height={840}
        aria-hidden
        priority
        className="pointer-events-none select-none absolute -right-[180px] -top-[120px] rotate-[-8deg] opacity-[0.58] md:opacity-[0.64]"
      />
      {/* Left-center grande */}
      <Image
        src="/assets/shipyard/cactus2.svg"
        alt=""
        width={720}
        height={720}
        aria-hidden
        priority
        className="pointer-events-none select-none absolute -left-[220px] top-1/3 -translate-y-1/3 opacity-[0.60]"
      />
      {/* Bottom-left mediana */}
      <Image
        src="/assets/shipyard/cactus3.svg"
        alt=""
        width={520}
        height={520}
        aria-hidden
        priority
        className="pointer-events-none select-none absolute -left-[140px] bottom-[-120px] rotate-[10deg] opacity-[0.55]"
      />
      {/* Bottom-right grande */}
      <Image
        src="/assets/shipyard/cactus4.svg"
        alt=""
        width={820}
        height={820}
        aria-hidden
        priority
        className="pointer-events-none select-none absolute -right-[220px] bottom-[-220px] opacity-[0.66]"
      />
      <Image
        src="/assets/shipyard/cactus7.svg"
        alt=""
        width={900}
        height={900}
        aria-hidden="true"
        priority
        className="pointer-events-none select-none
          fixed bottom-[-72px] left-1/2 -translate-x-1/2
          w-[520px] md:w-[680px] lg:w-[780px]
          opacity-[0.85] drop-shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
      />


      {/* Header minimal con logo */}
      <header className="wrap py-6">
        <Link href="/" className="inline-flex">
          <Image
            src="/brand/shipyard-logo.svg"
            alt="Shipyard"
            width={92}
            height={24}
            priority
          />
        </Link>
      </header>

      {/* Form + pastilla de contexto */}
      <div className="wrap py-10 md:py-16 relative">
        <div className="center-block mb-6 flex justify-center">
          <div className="pill">Únete a la comunidad Shipyard</div>
        </div>

        <div className="card max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>

          <form onSubmit={submit} className="grid gap-3">
            <input
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:ring-2 focus:ring-[color:var(--brand-neon)] outline-none"
              type="text"
              placeholder="Nombre (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:ring-2 focus:ring-[color:var(--brand-neon)] outline-none"
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 focus:ring-2 focus:ring-[color:var(--brand-neon)] outline-none"
              type="password"
              placeholder="Contraseña (mín. 8)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {err && <p className="text-red-400 text-sm">{err}</p>}

            <button disabled={loading} className="btn-neon">
              {loading ? "Creando..." : "Registrarme"}
            </button>
          </form>

          <p className="mt-4 text-sm text-white/70">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="text-brand underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
