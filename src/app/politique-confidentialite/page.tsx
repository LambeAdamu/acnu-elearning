import PageLegale from "@/components/layout/PageLegale";

export default function PolitiqueConfidentialitePage() {
  return (
    <PageLegale titre="Politique de confidentialité">
      <p>ACNU-Learning collecte uniquement les données nécessaires au fonctionnement de la plateforme :</p>
      <ul>
        <li>Nom, prénom, email, téléphone et catégorie choisie à l'inscription</li>
        <li>Identifiant et mot de passe (stocké de façon chiffrée, jamais en clair)</li>
        <li>Progression, notes aux examens et certificats obtenus</li>
        <li>Note de satisfaction (facultative) après obtention d'un certificat</li>
        <li>Adresse IP, utilisée uniquement pour la protection anti-robot du formulaire d'inscription</li>
      </ul>
      <p>Ces données sont partagées uniquement avec les prestataires techniques nécessaires (hébergement, stockage des vidéos, envoi des emails) et ne sont jamais vendues à des tiers.</p>
      <p>Vous pouvez à tout moment demander l'accès, la rectification ou la suppression de vos données auprès de l'administration d'ACNU-Learning. Pour un apprenant mineur, ces droits sont exercés par son représentant légal.</p>
      <p>Pour le texte complet de la politique de confidentialité, contactez l'administration d'ACNU-Learning.</p>
    </PageLegale>
  );
}
