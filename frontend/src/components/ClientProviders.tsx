"use client";

import { LanguageProvider } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/features/LanguageSelector";
import { Navbar } from "@/components/navbar";
import { NotificationPanel } from "@/components/features/NotificationPanel";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Navbar />
      <NotificationPanel />
      <LanguageSelector />
      {children}
    </LanguageProvider>
  );
}
