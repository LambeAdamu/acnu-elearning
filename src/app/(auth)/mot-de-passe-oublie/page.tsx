"use client";
import { useState } from "react";
import Link from "next/link";

export default function MotDePasseOubliePage() {
  const [identifiant, setIdentifiant] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifiant }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error || "Erreur"); return; }
    setMessage(data.message);
    setEnvoye(true);
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Mot de passe oublié</h2>
      <p className="text-sm text-slate-500 mb-6">
        Indiquez votre identifiant ou votre email : si un compte correspond, vous recevrez un lien
        pour créer un nouveau mot de passe.
      </p>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mb-4">{error}</div>}
      {envoye ? (
        <div className="bg-green-50 text-green-700 text-sm px-3 py-3 rounded-md">{message}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Identifiant ou email</label>
            <input required className="input-field mt-1" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
          </button>
        </form>
      )}
      <p className="text-sm text-slate-500 text-center mt-6">
        <Link href="/login" className="font-medium hover:underline" style={{ color: "var(--acnu-primary)" }}>
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
