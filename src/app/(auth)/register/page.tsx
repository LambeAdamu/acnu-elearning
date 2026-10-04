"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORY_OPTIONS } from "@/lib/themes";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [category, setCategory] = useState("");
  const [siteWeb, setSiteWeb] = useState(""); // champ honeypot (doit rester vide)

  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaReponse, setCaptchaReponse] = useState("");
  const [accepteCgu, setAccepteCgu] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function chargerCaptcha() {
    const res = await fetch("/api/captcha");
    const data = await res.json();
    setCaptchaQuestion(data.question);
    setCaptchaToken(data.token);
    setCaptchaReponse("");
  }

  useEffect(() => { chargerCaptcha(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!accepteCgu) {
      setError(t.register.errorCgu);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, email, telephone, category, captchaToken, captchaReponse, site_web: siteWeb }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue");
      chargerCaptcha();
      return;
    }
    router.push("/en-attente");
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">{t.register.title}</h2>
      <p className="text-sm text-slate-500 mb-6">{t.register.subtitle}</p>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="site_web"
          value={siteWeb}
          onChange={(e) => setSiteWeb(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700">{t.register.nom}</label>
            <input required className="input-field mt-1" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">{t.register.prenom}</label>
            <input required className="input-field mt-1" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">{t.register.email}</label>
          <input type="email" required className="input-field mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">{t.register.telephone}</label>
          <input required className="input-field mt-1" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="+237 6XX XX XX XX" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">{t.register.category}</label>
          <select required className="input-field mt-1" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">{t.register.categoryPlaceholder}</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{t.categories[c.value].label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            {t.register.captchaLabel} {captchaQuestion || "..."} ?
          </label>
          <input
            type="number"
            required
            className="input-field mt-1"
            value={captchaReponse}
            onChange={(e) => setCaptchaReponse(e.target.value)}
          />
        </div>

        <label className="flex items-start gap-2 text-xs text-slate-500">
          <input type="checkbox" checked={accepteCgu} onChange={(e) => setAccepteCgu(e.target.checked)} className="mt-0.5" required />
          <span>
            {t.register.acceptCguPrefix}{" "}
            <Link href="/cgu" target="_blank" className="underline" style={{ color: "var(--acnu-primary)" }}>{t.register.cguLink}</Link>
            {" "}{t.register.andText}{" "}
            <Link href="/politique-confidentialite" target="_blank" className="underline" style={{ color: "var(--acnu-primary)" }}>{t.register.privacyLink}</Link>
            {" "}{t.register.ofSite}
          </span>
        </label>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? t.register.submitLoading : t.register.submit}
        </button>
      </form>
      <p className="text-sm text-slate-500 text-center mt-6">
        {t.register.haveAccount}{" "}
        <Link href="/login" className="font-medium hover:underline" style={{ color: "var(--acnu-primary)" }}>
          {t.register.loginLink}
        </Link>
      </p>
    </div>
  );
}
