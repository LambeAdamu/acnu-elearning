import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const userId = (session.user as any).id;

  const { certificatId, note, commentaire } = await req.json();
  if (!certificatId || !note || note < 1 || note > 5) {
    return NextResponse.json({ error: "Note invalide (1 à 5 requis)" }, { status: 400 });
  }

  const certificat = await prisma.certificat.findUnique({ where: { id: certificatId } });
  if (!certificat || certificat.userId !== userId) {
    return NextResponse.json({ error: "Certificat introuvable" }, { status: 404 });
  }

  const satisfaction = await prisma.satisfaction.upsert({
    where: { certificatId },
    update: { note, commentaire },
    create: { userId, certificatId, note, commentaire },
  });

  return NextResponse.json({ satisfaction });
}
