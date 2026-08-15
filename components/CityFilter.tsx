"use client";

import type { City } from "@/lib/types";
import { useDictionary } from "@/lib/i18n/LanguageProvider";

export function CityFilter({
  value,
  onChange,
}: {
  value: City | "todas";
  onChange: (city: City | "todas") => void;
}) {
  const dict = useDictionary();

  const cities: { value: City | "todas"; label: string }[] = [
    { value: "todas", label: dict.city.all },
    { value: "NJ", label: dict.city.NJ },
    { value: "NYC", label: dict.city.NYC },
  ];

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {cities.map((city) => {
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
