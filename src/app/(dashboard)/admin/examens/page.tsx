import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { categoryLabel } from "@/lib/themes";

export default async function AdminExamensPage() {
  const examens = await prisma.examen.findMany({ include: { module: true } });
  const modulesSansExamen = await prisma.module.findMany({ where: { examens: { none: {} } } });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Examens</h1>
      <div className="grid gap-4 mb-8">
        {examens.map((ex) => (
          <div key={ex.id} className="card p-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold" style={{ color: "var(--acnu-primary)" }}>{categoryLabel(ex.module.category)}</span>
              <h3 className="font-medium text-slate-800">{ex.module.titre}</h3>
              <p className="text-sm text-gray-500">Seuil : {ex.seuilReussite}% · {(ex.questions as any[]).length} question(s)</p>
            </div>
            <Link href={`/admin/examens/${ex.moduleId}`} className="btn-secondary text-sm">Modifier</Link>
          </div>
        ))}
        {examens.length === 0 && <p className="text-slate-500 text-sm">Aucun examen créé pour le moment.</p>}
      </div>

      {modulesSansExamen.length > 0 && (
        <div className="card p-4 border-l-4" style={{ borderLeftColor: "var(--acnu-accent)" }}>
          <h2 className="font-semibold text-slate-700 mb-2">Modules sans examen</h2>
          <div className="space-y-2">
            {modulesSansExamen.map((mod) => (
              <div key={mod.id} className="flex justify-between items-center text-sm">
                <span>{categoryLabel(mod.category)} — {mod.titre}</span>
                <Link href={`/admin/examens/${mod.id}`} style={{ color: "var(--acnu-primary)" }} className="hover:underline">Créer un examen</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
