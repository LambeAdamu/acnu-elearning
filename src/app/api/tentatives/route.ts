import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { genererCertificat, genererCertificatDepuisTemplate } from "@/lib/pdfGenerator";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const userId = (session.user as any).id;
  const body = await req.json();
  const { examenId, reponses } = body;

  const examen = await prisma.examen.findUnique({ where: { id: examenId }, include: { module: true } });
  if (!examen) return NextResponse.json({ error: "Examen introuvable" }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.category || user.category !== examen.module.category) {
    return NextResponse.json({ error: "Ce module n'appartient pas à votre cursus" }, { status: 403 });
  }

  const progressionExistante = await prisma.progression.findUnique({
    where: { userId_moduleId: { userId, moduleId: examen.moduleId } },
  });
  if (progressionExistante?.estTermine) {
    return NextResponse.json({ error: "Module déjà validé" }, { status: 400 });
  }

  const derniereTentative = await prisma.tentative.findFirst({
    where: { userId, examenId },
    orderBy: { dateTentative: "desc" },
  });
  if (derniereTentative && !derniereTentative.reussi) {
    if (derniereTentative.peutRepasser && new Date() < new Date(derniereTentative.peutRepasser)) {
      return NextResponse.json({ error: "Vous devez attendre 24h avant de repasser" }, { status: 400 });
    }
  }

  const questions = examen.questions as any[];
  let score = 0;
  const totalQuestions = questions.length;
  for (let i = 0; i < totalQuestions; i++) {
    const q = questions[i];
    const reponseUser = reponses[i];
    if (q.type === "qcm") {
      if (Array.isArray(reponseUser) && JSON.stringify(reponseUser) === JSON.stringify(q.reponse)) score += 1;
    } else if (q.type === "vf") {
      if (reponseUser === q.reponse) score += 1;
    } else if (q.type === "texte") {
      if (reponseUser?.trim().toLowerCase() === q.reponse?.trim().toLowerCase()) score += 1;
    }
  }
  const note = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const reussi = note >= examen.seuilReussite;

  const tentative = await prisma.tentative.create({
    data: {
      userId,
      examenId,
      score: note,
      reussi,
      reponses,
      peutRepasser: reussi ? null : new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  if (reussi) {
    await prisma.progression.upsert({
      where: { userId_moduleId: { userId, moduleId: examen.moduleId } },
      update: { estTermine: true, note, dateCompletion: new Date() },
      create: { userId, moduleId: examen.moduleId, estTermine: true, note },
    });

    const module = examen.module;
    const { url: pdfUrl, code } = module.certificatTemplateUrl
      ? await genererCertificatDepuisTemplate(module.certificatTemplateUrl, user, module, user.category!, note)
      : await genererCertificat(user, module, user.category!, note);

    await prisma.certificat.create({
      data: {
        userId,
        moduleId: examen.moduleId,
        nom: user.name || "Apprenant",
        category: user.category!,
        urlFichier: pdfUrl,
        code,
      },
    });
  }

  return NextResponse.json({ tentative, reussi, note });
}
