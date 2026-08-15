"use client";

import { useDictionary } from "@/lib/i18n/LanguageProvider";
import { SignOutButton } from "@/components/SignOutButton";

export function UnauthorizedNotice({ email }: { email: string }) {
  const dict = useDictionary();

  return (
    <main className="mx-auto w-full max-w-[640px] flex-1 px-4 py-16 text-center sm:px-7">
      <h2 className="m-0 font-[family-name:var(--font-display)] text-2xl font-medium">
        {dict.unauthorized.heading}
      </h2>
      <p className="mt-2 text-[14.5px] text-ink-soft">{dict.unauthorized.message(email)}</p>
      <div className="mt-6 flex justify-center">
        <SignOutButton />
      </div>
    </main>
  );
}
