"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ChangerMotDePassePage() {
  const { update } = useSession();
  const router = useRouter();
  const [ancien, setAncien] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (nouveau.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (nouveau !== confirmation) {
      setError("La confirmation ne correspond pas au nouveau mot de passe.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ancien, nouveau }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erreur lors du changement de mot de passe");
      return;
    }

    await update({ mustChangePassword: false });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen gradient-acnu flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Créez votre mot de passe</h2>
        <p className="text-sm text-slate-500 mb-6">
          Pour votre sécurité, remplacez le mot de passe temporaire reçu par email par un mot de
          passe personnel (8 caractères minimum).
        </p>
        {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Mot de passe temporaire actuel</label>
            <input type="password" required className="input-field mt-1" value={ancien} onChange={(e) => setAncien(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
            <input type="password" required minLength={8} className="input-field mt-1" value={nouveau} onChange={(e) => setNouveau(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Confirmer le nouveau mot de passe</label>
            <input type="password" required minLength={8} className="input-field mt-1" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Enregistrement..." : "Valider mon mot de passe"}
          </button>
        </form>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-xs text-slate-400 hover:underline mt-4 block mx-auto">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
