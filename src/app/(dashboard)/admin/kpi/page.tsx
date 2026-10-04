import { prisma } from "@/lib/prisma";
import { CATEGORY_OPTIONS } from "@/lib/themes";
import { pourcentage } from "@/utils/helpers";

async function calculerKpiCategorie(category: string) {
  const apprenants = await prisma.user.findMany({ where: { role: "APPRENANT", statut: "VALIDE", category: category as any }, include: { progressions: true } });
  const totalModules = await prisma.module.count({ where: { category: category as any } });

  const tauxParApprenant = apprenants.map((a) => pourcentage(a.progressions.filter((p) => p.estTermine).length, totalModules || 1));
  const tauxCompletionMoyen = tauxParApprenant.length ? Math.round(tauxParApprenant.reduce((s, v) => s + v, 0) / tauxParApprenant.length) : 0;

  const tentatives = await prisma.tentative.findMany({ where: { user: { category: category as any } } });
  const tauxReussite = tentatives.length ? Math.round((tentatives.filter((t) => t.reussi).length / tentatives.length) * 100) : 0;

  const satisfactions = await prisma.satisfaction.findMany({ where: { user: { category: category as any } } });
  const satisfactionMoyenne = satisfactions.length ? (satisfactions.reduce((s, v) => s + v.note, 0) / satisfactions.length).toFixed(1) : "—";

  return {
    label: CATEGORY_OPTIONS.find((c) => c.value === category)?.label || category,
    apprenants: apprenants.length,
    tauxCompletionMoyen,
    tauxReussite,
    nbTentatives: tentatives.length,
    satisfactionMoyenne,
    nbAvis: satisfactions.length,
  };
}

export default async function KpiPage() {
  const kpiParCategorie = await Promise.all(CATEGORY_OPTIONS.map((c) => calculerKpiCategorie(c.value)));

  const totalApprenants = kpiParCategorie.reduce((s, k) => s + k.apprenants, 0);
  const totalTentatives = kpiParCategorie.reduce((s, k) => s + k.nbTentatives, 0);
  const totalAvis = kpiParCategorie.reduce((s, k) => s + k.nbAvis, 0);
  const satisfactionGlobale = await prisma.satisfaction.aggregate({ _avg: { note: true } });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">KPI & Pilotage</h1>
          <p className="text-sm text-slate-500">Taux de complétion, taux de réussite aux examens et satisfaction — Axe 3 du plan d'action</p>
        </div>
        <a href="/api/admin/kpi/export" className="btn-primary text-sm">Exporter le rapport (CSV)</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 border-t-4" style={{ borderTopColor: "var(--acnu-primary)" }}>
          <h2 className="text-sm font-semibold text-slate-600">Apprenants validés</h2>
          <p className="text-3xl font-bold" style={{ color: "var(--acnu-primary)" }}>{totalApprenants}</p>
        </div>
        <div className="card p-6 border-t-4" style={{ borderTopColor: "var(--acnu-accent)" }}>
          <h2 className="text-sm font-semibold text-slate-600">Tentatives d'examens</h2>
          <p className="text-3xl font-bold" style={{ color: "var(--acnu-accent)" }}>{totalTentatives}</p>
        </div>
        <div className="card p-6 border-t-4" style={{ borderTopColor: "var(--acnu-dark)" }}>
          <h2 className="text-sm font-semibold text-slate-600">Satisfaction moyenne</h2>
          <p className="text-3xl font-bold" style={{ color: "var(--acnu-dark)" }}>
            {satisfactionGlobale._avg.note ? satisfactionGlobale._avg.note.toFixed(1) : "—"} / 5
          </p>
          <p className="text-xs text-slate-400">{totalAvis} avis</p>
        </div>
      </div>

      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "var(--acnu-primary)" }} className="text-white">
            <tr>
              <th className="text-left px-4 py-3">Cursus</th>
              <th className="text-left px-4 py-3">Apprenants</th>
              <th className="text-left px-4 py-3">Taux de complétion moyen</th>
              <th className="text-left px-4 py-3">Taux de réussite examens</th>
              <th className="text-left px-4 py-3">Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {kpiParCategorie.map((k) => (
              <tr key={k.label} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{k.label}</td>
                <td className="px-4 py-3">{k.apprenants}</td>
                <td className="px-4 py-3">{k.tauxCompletionMoyen}%</td>
                <td className="px-4 py-3">{k.tauxReussite}% <span className="text-xs text-slate-400">({k.nbTentatives})</span></td>
                <td className="px-4 py-3">{k.satisfactionMoyenne} {k.nbAvis > 0 && <span className="text-xs text-slate-400">({k.nbAvis})</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
