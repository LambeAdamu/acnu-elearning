import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pourcentage } from "@/utils/helpers";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const isOwner = (session.user as any).id === params.userId;
  const role = (session.user as any).role;
  if (!isOwner && role !== "ADMIN" && role !== "FORMATEUR") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  const progressions = await prisma.progression.findMany({
    where: { userId: params.userId },
    include: { module: true },
    orderBy: { module: { ordre: "asc" } },
  });

  const totalModules = user?.category ? await prisma.module.count({ where: { category: user.category } }) : 0;
  const completed = progressions.filter((p) => p.estTermine).length;

  return NextResponse.json({ progressions, pourcentage: pourcentage(completed, totalModules) });
}
