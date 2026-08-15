import type { Dictionary } from "@/lib/i18n/dictionaries";

export function formatRelative(isoDate: string, dict: Dictionary): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.round(diffMs / 60_000);

  if (minutes < 1) return dict.relativeTime.justNow;
  if (minutes < 60) return dict.relativeTime.minutesAgo(minutes);

  const hours = Math.round(minutes / 60);
  if (hours < 24) return dict.relativeTime.hoursAgo(hours);

  const days = Math.round(hours / 24);
  return dict.relativeTime.daysAgo(days);
}
