"use client";

import { useState } from "react";
import type { Point } from "@/lib/types";
import { formatRelativeEs } from "@/lib/format";
import { StatusPill } from "./StatusPulse";
import { NeedTag } from "./NeedTag";
import { PointDetailModal } from "./PointDetailModal";

const NEEDS_PREVIEW_COUNT = 3;

export function PointCard({ point }: { point: Point }) {
  const [showDetail, setShowDetail] = useState(false);

  const visibleNeeds = point.needs.slice(0, NEEDS_PREVIEW_COUNT);
  const hiddenCount = point.needs.length - visibleNeeds.length;

  return (
    <>
      <div
        className={`flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-[18px] ${
          point.status === "cerrado" ? "opacity-55" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <p className="mb-0.5 text-[16.5px] font-semibold">{point.name}</p>
            <p className="line-clamp-1 text-[12.5px] text-ink-soft">{point.address}</p>
          </div>
          <StatusPill status={point.status} />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
            Se necesita
          </span>
          {point.needs.length === 0 ? (
            <span className="text-[12.5px] font-semibold text-verde">
              ✓ No se requiere nada más por ahora
            </span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {visibleNeeds.map((need) => (
                <NeedTag key={need.id} need={need} />
              ))}
              {hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowDetail(true)}
                  className="rounded-lg bg-paper-dim px-2.5 py-1 text-xs font-semibold text-ink-soft"
                >
                  +{hiddenCount} más
                </button>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowDetail(true)}
          className="self-start text-[12.5px] font-semibold text-azul"
        >
          Ver detalles →
        </button>

        <div className="flex items-center justify-between border-t border-dashed border-line pt-2.5 text-[11.5px] text-ink-soft">
          <span className="font-bold text-ink">{point.city}</span>
          <span className="font-[family-name:var(--font-data)]">
            {formatRelativeEs(point.updatedAt)}
          </span>
        </div>
      </div>

      {showDetail && (
        <PointDetailModal point={point} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
