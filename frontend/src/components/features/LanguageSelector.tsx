"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/i18n/languages";
import { useLanguage } from "@/i18n/LanguageContext";

export function LanguageSelector() {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Show popup on first visit
  useEffect(() => {
    const hasChosen = localStorage.getItem("gigsarthi_lang_chosen");
    if (!hasChosen) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for custom event to reopen (from Navbar globe button)
  const openSelector = useCallback(() => setIsOpen(true), []);
  useEffect(() => {
    window.addEventListener("openLanguageSelector", openSelector);
    return () => window.removeEventListener("openLanguageSelector", openSelector);
  }, [openSelector]);

  const handleSelect = (code: string) => {
    setLocale(code);
    localStorage.setItem("gigsarthi_lang_chosen", "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
            onClick={() => handleSelect("en")}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-background/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-8 pb-4 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-4">
                  <Globe className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t("langPopup.title")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("langPopup.subtitle")}</p>
              </div>

              {/* Language Grid */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = locale === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleSelect(lang.code)}
                        className={`relative flex flex-col items-center gap-1.5 px-3 py-4 rounded-xl border text-center transition-all duration-200 ${
                          isSelected
                            ? "bg-primary/15 border-primary/40 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2 right-2">
                            <Check className="w-4 h-4 text-primary" />
                          </span>
                        )}
                        <span className="text-2xl">{lang.flag}</span>
                        <span className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {lang.nativeLabel}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{lang.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleSelect("en")}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  {t("langPopup.continueIn")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
