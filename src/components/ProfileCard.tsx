// src/components/ProfileCard.tsx
import type { Profile } from "@/types/profile";

type Props = Profile & {
  onClick?: (p: Profile) => void;
};

// Componente reutilizable para mostrar el estado (píldoras)
function StatusPill({
  label,
  tone, // "available" | "hiring" | "investing"
}: {
  label: string;
  tone: "available" | "hiring" | "investing";
}) {
  const tones: Record<typeof tone, { text: string; border: string; bg: string }> = {
    available: {
      text: "text-[color:var(--brand-neon)]",
      border: "border-[color:var(--brand-neon)]/30",
      bg: "bg-[color:var(--brand-neon)]/10",
    },
    hiring: {
      text: "text-sky-300",
      border: "border-sky-400/30",
      bg: "bg-sky-400/10",
    },
    investing: {
      text: "text-amber-300",
      border: "border-amber-400/30",
      bg: "bg-amber-400/10",
    },
  };

  const c = tones[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${c.bg} ${c.border} ${c.text}`}
    >
      ● {label}
    </span>
  );
}

export default function ProfileCard(p: Props) {
  return (
    <article
      className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4 hover:bg-white/[0.06] transition cursor-pointer"
      onClick={() => p.onClick?.(p)}
    >
      {/* Header con avatar y nombre */}
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

      {/* Bio */}
      {p.bio && <p className="text-sm text-white/75 line-clamp-2">{p.bio}</p>}

      {/* Tags / Skills */}
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

      {/* Footer con ubicación, links y estados */}
      <div className="flex items-center justify-between text-xs text-white/60">
        <span className="flex items-center gap-1">📍 {p.location}</span>

        <div className="flex items-center gap-2">
          {p.linkedin && (
            <a
              href={p.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] px-2 py-1 rounded-md bg-[color:var(--brand-neon)]/15 border border-[color:var(--brand-neon)]/30 text-[color:var(--brand-neon)] hover:bg-[color:var(--brand-neon)]/25"
              onClick={(e) => e.stopPropagation()}
            >
              LinkedIn
            </a>
          )}
          {p.x && (
            <a
              href={p.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] px-2 py-1 rounded-md bg-[color:var(--brand-neon)]/15 border border-[color:var(--brand-neon)]/30 text-[color:var(--brand-neon)] hover:bg-[color:var(--brand-neon)]/25"
              onClick={(e) => e.stopPropagation()}
            >
              X
            </a>
          )}
          {p.calendly && (
            <a
              href={p.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] px-2 py-1 rounded-md bg-[color:var(--brand-neon)]/15 border border-[color:var(--brand-neon)]/30 text-[color:var(--brand-neon)] hover:bg-[color:var(--brand-neon)]/25"
              onClick={(e) => e.stopPropagation()}
            >
              Calendly
            </a>
          )}
        </div>

        {/* Estados */}
        <div className="flex items-center gap-2">
          {p.available && <StatusPill label="Disponible" tone="available" />}
          {p.hiring && <StatusPill label="Contratando" tone="hiring" />}
          {p.investing && <StatusPill label="Buscando invertir" tone="investing" />}
        </div>
      </div>
    </article>
  );
}
