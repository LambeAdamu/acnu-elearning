import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") ?? (session.user as any).id;
  const isOwner = (session.user as any).id === userId;
  const role = (session.user as any).role;
  if (!isOwner && role !== "ADMIN" && role !== "FORMATEUR") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const certificats = await prisma.certificat.findMany({
    where: { userId },
    include: { module: true },
    orderBy: { dateObtention: "desc" },
  });
  return NextResponse.json({ certificats });
}
