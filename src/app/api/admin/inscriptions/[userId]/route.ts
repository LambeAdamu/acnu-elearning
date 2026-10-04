import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { genererIdentifiant, genererMotDePasseTemporaire } from "@/utils/helpers";
import { envoyerIdentifiants, envoyerRefus } from "@/lib/resend";
import { categoryLabel } from "@/lib/themes";

// PATCH { action: "valider" | "refuser", category? (pour corriger la catégorie), motif? }
export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "FORMATEUR")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  const target = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!target) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  if (body.action === "refuser") {
    await prisma.user.update({ where: { id: target.id }, data: { statut: "REFUSE" } });
    try {
      await envoyerRefus({ to: target.email, nomComplet: target.name || target.email, motif: body.motif });
    } catch (e) {
      console.error("Erreur envoi email de refus", e);
    }
    return NextResponse.json({ success: true });
  }

  // action === "valider" : l'admin peut ajuster la catégorie avant validation finale
  const category = body.category || target.category;
  if (!category) {
    return NextResponse.json({ error: "Catégorie manquante" }, { status: 400 });
  }

  // Génère un identifiant unique (en gérant les collisions improbables)
  let identifiant = genererIdentifiant(target.nom, target.prenom);
  let tentative = 0;
  while (await prisma.user.findUnique({ where: { identifiant } })) {
    tentative++;
    identifiant = genererIdentifiant(target.nom, target.prenom) + tentative;
    if (tentative > 5) break;
  }

  const motDePasse = genererMotDePasseTemporaire();
  const hashed = await bcrypt.hash(motDePasse, 10);

  await prisma.user.update({
    where: { id: target.id },
    data: {
      statut: "VALIDE",
      category,
      identifiant,
      password: hashed,
      mustChangePassword: true,
      validatedAt: new Date(),
      validatedById: (session!.user as any).id,
    },
  });

  try {
    await envoyerIdentifiants({
      to: target.email,
      nomComplet: target.name || target.email,
      identifiant,
      motDePasse,
      categorieLabel: categoryLabel(category),
    });
  } catch (e) {
    console.error("Erreur envoi email des identifiants", e);
  }

  return NextResponse.json({ success: true, identifiant, motDePasse });
}
