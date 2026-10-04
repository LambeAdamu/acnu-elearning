import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { moduleId: string } }) {
  const examen = await prisma.examen.findUnique({ where: { moduleId: params.moduleId } });
  if (!examen) return NextResponse.json({ error: "Examen introuvable" }, { status: 404 });
  return NextResponse.json({ examen });
}

export async function PUT(req: Request, { params }: { params: { moduleId: string } }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "FORMATEUR")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const body = await req.json();
  const examen = await prisma.examen.update({
    where: { moduleId: params.moduleId },
    data: { seuilReussite: body.seuilReussite, duree: body.duree, questions: body.questions },
  });
  return NextResponse.json({ examen });
}
