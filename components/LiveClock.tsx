"use client";

import { useEffect, useState } from "react";

function formatNow() {
  return new Date().toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    // Set after mount (not during render) so the server-rendered placeholder
    // matches the client's first paint — avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(formatNow());
    const id = setInterval(() => setTime(formatNow()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-[family-name:var(--font-data)] text-xs text-ink-soft">
      actualizado en vivo · {time ?? "--:--"}
    </span>
  );
}
