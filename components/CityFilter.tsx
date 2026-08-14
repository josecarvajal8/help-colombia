"use client";

import type { City } from "@/lib/types";

const CITIES: { value: City | "todas"; label: string }[] = [
  { value: "todas", label: "Todas las ciudades" },
  { value: "NJ", label: "Nueva Jersey" },
  { value: "NYC", label: "Nueva York" },
];

export function CityFilter({
  value,
  onChange,
}: {
  value: City | "todas";
  onChange: (city: City | "todas") => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {CITIES.map((city) => {
        const active = city.value === value;
        return (
          <button
            key={city.value}
            type="button"
            onClick={() => onChange(city.value)}
            className={`rounded-full border px-3.5 py-[7px] text-[13px] font-semibold transition-colors ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-line bg-white text-ink-soft"
            }`}
          >
            {city.label}
          </button>
        );
      })}
    </div>
  );
}
