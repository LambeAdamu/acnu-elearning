import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { validateExamenForm } from "@/lib/validations";

export async function GET() {
  const examens = await prisma.examen.findMany({ include: { module: true } });
  return NextResponse.json({ examens });
}

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "FORMATEUR")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  const error = validateExamenForm(body);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const examen = await prisma.examen.create({
    data: {
      moduleId: body.moduleId,
      seuilReussite: body.seuilReussite ?? 70,
      duree: body.duree,
      questions: body.questions,
    },
  });
  return NextResponse.json({ examen }, { status: 201 });
}
