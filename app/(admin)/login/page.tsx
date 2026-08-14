"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-7 py-16">
      <h2 className="m-0 font-[family-name:var(--font-display)] text-2xl font-medium">
        Acceso de coordinadores
      </h2>
      <p className="mt-2 text-[14.5px] text-ink-soft">
        Escribe el correo con el que fuiste invitado — te enviaremos un enlace
        de acceso, sin contraseña.
      </p>

      {status === "sent" ? (
        <p className="mt-6 rounded-lg bg-verde-soft px-4 py-3 text-[14px] font-medium text-verde">
          Listo — revisa tu correo y haz clic en el enlace para entrar.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-azul"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-lg bg-ink px-4 py-2.5 text-[13.5px] font-bold text-paper disabled:opacity-60"
          >
            {status === "sending" ? "Enviando..." : "Enviar enlace de acceso"}
          </button>
          {status === "error" && (
            <p className="text-[13px] font-medium text-rojo">
              No pudimos enviar el enlace. Intenta de nuevo.
            </p>
          )}
        </form>
      )}
    </main>
  );
}
