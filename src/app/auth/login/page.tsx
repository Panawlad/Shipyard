"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setErr("Credenciales inválidas.");
    else router.push("/directory");
  }

  return (
    <div className="min-h-screen bg-hero relative overflow-hidden">
      {/* Glow superior (spotlight) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,245,160,0.22), transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      {/* Decoraciones grandes (diagonal) */}
      {/* Top-left grande */}
      <Image
        src="/assets/shipyard/cactus1.svg"
        alt=""
        width={760}
        height={760}
        aria-hidden
        priority
        className="pointer-events-none select-none absolute -left-40 -top-28 opacity-[0.55] md:opacity-[0.65]"
      />
      {/* Mid-right grande (ligero giro) */}
      <Image
        src="/assets/shipyard/cactus3.svg"
        alt=""
        width={680}
        height={680}
        aria-hidden
        priority
        className="pointer-events-none select-none absolute -right-40 top-10 rotate-[12deg] opacity-[0.5] md:opacity-[0.6]"
      />
      {/* Bottom-left grande (fuera de canvas para overflow cool) */}
      <Image
        src="/assets/shipyard/cactus4.svg"
        alt=""
        width={780}
        height={780}
        aria-hidden
        priority
        className="pointer-events-none select-none absolute -left-56 bottom-[-180px] opacity-[0.6]"
      />
      {/* Bottom-right enorme (protagonista bajito) */}
      <Image
        src="/assets/shipyard/cactus2.svg"
        alt=""
        width={900}
        height={900}
        aria-hidden
        priority
        className="pointer-events-none select-none absolute -right-[220px] bottom-[-240px] opacity-[0.65]"
      />
            {/* Bottom-right enorme (protagonista bajito) */}
      <Image
        src="/assets/shipyard/cactus6.svg"
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

      {/* Header minimal con logo (si lo quieres) */}
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

      {/* Form */}
      <div className="wrap py-10 md:py-16 relative">
        <div className="card max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
          <form onSubmit={submit} className="grid gap-3">
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
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button disabled={loading} className="btn-neon">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-4 text-sm text-white/70">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/signup" className="text-brand underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
