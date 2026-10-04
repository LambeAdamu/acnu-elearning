import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { ancien, nouveau } = await req.json();
  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.password) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });

  const isValid = await bcrypt.compare(ancien, user.password);
  if (!isValid) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });

  if (!nouveau || nouveau.length < 8) {
    return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins 8 caractères" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(nouveau, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed, mustChangePassword: false },
  });

  return NextResponse.json({ success: true });
}
