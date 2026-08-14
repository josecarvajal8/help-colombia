import type { Need } from "@/lib/types";

const TAG_CLASSES: Record<Need["priority"], string> = {
  alta: "bg-rojo-soft text-rojo",
  media: "bg-amarillo-soft text-amarillo-ink",
  baja: "bg-azul-soft text-azul",
};

export const PRIORITY_LABEL: Record<Need["priority"], string> = {
  alta: "Urgente",
  media: "Necesario",
  baja: "Ya hay suficiente pronto",
};

export function NeedTag({ need }: { need: Need }) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${TAG_CLASSES[need.priority]}`}
    >
      <span className="h-[5px] w-[5px] rounded-full bg-current" />
      {need.item}
    </span>
  );
}
