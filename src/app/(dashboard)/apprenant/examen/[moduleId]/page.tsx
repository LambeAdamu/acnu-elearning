import { prisma } from "@/lib/prisma";
import ExamenClient from "./ExamenClient";

export default async function ExamenPage({ params }: { params: { moduleId: string } }) {
  const module = await prisma.module.findUnique({ where: { id: params.moduleId }, include: { examens: true } });
  if (!module || module.examens.length === 0) return <div className="p-6">Examen introuvable pour ce module.</div>;
  const examen = module.examens[0];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1 text-slate-800">Examen — {module.titre}</h1>
      <p className="text-sm text-slate-500 mb-6">
        Seuil de réussite : {examen.seuilReussite}%{examen.duree ? ` · Durée : ${examen.duree} min` : ""}
      </p>
      <ExamenClient examenId={examen.id} questions={examen.questions as any[]} />
    </div>
  );
}
