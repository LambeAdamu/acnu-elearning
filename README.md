# ACNU-LEARNING

LMS multi-catégories pour former les jeunes leaders (Diplomate, Député, Ambassadeur, Sénateur Junior),
construit avec **Next.js 14 (App Router)**, **Prisma**, **NextAuth (Auth.js)**, **Cloudinary**,
**Resend** (emails) et **Tailwind CSS**.

## Fonctionnalités

- Inscription publique avec choix d'UNE catégorie (définitif après validation), protégée par un
  **captcha mathématique auto-hébergé**, un **champ honeypot** et une **limitation de débit par IP**
  (voir `src/lib/captcha.ts` et `src/lib/rateLimit.ts`)
- Workflow de validation admin : chaque demande passe par `EN_ATTENTE` → `VALIDE` / `REFUSE`
- Génération automatique d'un identifiant + mot de passe temporaire à la validation, envoyés par email (Resend)
- Changement de mot de passe obligatoire à la première connexion
- **Récupération de mot de passe oublié** (lien à usage unique valable 1h, envoyé par email)
- Thème visuel qui change automatiquement selon la catégorie de l'apprenant connecté
- 4 cursus indépendants (modules numérotés par catégorie), déblocage linéaire (seuil 70%)
- Lecteurs vidéo/audio/texte protégés contre le téléchargement
- Certificat PDF automatique (logo, signature, cachet ACNU) ou superposé sur un modèle pré-signé
- **Sondage de satisfaction** (1 à 5 étoiles) proposé à l'apprenant après chaque certificat obtenu
- **Tableau de bord KPI** (taux de complétion, taux de réussite aux examens, satisfaction) par cursus,
  avec **export CSV** pour le rapport trimestriel d'impact (`/admin/kpi`)
- **Import en masse d'apprenants par CSV** (`/admin/apprenants/importer`) — pour charger une liste déjà
  existante, avec validation immédiate optionnelle (envoi automatique des identifiants)
- **Page d'accueil publique** (vitrine) présentant les 4 cursus, avant la connexion
- Pages **CGU** (`/cgu`) et **Politique de confidentialité** (`/politique-confidentialite`) accessibles
  publiquement, avec case à cocher obligatoire à l'inscription
- **Sélecteur de langue FR / EN** sur la page d'accueil et les pages de connexion/inscription (voir
  `src/lib/i18n/`), avec préférence mémorisée (cookie + localStorage)
- **Cartes catégories en couleur pleine** sur la page d'accueil (fond Bordeaux/Bleu ONU/Gris clair/Bleu
  nuit selon le cursus, texte en gras assorti)
- Back-office complet : inscriptions, modules (4 cursus), examens, apprenants, certificats, KPI

## Installation

```bash
npm install
# configurer .env.local (DB, Cloudinary, Resend, NextAuth, CAPTCHA_SECRET)
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Compte admin de démo : `admin@acnu-learning.org` / `admin1234`

## Variables d'environnement

`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CAPTCHA_SECRET`.

## Anti-spam / sécurité des inscriptions

Trois protections cumulées sur `/api/register` (voir `src/lib/captcha.ts` et `src/lib/rateLimit.ts`) :
1. **Honeypot** — champ caché que seuls les robots remplissent.
2. **Rate limiting** — 5 tentatives d'inscription max par IP et par heure (en mémoire ; voir le
   commentaire dans `rateLimit.ts` pour migrer vers Upstash Redis en production multi-instances).
3. **Captcha mathématique** — question générée et signée côté serveur, sans dépendance externe.

## Documents légaux

Des modèles de CGU et de Politique de confidentialité sont fournis séparément (PDF) — à faire
relire par un juriste avant publication, notamment sur les clauses relatives aux mineurs et au
droit applicable localement.

## Logique de thème

`src/lib/themes.ts` définit les 4 identités (couleurs primaire/foncée/accent). Le layout du
dashboard (`src/app/(dashboard)/layout.tsx`) pose l'attribut `data-theme` sur le conteneur
racine selon la catégorie de l'utilisateur connecté ; `src/app/globals.css` définit les
variables CSS correspondantes, utilisées par tous les composants.

## Guides fournis séparément

Guide admin (non technique), Guide apprenant, Guide admin pro (technique), Cahier des charges
& budget (FCFA), CGU, Politique de confidentialité.
