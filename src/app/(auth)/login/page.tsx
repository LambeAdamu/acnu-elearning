"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [identifiant, setIdentifiant] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", { identifiant, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError(t.login.error);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">{t.login.title}</h2>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">{t.login.identifiant}</label>
          <input
            type="text"
            required
            className="input-field mt-1"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            placeholder={t.login.identifiantPlaceholder}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">{t.login.password}</label>
          <input
            type="password"
            required
            className="input-field mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? t.login.submitLoading : t.login.submit}
        </button>
      </form>
      <p className="text-sm text-center mt-3">
        <Link href="/mot-de-passe-oublie" className="text-slate-400 hover:underline">{t.login.forgotPassword}</Link>
      </p>
      <p className="text-sm text-slate-500 text-center mt-6">
        {t.login.noAccount}{" "}
        <Link href="/register" className="font-medium hover:underline" style={{ color: "var(--acnu-primary)" }}>
          {t.login.registerLink}
        </Link>
      </p>
    </div>
  );
}
