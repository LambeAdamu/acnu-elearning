import { Category } from "@prisma/client";

/**
 * Identité visuelle des 4 cursus ACNU-LEARNING.
 * `slug` correspond à l'attribut data-theme posé sur le layout du dashboard
 * (voir src/app/(dashboard)/layout.tsx) et aux variables CSS définies dans
 * src/app/globals.css ([data-theme="..."] { --acnu-primary: ... }).
 */
export const THEMES: Record<
  Category,
  {
    slug: string; label: string; description: string; primary: string; dark: string; accent: string;
    // Couleurs de la carte catégorie sur la page d'accueil (fond plein, pas juste une barre) :
    cardBg: string; cardText: string; cardBorder?: string;
  }
> = {
  DIPLOMATE_JUNIOR: {
    slug: "diplomate",
    label: "Diplomate Junior",
    description: "Bordeaux + Bleu des Nations Unies — ambiance protocolaire ONU",
    primary: "#7A1F2B",
    dark: "#5C1620",
    accent: "#009EDB",
    cardBg: "#7A1F2B",       // fond bordeaux
    cardText: "#FFFFFF",     // texte blanc gras
    cardBorder: "#009EDB",   // bordure bleu ONU
  },
  DEPUTE_JUNIOR: {
    slug: "depute",
    label: "Député Junior",
    description: "Bleu des Nations Unies — ambiance parlementaire",
    primary: "#009EDB",
    dark: "#0072A3",
    accent: "#5BC2E7",
    cardBg: "#009EDB",       // fond bleu ONU
    cardText: "#FFFFFF",     // texte blanc gras
  },
  AMBASSADEUR_JUNIOR: {
    slug: "ambassadeur",
    label: "Ambassadeur Junior",
    description: "Gris clair + Bleu — ambiance diplomatie, sérieux",
    primary: "#4B5563",
    dark: "#374151",
    accent: "#2563EB",
    cardBg: "#E5E7EB",       // fond gris clair
    cardText: "#111827",     // texte noir
  },
  SENATEUR_JUNIOR: {
    slug: "senateur",
    label: "Sénateur Junior",
    description: "Bleu nuit — prestige, ambiance sénat",
    primary: "#0B1F3A",
    dark: "#071429",
    accent: "#C9A227",
    cardBg: "#0B1F3A",       // fond bleu nuit
    cardText: "#FFFFFF",     // texte blanc gras
  },
};

// Thème neutre utilisé sur les pages publiques (login, register) avant
// qu'un apprenant ne soit rattaché à sa catégorie.
export const THEME_NEUTRE = {
  slug: "neutre",
  label: "ACNU-Learning",
  primary: "#0B1F3A",
  dark: "#071429",
  accent: "#C9A227",
};

export function getTheme(category: Category | null | undefined) {
  if (!category) return THEME_NEUTRE;
  return THEMES[category];
}

export function categoryLabel(category: Category | null | undefined): string {
  if (!category) return "Non attribuée";
  return THEMES[category].label;
}

// Code court utilisé dans le code unique du certificat (ex: ACNU-DEP26XXXX)
export function categoryCode(category: Category): string {
  switch (category) {
    case "DIPLOMATE_JUNIOR": return "DIP";
    case "DEPUTE_JUNIOR": return "DEP";
    case "AMBASSADEUR_JUNIOR": return "AMB";
    case "SENATEUR_JUNIOR": return "SEN";
  }
}

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "DIPLOMATE_JUNIOR", label: "Diplomate Junior" },
  { value: "DEPUTE_JUNIOR", label: "Député Junior" },
  { value: "AMBASSADEUR_JUNIOR", label: "Ambassadeur Junior" },
  { value: "SENATEUR_JUNIOR", label: "Sénateur Junior" },
];
