import crypto from "crypto";

/**
 * Captcha mathématique auto-hébergé (ne dépend d'aucun service externe type
 * reCAPTCHA — fonctionne immédiatement, sans clé API à configurer).
 *
 * Principe : le serveur génère "a + b = ?", et encode la réponse attendue
 * dans un jeton signé (HMAC) envoyé au client avec la question. Le client
 * renvoie sa réponse + le jeton ; le serveur revérifie la signature et la
 * valeur — sans avoir besoin de stocker quoi que ce soit en base ou en
 * session.
 *
 * Le secret utilisé est CAPTCHA_SECRET (voir .env.local) ou, à défaut,
 * NEXTAUTH_SECRET.
 */
const SECRET = process.env.CAPTCHA_SECRET || process.env.NEXTAUTH_SECRET || "acnu-captcha-dev-secret";
const DUREE_VALIDITE_MS = 10 * 60 * 1000; // 10 minutes

function signer(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function genererCaptcha(): { question: string; token: string } {
  const a = Math.floor(Math.random() * 8) + 1; // 1-8
  const b = Math.floor(Math.random() * 8) + 1; // 1-8
  const reponse = a + b;
  const expire = Date.now() + DUREE_VALIDITE_MS;
  const payload = `${reponse}:${expire}`;
  const signature = signer(payload);
  const token = Buffer.from(`${payload}:${signature}`).toString("base64");

  return { question: `${a} + ${b}`, token };
}

export function verifierCaptcha(token: string, reponseUtilisateur: string | number): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [reponse, expire, signature] = decoded.split(":");
    const payload = `${reponse}:${expire}`;
    const signatureAttendue = signer(payload);

    if (signature !== signatureAttendue) return false;
    if (Date.now() > Number(expire)) return false;
    if (Number(reponseUtilisateur) !== Number(reponse)) return false;

    return true;
  } catch {
    return false;
  }
}
