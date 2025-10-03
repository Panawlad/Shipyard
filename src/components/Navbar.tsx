"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

type Props = {
  /** Oculta los botones de Log In / Sign Up / Ver directorio */
  hideLinks?: boolean;
};

export default function Navbar({ hideLinks = false }: Props) {
  const { status } = useSession(); // "authenticated" | "unauthenticated" | "loading"

  return (
    <header className="wrap py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/brand/shipyard-logo.svg"
          alt="Shipyard"
          width={120}
          height={28}
          priority
          className="h-7 w-auto"
        />
        <span className="sr-only">Shipyard</span>
      </Link>

      {/* Links a la derecha */}
      {!hideLinks && (
        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <>
              <Link href="/profile/me" className="btn-ghost">Mi Perfil</Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-ghost"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost">Log In</Link>
              <Link href="/auth/signup" className="btn-neon">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
