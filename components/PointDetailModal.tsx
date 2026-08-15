"use client";

import { useEffect } from "react";
import type { Point } from "@/lib/types";
import { formatRelative } from "@/lib/format";
import { useDictionary } from "@/lib/i18n/LanguageProvider";
import { StatusPill } from "./StatusPulse";
import { NeedTag } from "./NeedTag";

export function PointDetailModal({
  point,
  onClose,
}: {
  point: Point;
  onClose: () => void;
}) {
  const dict = useDictionary();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full flex-col gap-4 overflow-y-auto rounded-t-[var(--radius-card)] bg-white p-5 sm:max-w-md sm:rounded-[var(--radius-card)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <p className="mb-0.5 font-[family-name:var(--font-display)] text-[19px] font-semibold">
              {point.name}
            </p>
            <p className="text-[12.5px] text-ink-soft">{point.address}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.point.close}
            className="shrink-0 rounded-full bg-paper-dim px-2.5 py-1 text-sm text-ink-soft"
          >
            ×
          </button>
        </div>

        <StatusPill status={point.status} />

        {point.mapsUrl && (
          <a
            href={point.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start rounded-lg bg-azul-soft px-3 py-1.5 text-[12.5px] font-semibold text-azul"
          >
            {dict.point.openMaps}
          </a>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
            {dict.point.needsTitle}
          </span>
          {point.needs.length === 0 ? (
            <span className="text-[12.5px] font-semibold text-verde">
              {dict.point.needsEmpty}
            </span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {point.needs.map((need) => (
                <NeedTag key={need.id} need={need} />
              ))}
            </div>
          )}
        </div>

        {point.donationInfo && (
          <div className="flex flex-col gap-1 rounded-lg bg-paper-dim p-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              {dict.point.donationTitle}
            </span>
            <p className="whitespace-pre-line text-[13px]">{point.donationInfo}</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-dashed border-line pt-2.5 text-[11.5px] text-ink-soft">
          <span className="font-bold text-ink">{point.city}</span>
          <span className="font-[family-name:var(--font-data)]">
            {formatRelative(point.updatedAt, dict)}
          </span>
        </div>
      </div>
    </div>
  );
}
