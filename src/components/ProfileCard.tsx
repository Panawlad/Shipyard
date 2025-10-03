import type { Profile } from "@/types/profile";

export default function ProfileCard(p: Profile) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <img src={p.avatar} alt={p.name} className="h-12 w-12 rounded-full object-cover" />
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{p.name}</h3>
          <div className="text-emerald-300/90 text-xs">@{p.handle}</div>
        </div>
        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
          {p.role}
        </span>
      </div>
      <p className="text-sm text-white/75">{p.bio}</p>
      <div className="flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <span key={t} className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/10">{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-white/60">
        <span className="flex items-center gap-1">📍 {p.location}</span>
        {p.available && <span className="flex items-center gap-1 text-emerald-300">🟢 Disponible</span>}
      </div>
    </article>
  );
}
