"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionCard from "@/components/ui/QuestionCard";
import { Question } from "@/types";

export default function ExamenClient({ examenId, questions }: { examenId: string; questions: Question[] }) {
  const router = useRouter();
  const [reponses, setReponses] = useState<Record<number, any>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(index: number, value: any) {
    setReponses((prev) => ({ ...prev, [index]: value }));
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/tentatives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examenId, reponses }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Erreur lors de la soumission"); return; }
    router.push(`/apprenant/examen/resultat/${data.tentative.id}`);
  }

  return (
    <div>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mb-4">{error}</div>}
      {questions.map((q, i) => (
        <QuestionCard key={i} question={q} index={i} reponse={reponses[i]} onChange={handleChange} />
      ))}
      <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full mt-4">
        {loading ? "Soumission..." : "Soumettre l'examen"}
      </button>
    </div>
  );
}
