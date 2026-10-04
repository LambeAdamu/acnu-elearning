import { categoryCode } from "@/lib/themes";
import { Category } from "@prisma/client";

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function pourcentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

/**
 * Génère un identifiant de connexion à partir du nom et prénom.
 * Format : <1ère lettre du nom><3 premières lettres du prénom><3 chiffres aléatoires>
 * Exemple : Nom "BEBONE", Prénom "Franck" → "bfra482"
 * (l'unicité finale est garantie côté appelant en cas de collision).
 */
export function genererIdentifiant(nom: string, prenom: string): string {
  const n = (nom || "x").trim().replace(/\s+/g, "")[0]?.toLowerCase() || "x";
  const p = (prenom || "user").trim().replace(/\s+/g, "").slice(0, 3).toLowerCase();
  const chiffres = String(Math.floor(100 + Math.random() * 900)); // 3 chiffres
  return `${n}${p}${chiffres}`;
}

/**
 * Génère un mot de passe temporaire sécurisé : au moins une majuscule, une
 * minuscule, un chiffre et un caractère spécial (10 caractères par défaut).
 */
export function genererMotDePasseTemporaire(longueur = 10): string {
  const maj = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const min = "abcdefghijkmnopqrstuvwxyz";
  const chiffres = "23456789";
  const speciaux = "!@#$%*?-_";
  const tous = maj + min + chiffres + speciaux;
  const rand = (max: number) => Math.floor(Math.random() * max);

  const obligatoires = [maj[rand(maj.length)], min[rand(min.length)], chiffres[rand(chiffres.length)], speciaux[rand(speciaux.length)]];
  const reste = Array.from({ length: Math.max(0, longueur - obligatoires.length) }, () => tous[rand(tous.length)]);
  const caracteres = [...obligatoires, ...reste];
  for (let i = caracteres.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [caracteres[i], caracteres[j]] = [caracteres[j], caracteres[i]];
  }
  return caracteres.join("");
}

/** Code unique de certificat, ex: ACNU-DEP26A1B2 */
export function genererCodeCertificat(category: Category): string {
  const annee = new Date().getFullYear().toString().slice(-2);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let suffixe = "";
  for (let i = 0; i < 4; i++) suffixe += chars[Math.floor(Math.random() * chars.length)];
  return `ACNU-${categoryCode(category)}${annee}${suffixe}`;
}
