import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function PageLegale({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="gradient-acnu text-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-bold">ACNU-LEARNING</span>
          </Link>
          <Link href="/register" className="text-sm underline">Retour à l'inscription</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10 prose prose-slate">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{titre}</h1>
        <p className="text-xs text-slate-400 mb-6">
          Résumé des points clés. Le document complet (PDF) est disponible auprès de l'administration
          d'ACNU-Learning.
        </p>
        {children}
      </main>
    </div>
  );
}
