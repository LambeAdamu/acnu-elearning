"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * Petit sélecteur FR / EN. Le choix est mémorisé (cookie + localStorage) et
 * s'applique à tout le contenu traduit du site (voir src/lib/i18n/).
 */
export default function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { locale, setLocale } = useLanguage();

  const base = "text-xs font-semibold px-2 py-1 rounded transition-colors";
  const actif = dark ? "bg-white text-slate-800" : "text-white";
  const inactif = dark ? "text-white/70 hover:text-white" : "text-white/60 hover:text-white";

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Choix de la langue / Language choice">
      <button type="button" onClick={() => setLocale("fr")} className={`${base} ${locale === "fr" ? actif : inactif}`}>
        FR
      </button>
      <span className="text-white/40 text-xs">/</span>
      <button type="button" onClick={() => setLocale("en")} className={`${base} ${locale === "en" ? actif : inactif}`}>
        EN
      </button>
    </div>
  );
}
