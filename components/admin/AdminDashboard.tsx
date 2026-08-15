"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  type AdminPoint,
  createPoint,
  deletePoint,
  fetchAdminPoints,
  updatePoint,
} from "@/lib/supabase/points";
import type { City, PointStatus } from "@/lib/types";
import { SignOutButton } from "@/components/SignOutButton";
import { StatusPill } from "@/components/StatusPulse";

const STATUS_OPTIONS: { value: PointStatus; label: string }[] = [
  { value: "abierto", label: "Recibiendo donaciones" },
  { value: "saturado", label: "Saturado (parcial)" },
  { value: "cerrado", label: "Cerrado" },
];

export function AdminDashboard({ email }: { email: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [points, setPoints] = useState<AdminPoint[] | "loading">("loading");

  const refetch = useCallback(async () => {
    setPoints(await fetchAdminPoints(supabase));
  }, [supabase]);

  useEffect(() => {
    // Client-only fetch on mount — there's no server-rendered initial data
    // for the admin view, unlike the public view's SSR pass.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, [refetch]);

  return (
    <main className="mx-auto w-full max-w-[900px] flex-1 px-4 py-6 pb-16 sm:px-7">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2.5">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-2xl font-medium">
          Panel admin
        </h2>
        <SignOutButton />
      </div>
      <p className="mb-6 text-[13px] text-ink-soft">Sesión de {email}</p>

      <NewPointForm
        onCreated={(p) =>
          setPoints((prev) => (prev === "loading" ? prev : [...prev, p]))
        }
      />

      <div className="mt-6 flex flex-col gap-3">
        {points === "loading" ? (
          <p className="text-sm text-ink-soft">Cargando puntos…</p>
        ) : (
          points.map((point) => (
            <PointRow key={point.id} point={point} onChanged={refetch} />
          ))
        )}
      </div>
    </main>
  );
}

function NewPointForm({ onCreated }: { onCreated: (p: AdminPoint) => void }) {
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState<City>("NJ");
  const [mapsUrl, setMapsUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const point = await createPoint(supabase, {
        name,
        address,
        city,
        mapsUrl: mapsUrl || null,
      });
      onCreated(point);
      setName("");
      setAddress("");
      setMapsUrl("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-dashed border-azul bg-azul-soft p-4"
    >
      <span className="text-[11px] font-bold uppercase tracking-wide text-azul">
        Registrar nuevo punto de acopio
      </span>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <input
          required
          placeholder="Nombre del punto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-line bg-white px-3 py-2 text-[13.5px]"
        />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value as City)}
          className="rounded-lg border border-line bg-white px-3 py-2 text-[13.5px]"
        >
          <option value="NJ">Nueva Jersey</option>
          <option value="NYC">Nueva York</option>
        </select>
        <input
          required
          placeholder="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] sm:col-span-2"
        />
        <input
          placeholder="Enlace de Google Maps (opcional)"
          value={mapsUrl}
          onChange={(e) => setMapsUrl(e.target.value)}
          className="rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] sm:col-span-2"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="self-start rounded-lg bg-azul px-4 py-2 text-[13px] font-bold text-white disabled:opacity-60"
      >
        {saving ? "Creando..." : "+ Crear punto"}
      </button>
    </form>
  );
}

function PointRow({
  point,
  onChanged,
}: {
  point: AdminPoint;
  onChanged: () => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  async function handleStatusChange(status: PointStatus) {
    await updatePoint(supabase, point.id, { status });
    onChanged();
  }

  async function handleDelete() {
    await deletePoint(supabase, point.id);
    onChanged();
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setInviteError(null);
    try {
      const res = await fetch("/api/admin/invite-coordinator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, pointId: point.id }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Error al invitar");
      setInviteEmail("");
      onChanged();
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "Error al invitar");
    } finally {
      setInviting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-white p-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="m-0 text-[14.5px] font-semibold">{point.name}</p>
        <p className="m-0 text-[12px] text-ink-soft">
          {point.address} · {point.city}
        </p>
        <p className="mt-1 text-[12px] text-ink-soft">
          {point.coordinatorEmail
            ? `Coordinador: ${point.coordinatorEmail}`
            : "Sin coordinador asignado"}
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        <div className="flex items-center gap-2">
          <StatusPill status={point.status} />
          <select
            value={point.status}
            onChange={(e) => handleStatusChange(e.target.value as PointStatus)}
            className="rounded-lg border border-line bg-paper-dim px-2 py-1 text-xs font-semibold"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {!point.coordinatorEmail && (
          <form onSubmit={handleInvite} className="flex w-full items-center gap-1.5">
            <input
              type="email"
              required
              placeholder="correo del coordinador"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-line px-2 py-1 text-xs"
            />
            <button
              type="submit"
              disabled={inviting}
              className="rounded-md bg-ink px-2.5 py-1 text-xs font-bold text-paper disabled:opacity-60"
            >
              Invitar
            </button>
          </form>
        )}
        {inviteError && <p className="text-xs text-rojo">{inviteError}</p>}

        <button
          type="button"
          onClick={handleDelete}
          className="text-xs font-semibold text-rojo"
        >
          Eliminar punto
        </button>
      </div>
    </div>
  );
}
