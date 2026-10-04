import { prisma } from "@/lib/prisma";
import ModuleForm from "@/components/forms/ModuleForm";
import Link from "next/link";

export default async function EditModulePage({ params }: { params: { moduleId: string } }) {
  const module = await prisma.module.findUnique({ where: { id: params.moduleId }, include: { examens: true } });
  if (!module) return <div className="p-6">Module introuvable.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Modifier le module</h1>
      <ModuleForm initial={module} />
      <div className="mt-6 card p-4 border-l-4" style={{ borderLeftColor: "var(--acnu-accent)" }}>
        {module.examens.length > 0 ? (
          <p className="text-sm text-slate-600">Examen déjà créé. <Link href={`/admin/examens/${module.id}`} className="font-medium hover:underline" style={{ color: "var(--acnu-primary)" }}>Voir / modifier</Link></p>
        ) : (
          <p className="text-sm text-slate-600">Aucun examen. <Link href={`/admin/examens/${module.id}`} className="font-medium hover:underline" style={{ color: "var(--acnu-primary)" }}>Créer l'examen</Link></p>
        )}
      </div>
    </div>
  );
}
