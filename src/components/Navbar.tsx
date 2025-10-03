import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 grid place-items-center">
          <span className="text-emerald-400 text-xl">⚡</span>
        </div>
        <Link href="/" className="font-semibold tracking-tight">Crypto Hub</Link>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/directory" className="hidden md:inline-block text-sm px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition">
          Ver Directorio
        </Link>
        <Link href="/auth/login" className="text-sm px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition">
          Log In
        </Link>
        <Link href="/auth/signup" className="text-sm px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition">
          Sign Up
        </Link>
      </div>
    </header>
  );
}
