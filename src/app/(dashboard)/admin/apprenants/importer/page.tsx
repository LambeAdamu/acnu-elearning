"use client";
import { useState } from "react";
import Link from "next/link";

export default function ImporterApprenantsPage() {
  const [fichier, setFichier] = useState<File | null>(null);
  const [validerImmediatement, setValiderImmediatement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultat, setResultat] = useState<{ crees: number; ignores: number; erreurs: string[] } | null>(null);
  const [error, setError] = useState("");

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!fichier) return;
    setError("");
    setLoading(true);
    setResultat(null);

    const texte = await fichier.text();
    const res = await fetch("/api/admin/apprenants/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv: texte, validerImmediatement }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error || "Erreur lors de l'import"); return; }
    setResultat(data);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-bold text-slate-800">Importer des apprenants (CSV)</h1>
        <Link href="/admin/apprenants" className="btn-secondary text-sm">← Retour</Link>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Pour ajouter en une fois une liste déjà existante de parlementaires (ex : export d'un tableur).
      </p>

      <div className="card p-6 border-l-4 mb-6" style={{ borderLeftColor: "var(--acnu-accent)" }}>
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Format attendu</h2>
        <p className="text-sm text-slate-600 mb-2">Un fichier .csv avec une ligne par apprenant, colonnes séparées par une virgule ou un point-virgule :</p>
        <code className="block bg-gris rounded-md p-3 text-xs text-slate-700">
          nom;prenom;email;telephone;categorie<br />
          Kamtche;Franck;franck@email.com;+237600000000;DEPUTE_JUNIOR<br />
          Bebone;Aïcha;aicha@email.com;+237611111111;Ambassadeur Junior
        </code>
        <p className="text-xs text-slate-400 mt-2">
          La ligne d'en-tête est facultative — elle est détectée et ignorée automatiquement. La
          catégorie accepte soit la clé technique (DEPUTE_JUNIOR) soit le libellé (Député Junior).
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mb-4">{error}</div>}

      <form onSubmit={handleImport} className="card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Fichier CSV</label>
          <input type="file" accept=".csv,text/csv" onChange={(e) => setFichier(e.target.files?.[0] || null)} className="mt-1 text-sm" required />
        </div>
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={validerImmediatement} onChange={(e) => setValiderImmediatement(e.target.checked)} className="mt-1" />
          <span>
            <b>Valider immédiatement</b> — génère et envoie tout de suite les identifiants par email
            pour chaque ligne. Si décoché, les comptes sont créés « en attente », à valider un par un
            comme une inscription normale.
          </span>
        </label>
        <button type="submit" disabled={!fichier || loading} className="btn-primary w-full">
          {loading ? "Import en cours..." : "Importer"}
        </button>
      </form>

      {resultat && (
        <div className="card p-6 mt-6 border-l-4 border-green-400">
          <h2 className="font-semibold text-slate-700 mb-2">Résultat de l'import</h2>
          <p className="text-sm text-slate-600">✅ {resultat.crees} compte(s) créé(s)</p>
          <p className="text-sm text-slate-600">↷ {resultat.ignores} ligne(s) ignorée(s) (email déjà existant)</p>
          {resultat.erreurs.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-red-600">{resultat.erreurs.length} erreur(s) :</p>
              <ul className="text-xs text-red-500 list-disc list-inside">
                {resultat.erreurs.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
