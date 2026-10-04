import { prisma } from "@/lib/prisma";
import { pourcentage } from "@/utils/helpers";
import { categoryLabel } from "@/lib/themes";
import Link from "next/link";

export default async function AdminApprenantsPage() {
  const apprenants = await prisma.user.findMany({
    where: { role: "APPRENANT", statut: "VALIDE" },
    include: { progressions: true, certificats: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Apprenants</h1>
        <Link href="/admin/apprenants/importer" className="btn-primary text-sm">Importer un CSV</Link>
      </div>
      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "var(--acnu-primary)" }} className="text-white">
            <tr>
              <th className="text-left px-4 py-3">Nom</th>
              <th className="text-left px-4 py-3">Identifiant</th>
              <th className="text-left px-4 py-3">Cursus</th>
              <th className="text-left px-4 py-3">Progression</th>
              <th className="text-left px-4 py-3">Certificats</th>
            </tr>
          </thead>
          <tbody>
            {await Promise.all(apprenants.map(async (a) => {
              const totalModules = a.category ? await prisma.module.count({ where: { category: a.category } }) : 0;
              const completed = a.progressions.filter((p) => p.estTermine).length;
              const pct = pourcentage(completed, totalModules);
              return (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{a.name}<br /><span className="text-xs text-slate-400">{a.email}</span></td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{a.identifiant}</td>
                  <td className="px-4 py-3 text-slate-600">{categoryLabel(a.category)}</td>
                  <td className="px-4 py-3">
                    <span className="badge-accent">{pct}% ({completed}/{totalModules})</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{a.certificats.length}</td>
                </tr>
              );
            }))}
          </tbody>
        </table>
        {apprenants.length === 0 && <p className="text-slate-500 text-sm p-4">Aucun apprenant validé pour le moment.</p>}
      </div>
    </div>
  );
}
