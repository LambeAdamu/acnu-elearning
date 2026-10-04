import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;
  const mustChange = (req.auth?.user as any)?.mustChangePassword;

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
  const pageAccessibleMemeConnecte = pathname === "/" || pathname.startsWith("/cgu") || pathname.startsWith("/politique-confidentialite");
  if (isLoggedIn && isPublicPage && !pageAccessibleMemeConnecte && !pathname.startsWith("/en-attente")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (isLoggedIn && mustChange && !isChangePasswordPage) {
    return NextResponse.redirect(new URL("/changer-mot-de-passe", req.url));
  }
  if (isAdminPage && role !== "ADMIN" && role !== "FORMATEUR") {
    return NextResponse.redirect(new URL("/apprenant/dashboard", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
