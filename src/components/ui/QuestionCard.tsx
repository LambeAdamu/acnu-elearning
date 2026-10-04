"use client";
import { Question } from "@/types";

interface Props { question: Question; index: number; reponse: any; onChange: (index: number, value: any) => void; }

export default function QuestionCard({ question, index, reponse, onChange }: Props) {
  return (
    <div className="card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--acnu-primary)" }}>
      <p className="font-medium text-slate-800 mb-3">{index + 1}. {question.question}</p>

      {question.type === "qcm" && question.options && (
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Array.isArray(reponse) && reponse.includes(opt)}
                onChange={(e) => {
                  const current = Array.isArray(reponse) ? reponse : [];
                  const next = e.target.checked ? [...current, opt] : current.filter((r: string) => r !== opt);
                  onChange(index, next);
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {question.type === "vf" && (
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name={`q-${index}`} checked={reponse === true} onChange={() => onChange(index, true)} /> Vrai
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name={`q-${index}`} checked={reponse === false} onChange={() => onChange(index, false)} /> Faux
          </label>
        </div>
      )}

      {question.type === "texte" && (
        <input type="text" className="input-field" value={reponse || ""} onChange={(e) => onChange(index, e.target.value)} placeholder="Votre réponse" />
      )}
    </div>
  );
}
