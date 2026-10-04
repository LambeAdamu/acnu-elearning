import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateInscriptionForm } from "@/lib/validations";
import { verifierCaptcha } from "@/lib/captcha";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// Inscription publique : crée un compte APPRENANT en statut EN_ATTENTE,
// SANS mot de passe. Les identifiants ne sont générés qu'après validation
// admin (voir /api/admin/inscriptions/[userId]).
//
// Protections anti-spam (dans l'ordre) :
//  1. Honeypot : un champ caché "site_web" que seuls les robots remplissent.
//  2. Limitation de débit : max 5 tentatives d'inscription / heure / IP.
//  3. Captcha mathématique auto-hébergé (voir src/lib/captcha.ts).
export async function POST(req: Request) {
  const body = await req.json();
  const { nom, prenom, email, telephone, category, captchaToken, captchaReponse, site_web } = body;

  // 1. Honeypot — si ce champ caché est rempli, c'est un robot : on répond
  // "succès" sans rien créer, pour ne pas l'aider à s'adapter.
  if (site_web) {
    return NextResponse.json({ user: { id: "ok" } }, { status: 201 });
  }

  // 2. Limitation de débit par IP
  const ip = getClientIp(req);
  const { ok } = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000); // 5 / heure
  if (!ok) {
    return NextResponse.json(
      { error: "Trop de tentatives d'inscription depuis cette adresse. Réessayez plus tard." },
      { status: 429 }
    );
  }

  // 3. Captcha mathématique
  if (!captchaToken || !verifierCaptcha(captchaToken, captchaReponse)) {
    return NextResponse.json({ error: "Réponse anti-robot incorrecte ou expirée. Réessayez." }, { status: 400 });
  }

  const error = validateInscriptionForm({ nom, prenom, email, telephone, category });
  if (error) return NextResponse.json({ error }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Cet email a déjà une demande ou un compte." }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      nom,
      prenom,
      name: `${prenom} ${nom}`,
      email,
      telephone,
      category,
      statut: "EN_ATTENTE",
      role: "APPRENANT",
    },
  });

  return NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 201 });
}
