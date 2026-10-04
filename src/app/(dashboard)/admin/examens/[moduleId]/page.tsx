import { prisma } from "@/lib/prisma";
import ExamenForm from "@/components/forms/ExamenForm";
import { categoryLabel } from "@/lib/themes";

export default async function EditExamenPage({ params }: { params: { moduleId: string } }) {
  const module = await prisma.module.findUnique({ where: { id: params.moduleId }, include: { examens: true } });
  if (!module) return <div className="p-6">Module introuvable.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1 text-slate-800">Examen — {module.titre}</h1>
      <p className="text-sm text-slate-500 mb-6">{categoryLabel(module.category)} · {module.examens.length > 0 ? "Modifier l'examen existant" : "Créer un nouvel examen"}</p>
      <ExamenForm moduleId={module.id} />
    </div>
  );
}
