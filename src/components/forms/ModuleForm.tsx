"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_OPTIONS } from "@/lib/themes";

interface Props {
  initial?: {
    id?: string;
    category?: string;
    titre?: string;
    description?: string | null;
    ordre?: number;
    contenuTexte?: string | null;
    certificatTemplateUrl?: string | null;
    certifNomY?: number | null;
    certifCodeY?: number | null;
    certifDateY?: number | null;
  };
  defaultCategory?: string;
}

export default function ModuleForm({ initial, defaultCategory }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState(initial?.category || defaultCategory || CATEGORY_OPTIONS[0].value);
  const [titre, setTitre] = useState(initial?.titre || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [ordre, setOrdre] = useState(initial?.ordre || 1);
  const [contenuTexte, setContenuTexte] = useState(initial?.contenuTexte || "");
  const [certifNomY, setCertifNomY] = useState(initial?.certifNomY ?? 420);
  const [certifCodeY, setCertifCodeY] = useState(initial?.certifCodeY ?? 120);
  const [certifDateY, setCertifDateY] = useState(initial?.certifDateY ?? 160);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templateUrl, setTemplateUrl] = useState(initial?.certificatTemplateUrl || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingTemplate, setUploadingTemplate] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = { category, titre, description, ordre, contenuTexte, certifNomY, certifCodeY, certifDateY };
    const url = initial?.id ? `/api/modules/${initial.id}` : "/api/modules";
    const method = initial?.id ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error || "Erreur lors de l'enregistrement"); return; }
    router.push("/admin/modules");
    router.refresh();
  }

  async function handleUploadTemplate() {
    if (!templateFile || !initial?.id) return;
    setUploadingTemplate(true);
    setError("");
    const fd = new FormData();
    fd.append("file", templateFile);
    fd.append("type", "certificat");
    const res = await fetch(`/api/modules/${initial.id}/contenu`, { method: "POST", body: fd });
    const data = await res.json();
    setUploadingTemplate(false);
    if (!res.ok) { setError(data.error || "Erreur lors de l'upload du modèle"); return; }
    setTemplateUrl(data.url);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 card p-6 border-l-4" style={{ borderLeftColor: "var(--acnu-primary)" }}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md">{error}</div>}

      <div>
        <label className="text-sm font-medium text-slate-700">Cursus (catégorie)</label>
        <select className="input-field mt-1" value={category} onChange={(e) => setCategory(e.target.value)} disabled={!!initial?.id}>
          {CATEGORY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        {initial?.id && <p className="text-xs text-slate-400 mt-1">Le cursus d'un module existant ne peut pas être changé.</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Titre du module</label>
        <input className="input-field mt-1" value={titre} onChange={(e) => setTitre(e.target.value)} required />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Description</label>
        <textarea className="input-field mt-1" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Ordre (dans ce cursus)</label>
        <input type="number" min={1} className="input-field mt-1" value={ordre} onChange={(e) => setOrdre(Number(e.target.value))} required />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Contenu texte (HTML)</label>
        <textarea className="input-field mt-1" rows={5} value={contenuTexte} onChange={(e) => setContenuTexte(e.target.value)} placeholder="<p>Contenu du cours...</p>" />
      </div>
      <p className="text-xs text-slate-400">Upload vidéo/audio séparé via /api/modules/[id]/contenu une fois le module créé.</p>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Enregistrement..." : initial?.id ? "Mettre à jour" : "Créer le module"}
      </button>

      <div className="border-t border-slate-200 pt-4 mt-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-1">Modèle de certificat signé (optionnel)</h3>
        <p className="text-xs text-slate-400 mb-3">
          Déposez le PDF déjà signé pour ce module. Nom, catégorie, code (ACNU-XXX26YYYY) et date sont
          automatiquement superposés à la réussite de l'examen.
        </p>
        {!initial?.id && <p className="text-xs bg-gris rounded-md px-3 py-2">Enregistrez d'abord le module.</p>}
        {initial?.id && (
          <div className="space-y-3">
            {templateUrl && <p className="text-xs text-green-700">✅ Modèle actuel : <a href={templateUrl} target="_blank" rel="noreferrer" className="underline">voir le PDF</a></p>}
            <input type="file" accept="application/pdf" onChange={(e) => setTemplateFile(e.target.files?.[0] || null)} className="text-sm" />
            <button type="button" onClick={handleUploadTemplate} disabled={!templateFile || uploadingTemplate} className="btn-secondary text-sm">
              {uploadingTemplate ? "Envoi..." : "Déposer le modèle signé"}
            </button>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div><label className="text-xs text-slate-500">Y — Nom</label><input type="number" className="input-field mt-1 text-sm" value={certifNomY} onChange={(e) => setCertifNomY(Number(e.target.value))} /></div>
              <div><label className="text-xs text-slate-500">Y — Code</label><input type="number" className="input-field mt-1 text-sm" value={certifCodeY} onChange={(e) => setCertifCodeY(Number(e.target.value))} /></div>
              <div><label className="text-xs text-slate-500">Y — Date</label><input type="number" className="input-field mt-1 text-sm" value={certifDateY} onChange={(e) => setCertifDateY(Number(e.target.value))} /></div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
