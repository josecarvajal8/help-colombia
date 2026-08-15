import type { PointStatus } from "@/lib/types";
import { useDictionary } from "@/lib/i18n/LanguageProvider";

const DOT_CLASSES: Record<PointStatus, string> = {
  abierto: "bg-verde text-verde",
  saturado: "bg-amarillo text-amarillo",
  cerrado: "bg-cerrado-dot text-cerrado-dot",
};

const LABEL_CLASSES: Record<PointStatus, string> = {
  abierto: "text-verde",
  saturado: "text-amarillo-label",
  cerrado: "text-cerrado-label",
};

export function StatusPulse({ status }: { status: PointStatus }) {
  return (
    <span
      className={`relative inline-block h-[9px] w-[9px] shrink-0 rounded-full ${DOT_CLASSES[status]} ${
        status === "abierto" ? "pulse-ring" : ""
      }`}
    />
  );
}

export function StatusPill({ status }: { status: PointStatus }) {
  const dict = useDictionary();
  return (
    <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-paper-dim px-2.5 py-[5px]">
      <StatusPulse status={status} />
      <span
        className={`text-[12.5px] font-bold uppercase tracking-wide ${LABEL_CLASSES[status]}`}
      >
        {dict.status[status]}
      </span>
    </div>
  );
}
