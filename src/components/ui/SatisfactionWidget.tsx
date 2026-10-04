"use client";
import { useState } from "react";

export default function SatisfactionWidget({
  certificatId,
  noteInitiale,
  commentaireInitial,
}: {
  certificatId: string;
  noteInitiale?: number | null;
  commentaireInitial?: string | null;
}) {
  const [note, setNote] = useState(noteInitiale || 0);
  const [commentaire, setCommentaire] = useState(commentaireInitial || "");
  const [envoye, setEnvoye] = useState(!!noteInitiale);
  const [loading, setLoading] = useState(false);

  async function envoyer(n: number) {
    setNote(n);
    setLoading(true);
    await fetch("/api/satisfaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ certificatId, note: n, commentaire }),
    });
    setLoading(false);
    setEnvoye(true);
  }

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <p className="text-xs text-slate-500 mb-1">
        {envoye ? "Merci pour votre avis sur ce module :" : "Votre satisfaction sur ce module ?"}
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={loading}
            onClick={() => envoyer(n)}
            className="text-lg"
            style={{ color: n <= note ? "var(--acnu-accent)" : "#e2e8f0" }}
            aria-label={`${n} étoiles`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
