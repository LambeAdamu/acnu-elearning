import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@acnu-learning.org" },
    update: {},
    create: {
      email: "admin@acnu-learning.org",
      password: adminPassword,
      nom: "ACNU",
      prenom: "Admin",
      name: "Admin ACNU",
      role: "ADMIN",
      statut: "VALIDE",
      mustChangePassword: false,
    },
  });

  const module1 = await prisma.module.upsert({
    where: { category_ordre: { category: "DEPUTE_JUNIOR", ordre: 1 } },
    update: {},
    create: {
      category: "DEPUTE_JUNIOR",
      titre: "Introduction au travail parlementaire",
      description: "Rôle et fonctionnement d'un député junior.",
      ordre: 1,
      contenuTexte: "<h2>Bienvenue</h2><p>Ce module introduit le rôle du député junior.</p>",
      creatorId: admin.id,
    },
  });

  await prisma.examen.upsert({
    where: { moduleId: module1.id },
    update: {},
    create: {
      moduleId: module1.id,
      seuilReussite: 70,
      duree: 15,
      questions: [
        { question: "Un député junior siège dans un parlement.", type: "vf", reponse: true },
        { question: "Quel est le rôle principal d'un député ?", type: "texte", reponse: "representer" },
      ],
    },
  });

  console.log("Seed terminé. Admin : admin@acnu-learning.org / admin1234");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
