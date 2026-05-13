"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function CookieConsent() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if consent was already given
    const consent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookie_consent="));
    if (!consent) {
      // Delay slightly so it animates in
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `cookie_consent=true; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-500 fill-mode-both"
    >
      <div className="mx-auto max-w-4xl px-4 pb-4">
        <div className="flex flex-col items-center gap-3 rounded-xl bg-stone-800 p-4 shadow-lg sm:flex-row sm:gap-4">
          <p className="flex-1 text-center text-sm text-stone-300 sm:text-left">
            {t("message")}{" "}
            <Link
              href="/privacy"
              className="font-medium text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              {t("privacyPolicy")}
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <Link
              href="/privacy"
              className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-stone-300 transition-colors hover:bg-stone-700 hover:text-white"
            >
              {t("learnMore")}
            </Link>
            <button
              onClick={accept}
              className="inline-flex h-9 items-center rounded-lg bg-amber-500 px-5 text-sm font-semibold text-stone-900 transition-colors hover:bg-amber-400"
            >
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
