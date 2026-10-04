/**
 * Limitation de débit (anti-spam) très simple, en mémoire.
 *
 * ⚠️ Limite connue : ce compteur vit dans la mémoire du processus Node.
 * Sur un hébergement multi-instances / serverless (ex: plusieurs fonctions
 * Vercel en parallèle), chaque instance a son propre compteur — la
 * protection est donc affaiblie mais pas nulle. Pour une protection
 * robuste en production à fort trafic, remplacer ce module par un stockage
 * partagé (ex: Upstash Redis, voir commentaire en bas de fichier).
 */

type Entree = { count: number; resetAt: number };
const compteurs = new Map<string, Entree>();

export function rateLimit(cle: string, maxRequetes: number, fenetreMs: number): { ok: boolean; restant: number } {
  const maintenant = Date.now();
  const entree = compteurs.get(cle);

  if (!entree || maintenant > entree.resetAt) {
    compteurs.set(cle, { count: 1, resetAt: maintenant + fenetreMs });
    return { ok: true, restant: maxRequetes - 1 };
  }

  if (entree.count >= maxRequetes) {
    return { ok: false, restant: 0 };
  }

  entree.count += 1;
  return { ok: true, restant: maxRequetes - entree.count };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/*
 * Migration vers Upstash Redis (recommandé en production) :
 *
 *   import { Ratelimit } from "@upstash/ratelimit";
 *   import { Redis } from "@upstash/redis";
 *   const ratelimit = new Ratelimit({
 *     redis: Redis.fromEnv(),
 *     limiter: Ratelimit.slidingWindow(5, "1 h"),
 *   });
 *   const { success } = await ratelimit.limit(ip);
 *
 * Remplacer alors les appels à rateLimit() par ratelimit.limit(ip).
 */
