import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { moduleId: string } }) {
  const module = await prisma.module.findUnique({ where: { id: params.moduleId }, include: { examens: true } });
  if (!module) return NextResponse.json({ error: "Module introuvable" }, { status: 404 });
  return NextResponse.json({ module });
}

export async function PUT(req: Request, { params }: { params: { moduleId: string } }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "FORMATEUR")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  const module = await prisma.module.update({
    where: { id: params.moduleId },
    data: {
      titre: body.titre,
      description: body.description,
      ordre: body.ordre !== undefined ? Number(body.ordre) : undefined,
      contenuTexte: body.contenuTexte,
      certifNomY: body.certifNomY,
      certifCodeY: body.certifCodeY,
      certifDateY: body.certifDateY,
    },
  });
  return NextResponse.json({ module });
}

export async function DELETE(req: Request, { params }: { params: { moduleId: string } }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "FORMATEUR")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  await prisma.module.delete({ where: { id: params.moduleId } });
  return NextResponse.json({ success: true });
}
