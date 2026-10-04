import Link from "next/link";

export default function EnAttentePage() {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">⏳</div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Demande envoyée !</h2>
      <p className="text-sm text-slate-500 mb-6">
        Votre demande d'inscription a bien été enregistrée. Un administrateur va l'examiner et
        valider votre catégorie. Vous recevrez vos identifiants de connexion par email dès que
        votre compte sera validé.
      </p>
      <Link href="/login" className="btn-secondary">Retour à la connexion</Link>
    </div>
  );
}
