"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// `useSearchParams` force le rendu côté client : le composant qui le consomme
// doit être enveloppé dans une frontière Suspense, sinon le build échoue au
// prerendu avec « useSearchParams() should be wrapped in a suspense boundary ».
function FormulaireReinitialisation() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  const [nouveau, setNouveau] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (nouveau.length < 8) { setError("8 caractères minimum."); return; }
    if (nouveau !== confirmation) { setError("La confirmation ne correspond pas."); return; }

    setLoading(true);
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, nouveau }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error || "Erreur"); return; }
    setSucces(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!token) {
    return <div className="text-center text-sm text-slate-500">Lien invalide. <Link href="/mot-de-passe-oublie" style={{ color: "var(--acnu-primary)" }} className="underline">Refaire une demande</Link></div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Nouveau mot de passe</h2>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mb-4">{error}</div>}
      {succes ? (
        <div className="bg-green-50 text-green-700 text-sm px-3 py-3 rounded-md">
          Mot de passe mis à jour ! Redirection vers la connexion...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
            <input type="password" required minLength={8} className="input-field mt-1" value={nouveau} onChange={(e) => setNouveau(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Confirmer le mot de passe</label>
            <input type="password" required minLength={8} className="input-field mt-1" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Enregistrement..." : "Valider mon nouveau mot de passe"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ReinitialiserMotDePassePage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-slate-500">Chargement...</div>}>
      <FormulaireReinitialisation />
    </Suspense>
  );
}
