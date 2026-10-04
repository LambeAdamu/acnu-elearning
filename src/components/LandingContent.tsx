"use client";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { CATEGORY_OPTIONS, THEMES } from "@/lib/themes";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LandingContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* En-tête public */}
      <header className="gradient-acnu text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={38} />
            <span className="font-bold text-lg">ACNU-LEARNING</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/login" className="text-sm px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors">{t.common.login}</Link>
            <Link href="/register" className="text-sm bg-white px-4 py-1.5 rounded-md font-medium" style={{ color: "var(--acnu-primary)" }}>{t.common.register}</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-acnu text-white text-center py-16 px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.landing.heroTitle}</h1>
        <p className="max-w-2xl mx-auto text-white/85 mb-8">{t.landing.heroSubtitle}</p>
        <div className="flex justify-center gap-3">
          <Link href="/register" className="bg-white px-6 py-3 rounded-md font-semibold" style={{ color: "var(--acnu-primary)" }}>
            {t.landing.ctaRegister}
          </Link>
          <Link href="/login" className="border border-white/60 px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors">
            {t.landing.ctaLogin}
          </Link>
        </div>
      </section>

      {/* Les 4 cursus — carte en couleur pleine par catégorie */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">{t.landing.categoriesTitle}</h2>
        <p className="text-center text-slate-500 mb-10">{t.landing.categoriesSubtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_OPTIONS.map((c) => {
            const theme = THEMES[c.value];
            const cat = t.categories[c.value];
            return (
              <div
                key={c.value}
                className="rounded-xl overflow-hidden shadow-sm p-5"
                style={{
                  backgroundColor: theme.cardBg,
                  border: theme.cardBorder ? `2px solid ${theme.cardBorder}` : "1px solid transparent",
                }}
              >
                <h3 className="font-bold mb-1" style={{ color: theme.cardText }}>{cat.label}</h3>
                <p className="text-xs" style={{ color: theme.cardText, opacity: 0.9 }}>{cat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-gris py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-10">{t.landing.howItWorksTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              ["1", t.landing.step1Title, t.landing.step1Desc],
              ["2", t.landing.step2Title, t.landing.step2Desc],
              ["3", t.landing.step3Title, t.landing.step3Desc],
              ["4", t.landing.step4Title, t.landing.step4Desc],
            ].map(([n, titre, desc]) => (
              <div key={n}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3" style={{ backgroundColor: "var(--acnu-primary)" }}>{n}</div>
                <h3 className="font-semibold text-slate-800 mb-1">{titre}</h3>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="gradient-acnu text-white/80 text-center text-xs py-6 space-y-2">
        <p>© {new Date().getFullYear()} ACNU-Learning — {t.landing.footerRights}</p>
        <p className="space-x-3">
          <Link href="/cgu" className="underline hover:text-white">{t.landing.footerCgu}</Link>
          <span>·</span>
          <Link href="/politique-confidentialite" className="underline hover:text-white">{t.landing.footerPrivacy}</Link>
        </p>
      </footer>
    </div>
  );
}
