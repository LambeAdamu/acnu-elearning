import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ResultatPage({ params }: { params: { tentativeId: string } }) {
  const tentative = await prisma.tentative.findUnique({
    where: { id: params.tentativeId },
    include: { examen: { include: { module: true } } },
  });
  if (!tentative) return <div className="p-6">Tentative introuvable.</div>;
  const reussi = tentative.reussi;

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className={`card p-8 border-t-4 ${reussi ? "border-green-500" : "border-red-400"}`}>
        <p className="text-5xl mb-4">{reussi ? "🎉" : "😕"}</p>
        <h1 className="text-2xl font-bold mb-2 text-slate-800">{reussi ? "Félicitations, examen réussi !" : "Examen non validé"}</h1>
        <p className="text-slate-600 mb-4">Module : <strong>{tentative.examen.module.titre}</strong></p>
        <p className="text-4xl font-bold mb-2" style={{ color: "var(--acnu-primary)" }}>{tentative.score}%</p>
        <p className="text-sm text-slate-500 mb-6">Seuil requis : {tentative.examen.seuilReussite}%</p>

        {reussi ? (
          <Link href="/apprenant/certificats" className="btn-primary">Voir mon certificat</Link>
        ) : (
          <div>
            <p className="text-sm text-slate-500 mb-4">
              {tentative.peutRepasser ? `Vous pourrez repasser l'examen le ${new Date(tentative.peutRepasser).toLocaleString("fr-FR")}` : "Vous pouvez repasser l'examen."}
            </p>
            <Link href="/apprenant/dashboard" className="btn-secondary">Retour au tableau de bord</Link>
          </div>
        )}
      </div>
    </div>
  );
}
