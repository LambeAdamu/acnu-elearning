import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "FORMATEUR")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const inscriptions = await prisma.user.findMany({
    where: { role: "APPRENANT", statut: "EN_ATTENTE" },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ inscriptions });
}
