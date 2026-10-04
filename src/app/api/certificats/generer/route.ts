import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { genererCertificat } from "@/lib/pdfGenerator";

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "FORMATEUR")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { userId, moduleId, note } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const module = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!user || !module || !user.category) {
    return NextResponse.json({ error: "Utilisateur ou module introuvable" }, { status: 404 });
  }

  const { url, code } = await genererCertificat(user, module, user.category, note ?? 100);
  const certificat = await prisma.certificat.create({
    data: { userId, moduleId, nom: user.name || "Apprenant", category: user.category, urlFichier: url, code },
  });

  return NextResponse.json({ certificat });
}
