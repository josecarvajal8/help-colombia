"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Vista pública" },
  { href: "/admin", label: "Panel admin" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 border-b border-line bg-paper px-4 py-[18px] sm:px-7 sm:py-[22px]">
      <div className="flex items-center gap-3">
        <div
          className="h-[34px] w-[34px] shrink-0 rounded-[9px]"
          style={{
            background:
              "linear-gradient(135deg, #F5B700 0%, #F5B700 55%, #003893 55%, #003893 78%, #C81E3A 78%)",
          }}
        />
        <div>
          <h1 className="m-0 font-[family-name:var(--font-display)] text-lg font-semibold">
            Red de Acopio — NJ / NYC
          </h1>
          <p className="m-0 mt-0.5 text-[12.5px] text-ink-soft">
            Coordinación de ayuda para Colombia
          </p>
        </div>
      </div>

      <nav className="flex gap-0.5 rounded-full bg-paper-dim p-1">
        {TABS.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full px-[18px] py-[9px] text-[13.5px] font-semibold transition-colors ${
                active ? "bg-ink text-paper" : "text-ink-soft"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
