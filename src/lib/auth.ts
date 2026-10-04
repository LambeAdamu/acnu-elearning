import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifiant: { label: "Identifiant ou email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const login = credentials?.identifiant as string;
        if (!login || !credentials?.password) return null;

        const user = await prisma.user.findFirst({
          where: { OR: [{ identifiant: login }, { email: login }] },
        });
        if (!user || !user.password) return null;
        if (user.statut !== "VALIDE" && user.role === "APPRENANT") return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          category: user.category,
          mustChangePassword: user.mustChangePassword,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
        token.category = (user as any).category;
        token.mustChangePassword = (user as any).mustChangePassword;
      }
      if (trigger === "update" && session?.mustChangePassword !== undefined) {
        token.mustChangePassword = session.mustChangePassword;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).category = token.category as string | null;
        (session.user as any).mustChangePassword = token.mustChangePassword as boolean;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};

// Rendu de session côté serveur (App Router). NextAuth v4 ne fournit pas
// `auth()` : on l'expose via getServerSession pour que l'API des pages
// resemble à celle de la v5.
export const auth = () => getServerSession(authOptions);
