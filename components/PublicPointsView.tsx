"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchPoints } from "@/lib/supabase/points";
import type { City, Point } from "@/lib/types";
import { useDictionary } from "@/lib/i18n/LanguageProvider";
import { CityFilter } from "@/components/CityFilter";
import { LiveClock } from "@/components/LiveClock";
import { PointCard } from "@/components/PointCard";
import { ExternalOrgsSection } from "@/components/ExternalOrgsSection";

export function PublicPointsView({ initialPoints }: { initialPoints: Point[] }) {
  const dict = useDictionary();
  const [points, setPoints] = useState(initialPoints);
  const [city, setCity] = useState<City | "todas">("todas");

  useEffect(() => {
    const supabase = createClient();

    const refetch = () => {
      fetchPoints(supabase).then(setPoints).catch(console.error);
    };

    const channel = supabase
      .channel("public-points")
      .on("postgres_changes", { event: "*", schema: "public", table: "points" }, refetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "needs" }, refetch)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredPoints = useMemo(
    () => points.filter((p) => city === "todas" || p.city === city),
    [points, city],
  );

  return (
    <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-6 pb-16 sm:px-7">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2.5">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-[26px] font-medium">
          {dict.publicView.heading}
        </h2>
        <LiveClock />
      </div>
      <p className="mb-[22px] max-w-[640px] text-[14.5px] text-ink-soft">
        {dict.publicView.introBefore}{" "}
        <strong>{dict.status.saturado.toLowerCase()}</strong>{" "}
        {dict.publicView.introAfter}
      </p>

      <CityFilter value={city} onChange={setCity} />

      {filteredPoints.length === 0 ? (
        <p className="text-sm text-ink-soft">{dict.publicView.emptyFiltered}</p>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {filteredPoints.map((point) => (
            <PointCard key={point.id} point={point} />
          ))}
        </div>
      )}

      <ExternalOrgsSection />
    </main>
  );
}
