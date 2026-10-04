"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Question, QuestionType } from "@/types";

export default function ExamenForm({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  const [seuilReussite, setSeuilReussite] = useState(70);
  const [questions, setQuestions] = useState<Question[]>([{ question: "", type: "qcm", options: ["", ""], reponse: [] }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateQuestion(index: number, patch: Partial<Question>) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }
  function addQuestion() {
    setQuestions((prev) => [...prev, { question: "", type: "qcm", options: ["", ""], reponse: [] }]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/examens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, seuilReussite, questions }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Erreur lors de l'enregistrement"); return; }
    router.push("/admin/examens");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md">{error}</div>}
      <div className="card p-4">
        <label className="text-sm font-medium text-slate-700">Seuil de réussite (%)</label>
        <input type="number" min={0} max={100} className="input-field mt-1" value={seuilReussite} onChange={(e) => setSeuilReussite(Number(e.target.value))} />
      </div>

      {questions.map((q, i) => (
        <div key={i} className="card p-4 border-l-4 space-y-3" style={{ borderLeftColor: "var(--acnu-primary)" }}>
          <input className="input-field" placeholder={`Question ${i + 1}`} value={q.question} onChange={(e) => updateQuestion(i, { question: e.target.value })} />
          <select className="input-field" value={q.type} onChange={(e) => updateQuestion(i, { type: e.target.value as QuestionType })}>
            <option value="qcm">QCM (choix multiples)</option>
            <option value="vf">Vrai / Faux</option>
            <option value="texte">Réponse texte courte</option>
          </select>
          {q.type === "qcm" && (
            <div className="space-y-2">
              {(q.options || []).map((opt, oi) => (
                <input key={oi} className="input-field" placeholder={`Option ${oi + 1}`} value={opt}
                  onChange={(e) => { const opts = [...(q.options || [])]; opts[oi] = e.target.value; updateQuestion(i, { options: opts }); }} />
              ))}
              <button type="button" className="btn-secondary text-xs" onClick={() => updateQuestion(i, { options: [...(q.options || []), ""] })}>+ Ajouter une option</button>
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={addQuestion} className="btn-secondary w-full">+ Ajouter une question</button>
      <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Enregistrement..." : "Créer l'examen"}</button>
    </form>
  );
}
