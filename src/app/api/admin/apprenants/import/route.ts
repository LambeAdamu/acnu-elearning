import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { genererIdentifiant, genererMotDePasseTemporaire } from "@/utils/helpers";
import { envoyerIdentifiants } from "@/lib/resend";
import { categoryLabel } from "@/lib/themes";
import { Category } from "@prisma/client";

// Normalise une valeur de catégorie fournie dans le CSV : accepte la clé
// technique (DEPUTE_JUNIOR) ou le libellé humain (Député Junior / depute...).
function normaliserCategorie(valeur: string): Category | null {
  const v = valeur.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const map: Record<string, Category> = {
    "DIPLOMATE_JUNIOR": "DIPLOMATE_JUNIOR", "DIPLOMATE JUNIOR": "DIPLOMATE_JUNIOR", "DIPLOMATE": "DIPLOMATE_JUNIOR",
    "DEPUTE_JUNIOR": "DEPUTE_JUNIOR", "DEPUTE JUNIOR": "DEPUTE_JUNIOR", "DEPUTE": "DEPUTE_JUNIOR",
    "AMBASSADEUR_JUNIOR": "AMBASSADEUR_JUNIOR", "AMBASSADEUR JUNIOR": "AMBASSADEUR_JUNIOR", "AMBASSADEUR": "AMBASSADEUR_JUNIOR",
    "SENATEUR_JUNIOR": "SENATEUR_JUNIOR", "SENATEUR JUNIOR": "SENATEUR_JUNIOR", "SENATEUR": "SENATEUR_JUNIOR",
  };
  return map[v] || null;
}

function parserCsv(texte: string): string[][] {
  const delimiteur = texte.split("\n")[0].includes(";") ? ";" : ",";
  return texte
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => l.split(delimiteur).map((c) => c.trim()));
}

/**
 * Import en masse d'apprenants depuis un CSV : nom;prenom;email;telephone;categorie
 * (avec ou sans ligne d'en-tête — détectée automatiquement).
 *
 * Body JSON attendu : { csv: string, validerImmediatement: boolean }
 * - validerImmediatement = false (par défaut) → les comptes sont créés en
 *   statut EN_ATTENTE, comme une inscription normale, à valider un par un
 *   depuis /admin/inscriptions.
 * - validerImmediatement = true → identifiant + mot de passe générés et
 *   envoyés par email immédiatement pour chaque ligne valide (utile pour
 *   importer une liste déjà connue/vérifiée de parlementaires).
 */
export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "FORMATEUR")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { csv, validerImmediatement } = await req.json();
  if (!csv || typeof csv !== "string") {
    return NextResponse.json({ error: "Fichier CSV manquant" }, { status: 400 });
  }

  const lignes = parserCsv(csv);
  if (lignes.length === 0) return NextResponse.json({ error: "CSV vide" }, { status: 400 });

  // Ignore une éventuelle ligne d'en-tête (si la 1ère cellule n'est pas un email valide)
  const premiereColEstEmail = /@/.test(lignes[0][2] || "");
  const donnees = premiereColEstEmail ? lignes : lignes.slice(1);

  const resultats = { crees: 0, ignores: 0, erreurs: [] as string[] };

  for (const [i, ligne] of donnees.entries()) {
    const [nom, prenom, email, telephone, categorieBrute] = ligne;
    const numeroLigne = i + 1;

    if (!nom || !prenom || !email || !categorieBrute) {
      resultats.erreurs.push(`Ligne ${numeroLigne} : champs manquants (attendu nom;prenom;email;telephone;categorie)`);
      continue;
    }
    const category = normaliserCategorie(categorieBrute);
    if (!category) {
      resultats.erreurs.push(`Ligne ${numeroLigne} : catégorie « ${categorieBrute} » non reconnue`);
      continue;
    }

    const existant = await prisma.user.findUnique({ where: { email } });
    if (existant) { resultats.ignores++; continue; }

    if (!validerImmediatement) {
      await prisma.user.create({
        data: { nom, prenom, name: `${prenom} ${nom}`, email, telephone: telephone || null, category, statut: "EN_ATTENTE", role: "APPRENANT" },
      });
      resultats.crees++;
      continue;
    }

    // Validation immédiate : génère identifiant + mot de passe, envoie l'email
    let identifiant = genererIdentifiant(nom, prenom);
    let tentative = 0;
    while (await prisma.user.findUnique({ where: { identifiant } })) {
      tentative++;
      identifiant = genererIdentifiant(nom, prenom) + tentative;
      if (tentative > 5) break;
    }
    const motDePasse = genererMotDePasseTemporaire();
    const hashed = await bcrypt.hash(motDePasse, 10);

    const user = await prisma.user.create({
      data: {
        nom, prenom, name: `${prenom} ${nom}`, email, telephone: telephone || null, category,
        statut: "VALIDE", identifiant, password: hashed, mustChangePassword: true,
        validatedAt: new Date(), validatedById: (session!.user as any).id,
      },
    });

    try {
      await envoyerIdentifiants({ to: user.email, nomComplet: user.name || user.email, identifiant, motDePasse, categorieLabel: categoryLabel(category) });
    } catch (e) {
      console.error("Erreur envoi email import", e);
      resultats.erreurs.push(`Ligne ${numeroLigne} : compte créé mais email non envoyé (${email})`);
    }
    resultats.crees++;
  }

  return NextResponse.json(resultats);
}
