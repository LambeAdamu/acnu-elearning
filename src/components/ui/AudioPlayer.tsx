"use client";
export default function AudioPlayer({ src }: { src: string }) {
  return (
    <div className="card p-4 border-l-4" style={{ borderLeftColor: "var(--acnu-primary)" }}>
      <p className="text-sm font-medium mb-2" style={{ color: "var(--acnu-dark)" }}>Contenu audio</p>
      <audio controls controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} className="w-full" src={src} />
    </div>
  );
}
