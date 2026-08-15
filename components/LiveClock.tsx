"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function formatNow(language: string) {
  return new Date().toLocaleTimeString(language === "es" ? "es-CO" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LiveClock() {
  const { language, dict } = useLanguage();
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    // Set after mount (not during render) so the server-rendered placeholder
    // matches the client's first paint — avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(formatNow(language));
    const id = setInterval(() => setTime(formatNow(language)), 30_000);
    return () => clearInterval(id);
  }, [language]);

  return (
    <span className="font-[family-name:var(--font-data)] text-xs text-ink-soft">
      {dict.publicView.liveUpdated} · {time ?? "--:--"}
    </span>
  );
}
