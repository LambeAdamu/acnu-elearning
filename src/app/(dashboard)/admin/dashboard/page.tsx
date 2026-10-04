import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CATEGORY_OPTIONS } from "@/lib/themes";

export default async function AdminDashboard() {
  const totalModules = await prisma.module.count();
  const totalApprenants = await prisma.user.count({ where: { role: "APPRENANT", statut: "VALIDE" } });
  const enAttente = await prisma.user.count({ where: { role: "APPRENANT", statut: "EN_ATTENTE" } });
  const totalCertificats = await prisma.certificat.count();

  const repartition = await Promise.all(
    CATEGORY_OPTIONS.map(async (c) => ({
      label: c.label,
      count: await prisma.user.count({ where: { category: c.value, statut: "VALIDE" } }),
    }))
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 border-t-4" style={{ borderTopColor: "var(--acnu-primary)" }}>
          <h2 className="text-sm font-semibold text-slate-600">Modules (4 cursus)</h2>
          <p className="text-3xl font-bold" style={{ color: "var(--acnu-primary)" }}>{totalModules}</p>
        </div>
        <div className="card p-6 border-t-4" style={{ borderTopColor: "var(--acnu-accent)" }}>
          <h2 className="text-sm font-semibold text-slate-600">Apprenants validés</h2>
          <p className="text-3xl font-bold" style={{ color: "var(--acnu-accent)" }}>{totalApprenants}</p>
        </div>
        <div className="card p-6 border-t-4 border-amber-400">
          <h2 className="text-sm font-semibold text-slate-600">Inscriptions en attente</h2>
          <p className="text-3xl font-bold text-amber-500">{enAttente}</p>
        </div>
        <div className="card p-6 border-t-4" style={{ borderTopColor: "var(--acnu-dark)" }}>
          <h2 className="text-sm font-semibold text-slate-600">Certificats délivrés</h2>
          <p className="text-3xl font-bold" style={{ color: "var(--acnu-dark)" }}>{totalCertificats}</p>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <h2 className="font-semibold text-slate-700 mb-4">Répartition des apprenants par cursus</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {repartition.map((r) => (
            <div key={r.label} className="text-center">
              <p className="text-2xl font-bold text-slate-800">{r.count}</p>
              <p className="text-xs text-slate-500">{r.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/admin/inscriptions" className="btn-primary text-center">Inscriptions en attente</Link>
        <Link href="/admin/modules" className="btn-primary text-center">Gérer les modules</Link>
        <Link href="/admin/examens" className="btn-primary text-center">Gérer les examens</Link>
        <Link href="/admin/apprenants" className="btn-primary text-center">Voir les apprenants</Link>
        <Link href="/admin/certificats" className="btn-primary text-center col-span-2">Certificats délivrés</Link>
        <Link href="/admin/kpi" className="btn-primary text-center col-span-2">KPI & Pilotage</Link>
      </div>
    </div>
  );
}
