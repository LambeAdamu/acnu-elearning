import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CATEGORY_OPTIONS, categoryLabel } from "@/lib/themes";

export default async function AdminModulesPage({ searchParams }: { searchParams: { cursus?: string } }) {
  const activeCategory = searchParams.cursus || CATEGORY_OPTIONS[0].value;
  const modules = await prisma.module.findMany({ where: { category: activeCategory as any }, orderBy: { ordre: "asc" } });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-slate-800">Modules</h1>
        <Link href={`/admin/modules/nouveau?cursus=${activeCategory}`} className="btn-primary">+ Nouveau module</Link>
      </div>

      {/* Onglets des 4 cursus */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORY_OPTIONS.map((c) => (
          <Link
            key={c.value}
            href={`/admin/modules?cursus=${c.value}`}
            className={`text-sm px-3 py-1.5 rounded-full border ${activeCategory === c.value ? "text-white" : "text-slate-600 bg-white"}`}
            style={activeCategory === c.value ? { backgroundColor: "var(--acnu-primary)", borderColor: "var(--acnu-primary)" } : { borderColor: "#e2e8f0" }}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {modules.map((mod) => (
          <div key={mod.id} className="card p-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold" style={{ color: "var(--acnu-primary)" }}>#{mod.ordre}</span>
              <h3 className="font-medium text-slate-800">{mod.titre}</h3>
              <p className="text-sm text-gray-500">{mod.description}</p>
            </div>
            <Link href={`/admin/modules/${mod.id}`} className="btn-secondary text-sm">Modifier</Link>
          </div>
        ))}
        {modules.length === 0 && <p className="text-slate-500 text-sm">Aucun module créé pour {categoryLabel(activeCategory as any)}.</p>}
      </div>
    </div>
  );
}
