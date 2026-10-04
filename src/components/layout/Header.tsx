"use client";
import { signOut } from "next-auth/react";
import Logo from "@/components/ui/Logo";

export default function Header({
  userName,
  roleLabel,
}: {
  userName?: string | null;
  roleLabel?: string;
}) {
  return (
    <header className="gradient-acnu text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={38} />
          <div>
            <h1 className="font-bold text-lg leading-tight">ACNU-LEARNING</h1>
            <p className="text-xs opacity-80">{roleLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {userName && <span className="text-sm">{userName}</span>}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
