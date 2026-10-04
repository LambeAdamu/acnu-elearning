import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CertificatCard from "@/components/ui/CertificatCard";
import SatisfactionWidget from "@/components/ui/SatisfactionWidget";

export default async function CertificatsPage() {
  const session = await auth();
  if (!session) return <div className="p-6">Non authentifié</div>;
  const userId = (session.user as any).id;

  const certificats = await prisma.certificat.findMany({
    where: { userId },
    include: { module: true, satisfaction: true },
    orderBy: { dateObtention: "desc" },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Mes certificats</h1>
      {certificats.length === 0 ? (
        <p className="text-slate-500 text-sm">Vous n'avez pas encore obtenu de certificat. Validez un module pour en débloquer un.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certificats.map((cert) => (
            <div key={cert.id}>
              <CertificatCard moduleTitre={cert.module.titre} dateObtention={cert.dateObtention} code={cert.code} urlFichier={cert.urlFichier} />
              <SatisfactionWidget
                certificatId={cert.id}
                noteInitiale={cert.satisfaction?.note}
                commentaireInitial={cert.satisfaction?.commentaire}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
