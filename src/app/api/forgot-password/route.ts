import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { envoyerReinitialisation } from "@/lib/resend";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const DUREE_VALIDITE_MS = 60 * 60 * 1000; // 1 heure

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { ok } = rateLimit(`forgot:${ip}`, 5, 60 * 60 * 1000);
  if (!ok) {
    return NextResponse.json({ error: "Trop de demandes. Réessayez plus tard." }, { status: 429 });
  }

  const { identifiant } = await req.json();
  if (!identifiant) return NextResponse.json({ error: "Identifiant ou email requis" }, { status: 400 });

  const user = await prisma.user.findFirst({ where: { OR: [{ identifiant }, { email: identifiant }] } });

  // Réponse volontairement identique que le compte existe ou non, pour ne
  // pas permettre à quelqu'un de deviner quels emails sont enregistrés.
  const reponseGenerique = NextResponse.json({
    message: "Si un compte correspond, un email de réinitialisation vient d'être envoyé.",
  });

  if (!user || !user.email) return reponseGenerique;

  const tokenClair = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(tokenClair).digest("hex");

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + DUREE_VALIDITE_MS),
    },
  });

  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const lien = `${base}/reinitialiser-mot-de-passe?token=${tokenClair}`;

  try {
    await envoyerReinitialisation({ to: user.email, nomComplet: user.name || user.email, lien });
  } catch (e) {
    console.error("Erreur envoi email de réinitialisation", e);
  }

  return reponseGenerique;
}
