import { prisma } from "@/lib/prisma";
import { formatDate } from "@/utils/helpers";
import { categoryLabel } from "@/lib/themes";

export default async function AdminCertificatsPage() {
  const certificats = await prisma.certificat.findMany({
    include: { user: true, module: true },
    orderBy: { dateObtention: "desc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Certificats délivrés</h1>
      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "var(--acnu-primary)" }} className="text-white">
            <tr>
              <th className="text-left px-4 py-3">Apprenant</th>
              <th className="text-left px-4 py-3">Cursus</th>
              <th className="text-left px-4 py-3">Module</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Fichier</th>
            </tr>
          </thead>
          <tbody>
            {certificats.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{c.user.name}</td>
                <td className="px-4 py-3 text-slate-600">{categoryLabel(c.category)}</td>
                <td className="px-4 py-3 text-slate-600">{c.module.titre}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(c.dateObtention)}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{c.code}</td>
                <td className="px-4 py-3">{c.urlFichier && <a href={c.urlFichier} target="_blank" rel="noreferrer" style={{ color: "var(--acnu-primary)" }} className="hover:underline">Voir</a>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {certificats.length === 0 && <p className="text-slate-500 text-sm p-4">Aucun certificat délivré pour le moment.</p>}
      </div>
    </div>
  );
}
