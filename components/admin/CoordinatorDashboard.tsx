"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  addNeed,
  deleteNeed,
  fetchPointById,
  updateNeed,
  updatePoint,
} from "@/lib/supabase/points";
import type { Need, NeedPriority, Point, PointStatus } from "@/lib/types";
import { useDictionary } from "@/lib/i18n/LanguageProvider";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SignOutButton } from "@/components/SignOutButton";

export function CoordinatorDashboard({
  pointId,
  email,
}: {
  pointId: string;
  email: string;
}) {
  const dict = useDictionary();
  const [point, setPoint] = useState<Point | null | "loading">("loading");

  useEffect(() => {
    const supabase = createClient();
    fetchPointById(supabase, pointId).then(setPoint);
  }, [pointId]);

  if (point === "loading") {
    return (
      <main className="mx-auto w-full max-w-[720px] flex-1 px-7 py-16">
        <p className="text-sm text-ink-soft">{dict.coordinator.loading}</p>
      </main>
    );
  }

  if (!point) {
    return (
      <main className="mx-auto w-full max-w-[720px] flex-1 px-7 py-16 text-center">
        <p className="text-sm text-ink-soft">{dict.coordinator.notFound(email)}</p>
      </main>
    );
  }

  return <PointEditor point={point} onChange={setPoint} email={email} />;
}

type SaveState = "idle" | "saving" | "saved" | "error";

function SaveIndicator({ state, dict }: { state: SaveState; dict: Dictionary }) {
  if (state === "idle") return null;
  return (
    <span
      className={`text-[12px] font-semibold ${
        state === "saving"
          ? "text-ink-soft"
          : state === "saved"
            ? "text-verde"
            : "text-rojo"
      }`}
    >
      {state === "saving" && dict.coordinator.saving}
      {state === "saved" && dict.coordinator.saved}
      {state === "error" && dict.coordinator.saveError}
    </span>
  );
}

function PointEditor({
  point,
  onChange,
  email,
}: {
  point: Point;
  onChange: (p: Point) => void;
  email: string;
}) {
  const dict = useDictionary();
  const supabase = useMemo(() => createClient(), []);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const statusOptions: { value: PointStatus; label: string }[] = [
    { value: "abierto", label: dict.statusOptions.abierto },
    { value: "saturado", label: dict.statusOptions.saturado },
    { value: "cerrado", label: dict.statusOptions.cerrado },
  ];

  const priorityOptions: { value: NeedPriority; label: string }[] = [
    { value: "alta", label: dict.priority.alta },
    { value: "media", label: dict.priority.media },
    { value: "baja", label: dict.priority.baja },
  ];

  async function withSave(fn: () => Promise<void>) {
    setSaveState("saving");
    try {
      await fn();
      setSaveState("saved");
      setTimeout(() => setSaveState((s) => (s === "saved" ? "idle" : s)), 2000);
    } catch (err) {
      console.error(err);
      setSaveState("error");
    }
  }

  async function handleStatusChange(status: PointStatus) {
    onChange({ ...point, status });
    await withSave(() => updatePoint(supabase, point.id, { status }));
  }

  async function handleFieldBlur(
    field: "address" | "mapsUrl" | "donationInfo",
    value: string,
  ) {
    const patch = { [field]: value || null } as Partial<{
      address: string;
      mapsUrl: string | null;
      donationInfo: string | null;
    }>;
    await withSave(() => updatePoint(supabase, point.id, patch));
  }

  async function handleAddNeed() {
    await withSave(async () => {
      const need = await addNeed(supabase, point.id, dict.coordinator.newNeedDefault, "media");
      onChange({ ...point, needs: [...point.needs, need] });
    });
  }

  async function handleRemoveNeed(id: string) {
    onChange({ ...point, needs: point.needs.filter((n) => n.id !== id) });
    await withSave(() => deleteNeed(supabase, id));
  }

  function patchNeedLocal(id: string, patch: Partial<Need>) {
    onChange({
      ...point,
      needs: point.needs.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    });
  }

  async function handleNeedPriorityChange(id: string, priority: NeedPriority) {
    patchNeedLocal(id, { priority });
    await withSave(() => updateNeed(supabase, id, { priority }));
  }

  async function handleNeedItemBlur(id: string, item: string) {
    await withSave(() => updateNeed(supabase, id, { item }));
  }

  return (
    <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-6 pb-16 sm:px-7">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2.5">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-2xl font-medium">
          {point.name}
        </h2>
        <SignOutButton />
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="m-0 text-[13px] text-ink-soft">
          {dict.coordinator.sessionLine(email, point.city)}
        </p>
        <SaveIndicator state={saveState} dict={dict} />
      </div>

      <div className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-line bg-white p-5">
        <div>
          <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
            {dict.coordinator.statusLabel}
          </label>
          <select
            value={point.status}
            onChange={(e) => handleStatusChange(e.target.value as PointStatus)}
            className="w-full rounded-lg border border-line bg-paper-dim px-3 py-2 text-[13.5px] font-semibold"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
            {dict.coordinator.addressLabel}
          </label>
          <input
            type="text"
            defaultValue={point.address}
            onBlur={(e) => handleFieldBlur("address", e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-[13.5px]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
            {dict.coordinator.mapsLabel}
          </label>
          <input
            type="url"
            defaultValue={point.mapsUrl ?? ""}
            placeholder="https://maps.google.com/..."
            onBlur={(e) => handleFieldBlur("mapsUrl", e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-[13.5px]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
            {dict.coordinator.donationLabel}
          </label>
          <textarea
            defaultValue={point.donationInfo ?? ""}
            placeholder={dict.coordinator.donationPlaceholder}
            onBlur={(e) => handleFieldBlur("donationInfo", e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-line px-3 py-2 text-[13.5px]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
            {dict.coordinator.needsLabel}
          </label>
          <div className="flex flex-col gap-2">
            {point.needs.map((need) => (
              <div key={need.id} className="flex items-center gap-1.5">
                <input
                  type="text"
                  defaultValue={need.item}
                  onBlur={(e) => handleNeedItemBlur(need.id, e.target.value)}
                  className="min-w-0 flex-1 rounded-md border border-line px-2.5 py-1.5 text-[12.5px]"
                />
                <select
                  value={need.priority}
                  onChange={(e) =>
                    handleNeedPriorityChange(need.id, e.target.value as NeedPriority)
                  }
                  className="rounded-md border border-line px-1.5 py-1.5 text-xs"
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveNeed(need.id)}
                  className="h-6 w-6 rounded-md bg-rojo-soft text-sm leading-none text-rojo"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddNeed}
              className="self-start rounded-md border border-dashed border-line px-2.5 py-1.5 text-xs font-semibold text-ink-soft hover:border-azul hover:text-azul"
            >
              {dict.coordinator.addNeed}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
