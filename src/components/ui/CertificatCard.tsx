import { formatDate } from "@/utils/helpers";

export default function CertificatCard({
  moduleTitre, dateObtention, code, urlFichier,
}: { moduleTitre: string; dateObtention: Date | string; code: string; urlFichier: string | null }) {
  return (
    <div className="card p-5 border-t-4 relative overflow-hidden" style={{ borderTopColor: "var(--acnu-accent)" }}>
      <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: "var(--acnu-primary)" }}>
        Certificat ACNU-Learning
      </p>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{moduleTitre}</h3>
      <p className="text-sm text-slate-500 mb-3">Obtenu le {formatDate(dateObtention)}</p>
      <p className="text-xs text-slate-400 mb-4">Code : {code}</p>
      {urlFichier && <a href={urlFichier} target="_blank" rel="noreferrer" className="btn-primary text-sm">Télécharger le PDF</a>}
    </div>
  );
}
