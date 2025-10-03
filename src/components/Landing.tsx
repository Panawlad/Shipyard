import Link from "next/link";
import Image from "next/image";
import { Users, Zap, Globe, TrendingUp, LogIn } from "lucide-react";
import CreateProfileCTA from "@/components/CreateProfileCTA";

export default function Landing() {
  return (
    <div className="min-h-screen bg-hero relative overflow-hidden">
      {/* Decorativos 3D en los costados (ocultos en móvil) */}
      <Image
        src="/assets/shipyard/cactus1.svg"
        alt=""
        width={520}
        height={520}
        priority
        aria-hidden
        className="pointer-events-none select-none hidden md:block
                   absolute -left-24 top-16 opacity-70
                   drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
      />

      <Image
        src="/assets/shipyard/cactus2.svg"
        alt=""
        width={520}
        height={520}
        aria-hidden
        className="pointer-events-none select-none hidden md:block
                   absolute -right-24 bottom-10 opacity-60
                   drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
      />

      {/* NAV */}
      <nav className="wrap py-6 relative z-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/shipyard-logo.svg"
              alt="Shipyard"
              width={150}
              height={28}
              priority
              className="h-7 w-auto"
            />
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="btn-ghost">
              <LogIn className="w-4 h-4 mr-2" />
              Log In
            </Link>
            <Link href="/auth/signup" className="btn-neon">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="wrap text-center pt-8 pb-12 relative z-10">
        <div className="pill mx-auto mb-6">
          <Zap className="w-4 h-4" />
          Join the Crypto Revolution
        </div>

        <div className="center-block">
          <h1 className="font-extrabold text-[56px] md:text-[68px] leading-[1.05] tracking-[-0.02em]">
            Connect with <span className="text-brand">Crypto</span>
          </h1>
          <h2 className="font-extrabold text-[56px] md:text-[68px] leading-[1.03] -mt-2 tracking-[-0.02em]">
            <span className="text-brand">Professionals</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-white/70">
            The ultimate networking hub for builders, founders, developers, and investors in the crypto space.
            Find collaborators, discover opportunities, and grow your network.
          </p>
        </div>
      </header>

      {/* FEATURES */}
      <section className="wrap grid md:grid-cols-3 gap-6 pb-16 relative z-10">
        <div className="card">
          <div className="w-12 h-12 rounded-xl bg-[color:var(--brand-neon)]/10 grid place-items-center mb-4">
            <Users className="w-6 h-6 text-[color:var(--brand-neon)]" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Connect with Experts</h3>
          <p className="text-white/70">
            Accede a un directorio curado de profesionales verificados en todas las disciplinas.
          </p>
        </div>

        <div className="card">
          <div className="w-12 h-12 rounded-xl bg-[color:var(--brand-neon)]/10 grid place-items-center mb-4">
            <TrendingUp className="w-6 h-6 text-[color:var(--brand-neon)]" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Haz crecer tu red</h3>
          <p className="text-white/70">
            Encuentra colaboradores, mentores y socios para tus proyectos.
          </p>
        </div>

        <div className="card">
          <div className="w-12 h-12 rounded-xl bg-[color:var(--brand-neon)]/10 grid place-items-center mb-4">
            <Globe className="w-6 h-6 text-[color:var(--brand-neon)]" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Comunidad Global</h3>
          <p className="text-white/70">
            Únete a profesionales de todo el mundo construyendo el futuro descentralizado.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="wrap pb-20">
        <div className="card text-center py-12">
          <h3 className="text-3xl font-bold mb-3">¿Listo para conectar?</h3>
          <p className="text-white/70 text-lg center-block mb-8">
            Crea tu perfil en minutos y empieza a hacer networking con profesionales cripto.
          </p>
          <CreateProfileCTA />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 relative z-10">
        <div className="wrap py-8 text-center text-white/60">
          © {new Date().getFullYear()} Crypto Hub
        </div>
      </footer>
    </div>
  );
}
