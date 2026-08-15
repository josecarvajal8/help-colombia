"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDictionary } from "@/lib/i18n/LanguageProvider";

export function SignOutButton() {
  const router = useRouter();
  const dict = useDictionary();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink-soft"
    >
      {dict.signOut}
    </button>
  );
}
