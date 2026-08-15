"use client";

import { useDictionary } from "@/lib/i18n/LanguageProvider";

const ORGS = [
  { key: "redCross", url: "https://www.cruzrojacolombiana.org/" },
  { key: "abaco", url: "https://abaco.org.co/" },
] as const;

export function ExternalOrgsSection() {
  const dict = useDictionary();

  return (
    <div className="mt-10 border-t border-line pt-8">
      <h3 className="m-0 font-[family-name:var(--font-display)] text-xl font-medium">
        {dict.externalOrgs.heading}
      </h3>
      <p className="mt-1.5 max-w-[640px] text-[13.5px] text-ink-soft">
        {dict.externalOrgs.description}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ORGS.map((org) => {
          const info = dict.externalOrgs[org.key];
          return (
            <div
              key={org.key}
              className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-line bg-white p-4"
            >
              <p className="m-0 text-[14.5px] font-semibold">{info.name}</p>
              <p className="m-0 text-[12.5px] text-ink-soft">{info.description}</p>
              <a
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start rounded-lg bg-azul-soft px-3 py-1.5 text-[12.5px] font-semibold text-azul"
              >
                {dict.externalOrgs.donateLabel}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
