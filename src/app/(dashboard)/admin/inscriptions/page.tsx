import { prisma } from "@/lib/prisma";
import InscriptionsClient from "./InscriptionsClient";

export default async function InscriptionsPage() {
  const inscriptions = await prisma.user.findMany({
    where: { role: "APPRENANT", statut: "EN_ATTENTE" },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-1 text-slate-800">Inscriptions en attente</h1>
      <p className="text-sm text-slate-500 mb-6">
        Validez la catégorie de chaque demande pour générer et envoyer automatiquement les
        identifiants de connexion par email.
      </p>
      <InscriptionsClient inscriptions={JSON.parse(JSON.stringify(inscriptions))} />
    </div>
  );
}
