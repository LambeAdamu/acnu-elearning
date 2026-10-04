import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { getTheme, categoryLabel } from "@/lib/themes";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!user) redirect("/login");

  const isAdmin = user.role === "ADMIN" || user.role === "FORMATEUR";
  const theme = getTheme(user.category);
  const roleLabel = isAdmin
    ? user.role === "ADMIN" ? "Administrateur" : "Formateur"
    : categoryLabel(user.category);

  return (
    // data-theme applique automatiquement les couleurs de LA catégorie de
    // l'apprenant connecté à toute la plateforme (voir globals.css)
    <div data-theme={theme.slug} className="min-h-screen flex flex-col">
      <Header userName={user.name} roleLabel={roleLabel} />
      <div className="flex flex-1">
        <Sidebar isAdmin={isAdmin} />
        <main className="flex-1 bg-gris">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
