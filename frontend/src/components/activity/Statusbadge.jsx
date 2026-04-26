const STATUS_MAP = {
  "en progreso": {
    className: "bg-blue-100 text-blue-700",
    label: "⚡ En progreso",
  },
  "próximo": {
    className: "bg-slate-100 text-slate-500",
    label: "🔒 Próximo",
  },
  "completado": {
    className: "bg-green-100 text-green-700",
    label: "✅ Completado",
  },
};

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP["próximo"];

  return (
    <span
      className={`inline-block text-[0.7rem] font-bold px-2.5 py-0.5 rounded-full tracking-wide ${s.className}`}
    >
      {s.label}
    </span>
  );
}