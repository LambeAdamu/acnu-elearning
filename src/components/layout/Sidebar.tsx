import Link from "next/link";

const apprenantLinks = [
  { href: "/apprenant/dashboard", label: "Tableau de bord" },
  { href: "/apprenant/cours", label: "Mon cursus" },
  { href: "/apprenant/certificats", label: "Mes certificats" },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/inscriptions", label: "Inscriptions en attente" },
  { href: "/admin/modules", label: "Modules (4 cursus)" },
  { href: "/admin/examens", label: "Examens" },
  { href: "/admin/apprenants", label: "Apprenants" },
  { href: "/admin/certificats", label: "Certificats" },
  { href: "/admin/kpi", label: "KPI & Pilotage" },
];

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const links = isAdmin ? adminLinks : apprenantLinks;
  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen p-4 hidden md:block">
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-gris transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
