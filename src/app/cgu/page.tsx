import PageLegale from "@/components/layout/PageLegale";

export default function CguPage() {
  return (
    <PageLegale titre="Conditions Générales d'Utilisation">
      <p>L'inscription et l'utilisation d'ACNU-Learning impliquent l'acceptation des points suivants :</p>
      <ul>
        <li>Le cursus (catégorie) choisi à l'inscription est <b>définitif</b> après validation par un administrateur.</li>
        <li>L'apprenant est responsable de la confidentialité de son mot de passe et de toute activité effectuée depuis son compte.</li>
        <li>Pour un apprenant <b>mineur</b>, l'inscription doit être réalisée avec l'autorisation d'un parent ou tuteur légal.</li>
        <li>Les contenus pédagogiques et la marque ACNU-Learning sont protégés ; le téléchargement des vidéos et le partage de comptes sont interdits.</li>
        <li>Les certificats délivrés sont personnels et destinés à valoriser le parcours de l'apprenant.</li>
        <li>La plateforme peut évoluer ou être temporairement indisponible pour maintenance.</li>
      </ul>
      <p>Pour le texte complet des CGU, contactez l'administration d'ACNU-Learning.</p>
    </PageLegale>
  );
}
