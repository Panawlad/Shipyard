export default function Feature({ icon, title, desc }: { icon: string; title: string; desc: string; }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="h-10 w-10 rounded-xl bg-white/10 grid place-items-center mb-4">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-white/70">{desc}</p>
    </div>
  );
}
