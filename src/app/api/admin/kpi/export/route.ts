import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CATEGORY_OPTIONS } from "@/lib/themes";
import { pourcentage } from "@/utils/helpers";

// Génère un rapport CSV (ouvrable dans Excel) avec les KPI par cursus —
// à utiliser pour le rapport trimestriel d'impact (Axe 3 du plan d'action).
export async function GET() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "FORMATEUR")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const lignes: string[] = [];
  lignes.push("Cursus;Apprenants valides;Taux de completion moyen (%);Tentatives examens;Taux de reussite (%);Satisfaction moyenne (/5);Nombre avis");

  for (const c of CATEGORY_OPTIONS) {
    const apprenants = await prisma.user.findMany({ where: { role: "APPRENANT", statut: "VALIDE", category: c.value }, include: { progressions: true } });
    const totalModules = await prisma.module.count({ where: { category: c.value } });
    const tauxParApprenant = apprenants.map((a) => pourcentage(a.progressions.filter((p) => p.estTermine).length, totalModules || 1));
    const tauxCompletionMoyen = tauxParApprenant.length ? Math.round(tauxParApprenant.reduce((s, v) => s + v, 0) / tauxParApprenant.length) : 0;

    const tentatives = await prisma.tentative.findMany({ where: { user: { category: c.value } } });
    const tauxReussite = tentatives.length ? Math.round((tentatives.filter((t) => t.reussi).length / tentatives.length) * 100) : 0;

    const satisfactions = await prisma.satisfaction.findMany({ where: { user: { category: c.value } } });
    const satisfactionMoyenne = satisfactions.length ? (satisfactions.reduce((s, v) => s + v.note, 0) / satisfactions.length).toFixed(1) : "";

    lignes.push(`${c.label};${apprenants.length};${tauxCompletionMoyen};${tentatives.length};${tauxReussite};${satisfactionMoyenne};${satisfactions.length}`);
  }

  const csv = "\uFEFF" + lignes.join("\n"); // BOM pour un bon affichage des accents dans Excel
  const dateStr = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rapport-kpi-acnu-${dateStr}.csv"`,
    },
  });
}
