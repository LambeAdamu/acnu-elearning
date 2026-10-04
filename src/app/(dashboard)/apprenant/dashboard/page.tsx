import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProgressionBar from "@/components/ui/ProgressionBar";
import { pourcentage } from "@/utils/helpers";
import { categoryLabel } from "@/lib/themes";
import Link from "next/link";

export default async function DashboardApprenant() {
  const session = await auth();
  if (!session) return <div className="p-6">Non authentifié</div>;
  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.category) return <div className="p-6">Aucune catégorie attribuée.</div>;

  const progressions = await prisma.progression.findMany({
    where: { userId },
    include: { module: true },
    orderBy: { module: { ordre: "asc" } },
  });

  const modules = await prisma.module.findMany({ where: { category: user.category }, orderBy: { ordre: "asc" } });
  const totalModules = modules.length;
  const completed = progressions.filter((p) => p.estTermine).length;
  const pct = pourcentage(completed, totalModules);

  let unlocked = true;
  const modulesWithStatus = modules.map((mod) => {
    const prog = progressions.find((p) => p.moduleId === mod.id);
    const isCompleted = prog?.estTermine || false;
    if (isCompleted) return { ...mod, status: "termine" as const };
    if (unlocked) { unlocked = false; return { ...mod, status: "disponible" as const }; }
    return { ...mod, status: "bloque" as const };
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-slate-800">Tableau de bord</h1>
        <span className="badge-accent">{categoryLabel(user.category)}</span>
      </div>

      <div className="card p-6 mb-8 border-t-4" style={{ borderTopColor: "var(--acnu-primary)" }}>
        <h2 className="text-xl font-semibold mb-3 text-slate-800">Progression du cursus</h2>
        <ProgressionBar value={pct} label={`${pct}%`} />
        <p className="text-sm text-gray-600 mt-2">{completed} / {totalModules} modules validés</p>
      </div>

      <div className="grid gap-4">
        {modulesWithStatus.map((mod) => (
          <div key={mod.id} className="card p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-slate-800">{mod.titre}</h3>
              <p className="text-sm text-gray-500">{mod.description}</p>
              <span
                className="inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium"
                style={
                  mod.status === "termine" ? { backgroundColor: "#dcfce7", color: "#166534" } :
                  mod.status === "disponible" ? { backgroundColor: "var(--acnu-accent)", color: "#fff" } :
                  { backgroundColor: "#f1f5f9", color: "#64748b" }
                }
              >
                {mod.status === "termine" ? "Validé" : mod.status === "disponible" ? "À faire" : "Verrouillé"}
              </span>
            </div>
            {mod.status === "disponible" && <Link href={`/apprenant/cours/${mod.id}`} className="btn-primary">Commencer</Link>}
          </div>
        ))}
        {modules.length === 0 && <p className="text-slate-500 text-sm">Aucun module disponible pour votre cursus pour le moment.</p>}
      </div>
    </div>
  );
}
