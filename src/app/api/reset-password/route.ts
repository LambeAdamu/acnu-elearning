import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, nouveau } = await req.json();
  if (!token || !nouveau) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  if (nouveau.length < 8) return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 });

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "Ce lien est invalide ou a expiré. Refaites une demande." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(nouveau, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashed, mustChangePassword: false } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  return NextResponse.json({ success: true });
}
