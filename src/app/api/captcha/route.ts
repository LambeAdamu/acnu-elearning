import { NextResponse } from "next/server";
import { genererCaptcha } from "@/lib/captcha";

// Fournit une nouvelle question de captcha au formulaire d'inscription.
export async function GET() {
  const { question, token } = genererCaptcha();
  return NextResponse.json({ question, token });
}
