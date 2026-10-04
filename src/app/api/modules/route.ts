import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { validateModuleForm } from "@/lib/validations";

// GET /api/modules?category=DEPUTE_JUNIOR -> liste des modules d'un cursus
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const modules = await prisma.module.findMany({
    where: category ? { category: category as any } : undefined,
    orderBy: [{ category: "asc" }, { ordre: "asc" }],
  });
  return NextResponse.json({ modules });
}

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "FORMATEUR")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  const error = validateModuleForm(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  if (!body.category) return NextResponse.json({ error: "Catégorie (cursus) requise" }, { status: 400 });

  const module = await prisma.module.create({
    data: {
      category: body.category,
      titre: body.titre,
      description: body.description,
      ordre: Number(body.ordre),
      contenuTexte: body.contenuTexte,
      certifNomY: body.certifNomY,
      certifCodeY: body.certifCodeY,
      certifDateY: body.certifDateY,
      creatorId: (session.user as any).id,
    },
  });

  return NextResponse.json({ module }, { status: 201 });
}
