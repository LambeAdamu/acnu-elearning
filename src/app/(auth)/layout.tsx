import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen gradient-acnu flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>
        <div className="text-center mb-6 text-white">
          <div className="flex justify-center"><Logo size={64} /></div>
          <h1 className="text-2xl font-bold mt-3">ACNU-LEARNING</h1>
          <p className="text-sm opacity-80">Former les jeunes leaders de demain</p>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8">{children}</div>
      </div>
    </div>
  );
}
