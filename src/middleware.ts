import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware exécuté dans le runtime Edge : on ne doit importer QUE
// "next/server" et "next-auth/jwt". Importer "@/lib/auth" (next-auth core,
// Prisma, bcrypt) fait échouer le bundle Edge avec une erreur openid-client.
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const role = (token?.role as string | undefined) ?? undefined;
  const mustChange = (token?.mustChangePassword as boolean | undefined) ?? false;

  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/en-attente") ||
    pathname.startsWith("/mot-de-passe-oublie") ||
    pathname.startsWith("/reinitialiser-mot-de-passe") ||
    pathname.startsWith("/cgu") ||
    pathname.startsWith("/politique-confidentialite");
  const isAdminPage = pathname.startsWith("/admin");
  const isChangePasswordPage = pathname.startsWith("/changer-mot-de-passe");

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // La page d'accueil et les pages légales restent consultables même
  // connecté — seules login/register/etc. renvoient vers le tableau de bord.
  const pageAccessibleMemeConnecte =
    pathname === "/" ||
    pathname.startsWith("/cgu") ||
    pathname.startsWith("/politique-confidentialite");
  if (
    isLoggedIn &&
    isPublicPage &&
    !pageAccessibleMemeConnecte &&
    !pathname.startsWith("/en-attente")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (isLoggedIn && mustChange && !isChangePasswordPage) {
    return NextResponse.redirect(new URL("/changer-mot-de-passe", req.url));
  }
  if (isAdminPage && role !== "ADMIN" && role !== "FORMATEUR") {
    return NextResponse.redirect(new URL("/apprenant/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
