"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_OPTIONS } from "@/lib/themes";

interface Inscription {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  category: string | null;
  createdAt: string;
}

export default function InscriptionsClient({ inscriptions }: { inscriptions: Inscription[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Record<string, string>>(
    Object.fromEntries(inscriptions.map((i) => [i.id, i.category || ""]))
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [resultat, setResultat] = useState<{ id: string; identifiant: string; motDePasse: string } | null>(null);

  async function valider(id: string) {
    setLoadingId(id);
    const res = await fetch(`/api/admin/inscriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "valider", category: categories[id] }),
    });
    const data = await res.json();
    setLoadingId(null);
    if (res.ok) {
      setResultat({ id, identifiant: data.identifiant, motDePasse: data.motDePasse });
      router.refresh();
    }
  }

  async function refuser(id: string) {
    setLoadingId(id);
    await fetch(`/api/admin/inscriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "refuser" }),
    });
    setLoadingId(null);
    router.refresh();
  }

  if (inscriptions.length === 0) {
    return <p className="text-slate-500 text-sm">Aucune inscription en attente.</p>;
  }

  return (
    <div className="space-y-4">
      {inscriptions.map((insc) => (
        <div key={insc.id} className="card p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="font-medium text-slate-800">{insc.prenom} {insc.nom}</h3>
              <p className="text-sm text-slate-500">{insc.email} · {insc.telephone}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="input-field text-sm"
                value={categories[insc.id]}
                onChange={(e) => setCategories((prev) => ({ ...prev, [insc.id]: e.target.value }))}
              >
                {CATEGORY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <button onClick={() => valider(insc.id)} disabled={loadingId === insc.id} className="btn-primary text-sm">
                {loadingId === insc.id ? "..." : "Valider"}
              </button>
              <button onClick={() => refuser(insc.id)} disabled={loadingId === insc.id} className="btn-secondary text-sm">
                Refuser
              </button>
            </div>
          </div>

          {resultat?.id === insc.id && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
              ✅ Compte validé et email envoyé. Identifiants générés :
              <div className="mt-1 font-mono text-xs">
                Identifiant : <b>{resultat.identifiant}</b> — Mot de passe temporaire : <b>{resultat.motDePasse}</b>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
