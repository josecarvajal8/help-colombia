"use client";

import { useMemo, useState } from "react";
import { samplePoints } from "@/lib/sample-points";
import type { City } from "@/lib/types";
import { CityFilter } from "@/components/CityFilter";
import { LiveClock } from "@/components/LiveClock";
import { PointCard } from "@/components/PointCard";

export default function PublicView() {
  const [city, setCity] = useState<City | "todas">("todas");

  const points = useMemo(
    () => samplePoints.filter((p) => city === "todas" || p.city === city),
    [city],
  );

  return (
    <main className="mx-auto w-full max-w-[1180px] flex-1 px-7 py-6 pb-16">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2.5">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-[26px] font-medium">
          Puntos de acopio activos
        </h2>
        <LiveClock />
      </div>
      <p className="mb-[22px] max-w-[640px] text-[14.5px] text-ink-soft">
        Antes de llevar donaciones, revisa qué necesita cada punto y su nivel
        de disponibilidad. Los puntos marcados como{" "}
        <strong>saturado</strong> no requieren más de ese artículo por ahora —
        considera otro punto o espera nueva actualización.
      </p>

      <CityFilter value={city} onChange={setCity} />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5">
        {points.map((point) => (
          <PointCard key={point.id} point={point} />
        ))}
      </div>
    </main>
  );
}
