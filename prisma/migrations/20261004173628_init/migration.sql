-- CreateEnum
CREATE TYPE "Role" AS ENUM ('APPRENANT', 'ADMIN', 'FORMATEUR');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('DIPLOMATE_JUNIOR', 'DEPUTE_JUNIOR', 'AMBASSADEUR_JUNIOR', 'SENATEUR_JUNIOR');

-- CreateEnum
CREATE TYPE "StatutInscription" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REFUSE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "identifiant" TEXT,
    "password" TEXT,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'APPRENANT',
    "category" "Category",
    "statut" "StatutInscription" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "validatedAt" TIMESTAMP(3),
    "validatedById" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "ordre" INTEGER NOT NULL,
    "contenuVideo" TEXT,
    "contenuAudio" TEXT,
    "contenuTexte" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "certificatTemplateUrl" TEXT,
    "certifNomY" DOUBLE PRECISION DEFAULT 420,
    "certifCodeY" DOUBLE PRECISION DEFAULT 120,
    "certifDateY" DOUBLE PRECISION DEFAULT 160,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Examen" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "seuilReussite" INTEGER NOT NULL DEFAULT 70,
    "duree" INTEGER,
    "questions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Examen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progression" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "estTermine" BOOLEAN NOT NULL DEFAULT false,
    "note" INTEGER,
    "dateCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tentative" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examenId" TEXT NOT NULL,
    "score" INTEGER,
    "reussi" BOOLEAN NOT NULL DEFAULT false,
    "reponses" JSONB NOT NULL,
    "dateTentative" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "peutRepasser" TIMESTAMP(3),

    CONSTRAINT "Tentative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "dateObtention" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlFichier" TEXT,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Satisfaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "certificatId" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Satisfaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_identifiant_key" ON "User"("identifiant");

-- CreateIndex
CREATE UNIQUE INDEX "Module_category_ordre_key" ON "Module"("category", "ordre");

-- CreateIndex
CREATE UNIQUE INDEX "Examen_moduleId_key" ON "Examen"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Progression_userId_moduleId_key" ON "Progression"("userId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificat_code_key" ON "Certificat"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Satisfaction_certificatId_key" ON "Satisfaction"("certificatId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examen" ADD CONSTRAINT "Examen_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progression" ADD CONSTRAINT "Progression_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progression" ADD CONSTRAINT "Progression_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tentative" ADD CONSTRAINT "Tentative_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tentative" ADD CONSTRAINT "Tentative_examenId_fkey" FOREIGN KEY ("examenId") REFERENCES "Examen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificat" ADD CONSTRAINT "Certificat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificat" ADD CONSTRAINT "Certificat_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Satisfaction" ADD CONSTRAINT "Satisfaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Satisfaction" ADD CONSTRAINT "Satisfaction_certificatId_fkey" FOREIGN KEY ("certificatId") REFERENCES "Certificat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
