export default function ProgressBar({ total, done, color }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
        <span>{done}/{total} actividades</span>
        <span className="font-bold" style={{ color }}>
          {pct}%
        </span>
      </div>

      <div className="bg-slate-200 rounded-full h-[7px] overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(.22,.68,0,1.1)]"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 8px ${color}55`,
          }}
        />
      </div>
    </div>
  );
}