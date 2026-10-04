import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categoryLabel } from "@/lib/themes";
import Link from "next/link";

export default async function ListeCours() {
  const session = await auth();
  if (!session) return <div className="p-6">Non authentifié</div>;
  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.category) return <div className="p-6">Aucune catégorie attribuée.</div>;

  const modules = await prisma.module.findMany({ where: { category: user.category }, orderBy: { ordre: "asc" } });
  const progressions = await prisma.progression.findMany({ where: { userId } });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-1 text-slate-800">Mon cursus</h1>
      <p className="text-sm text-slate-500 mb-6">{categoryLabel(user.category)}</p>
      <div className="grid gap-4">
        {modules.map((mod) => {
          const prog = progressions.find((p) => p.moduleId === mod.id);
          return (
            <Link key={mod.id} href={`/apprenant/cours/${mod.id}`} className="card p-4 flex justify-between items-center hover:opacity-90 transition-opacity">
              <div>
                <h3 className="font-medium text-slate-800">{mod.titre}</h3>
                <p className="text-sm text-gray-500">{mod.description}</p>
              </div>
              {prog?.estTermine && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{prog.note}%</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
