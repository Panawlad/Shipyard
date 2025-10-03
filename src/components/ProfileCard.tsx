// src/components/ProfileCard.tsx
import type { Profile } from "@/types/profile";

type Props = Profile & {
  onClick?: (p: Profile) => void;
};

export default function ProfileCard(p: Props) {
  return (
    <article
      className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4 hover:bg-white/[0.06] transition cursor-pointer"
      onClick={() => p.onClick?.(p)}
    >
      <div className="flex items-center gap-3">
        <img
          src={p.avatar || "/brand/shipyard-logo.svg"}
          alt={p.name}
          className="h-12 w-12 rounded-full object-cover ring-1 ring-white/10"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/brand/shipyard-logo.svg";
          }}
        />
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{p.name || p.handle}</h3>
          <div className="text-[color:var(--brand-neon)]/90 text-xs">
            @{p.handle}
          </div>
        </div>
        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-[color:var(--brand-neon)]/10 border border-[color:var(--brand-neon)]/30 text-[color:var(--brand-neon)]">
          {p.role}
        </span>
      </div>

      {p.bio && <p className="text-sm text-white/75 line-clamp-2">{p.bio}</p>}

      {p.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-white/60">
        <span className="flex items-center gap-1">📍 {p.location}</span>
        <div className="flex items-center gap-2">
          {p.linkedin && (
            <a
              href={p.linkedin}
              target="_blank"
              className="underline hover:text-white/90"
              onClick={(e) => e.stopPropagation()}
            >
              LinkedIn
            </a>
          )}
          {p.x && (
            <a
              href={p.x}
              target="_blank"
              className="underline hover:text-white/90"
              onClick={(e) => e.stopPropagation()}
            >
              X
            </a>
          )}
          {p.calendly && (
            <a
              href={p.calendly}
              target="_blank"
              className="ml-2 text-[11px] px-2 py-1 rounded-md bg-[color:var(--brand-neon)]/15 border border-[color:var(--brand-neon)]/30 text-[color:var(--brand-neon)] hover:bg-[color:var(--brand-neon)]/25"
              onClick={(e) => e.stopPropagation()}
            >
              Calendly
            </a>
          )}
        </div>
        {p.available && (
          <span className="flex items-center gap-1 text-[color:var(--brand-neon)]">
            ● Disponible
          </span>
        )}
      </div>
    </article>
  );
}
