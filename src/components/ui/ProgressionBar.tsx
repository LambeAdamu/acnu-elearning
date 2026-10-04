export default function ProgressionBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="w-full">
      <div className="w-full h-3 bg-gris rounded-full overflow-hidden border border-slate-200">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: "linear-gradient(135deg, var(--acnu-primary), var(--acnu-dark))" }}
        />
      </div>
      {label && <p className="text-xs font-medium mt-1" style={{ color: "var(--acnu-dark)" }}>{label}</p>}
    </div>
  );
}
