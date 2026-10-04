import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LandingContent from "@/components/LandingContent";

export default async function Home() {
  const session = await auth();
  if (session) {
    const role = (session.user as any).role;
    redirect(role === "ADMIN" || role === "FORMATEUR" ? "/admin/dashboard" : "/apprenant/dashboard");
  }

  return <LandingContent />;
}
