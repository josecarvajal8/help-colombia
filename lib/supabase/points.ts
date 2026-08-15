import type { SupabaseClient } from "@supabase/supabase-js";
import type { City, Need, NeedPriority, Point, PointStatus } from "@/lib/types";

const POINTS_SELECT =
  "id, name, address, city, status, maps_url, donation_info, schedule, updated_at, needs(id, item, priority)";

type PointRow = {
  id: string;
  name: string;
  address: string;
  city: Point["city"];
  status: Point["status"];
  maps_url: string | null;
  donation_info: string | null;
  schedule: string | null;
  updated_at: string;
  needs: { id: string; item: string; priority: NeedPriority }[];
};

function mapPointRow(row: PointRow): Point {
  const needs: Need[] = row.needs.map((n) => ({
    id: n.id,
    item: n.item,
    priority: n.priority,
  }));

  return {
    id: row.id,
    name: row.name,
    address: row.address,
    city: row.city,
    status: row.status,
    mapsUrl: row.maps_url,
    donationInfo: row.donation_info,
    schedule: row.schedule,
    needs,
    updatedAt: row.updated_at,
  };
}

export async function fetchPoints(
  supabase: SupabaseClient,
): Promise<Point[]> {
  const { data, error } = await supabase
    .from("points")
    .select(POINTS_SELECT)
    .order("name", { ascending: true });

  if (error) throw error;

  return (data as unknown as PointRow[]).map(mapPointRow);
}

export async function fetchPointById(
  supabase: SupabaseClient,
  id: string,
): Promise<Point | null> {
  const { data, error } = await supabase
    .from("points")
    .select(POINTS_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data ? mapPointRow(data as unknown as PointRow) : null;
}

export async function updatePoint(
  supabase: SupabaseClient,
  id: string,
  patch: Partial<{
    status: PointStatus;
    address: string;
    mapsUrl: string | null;
    donationInfo: string | null;
    schedule: string | null;
  }>,
) {
  const { error } = await supabase
    .from("points")
    .update({
      ...(patch.status !== undefined && { status: patch.status }),
      ...(patch.address !== undefined && { address: patch.address }),
      ...(patch.mapsUrl !== undefined && { maps_url: patch.mapsUrl }),
      ...(patch.donationInfo !== undefined && { donation_info: patch.donationInfo }),
      ...(patch.schedule !== undefined && { schedule: patch.schedule }),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function addNeed(
  supabase: SupabaseClient,
  pointId: string,
  item: string,
  priority: NeedPriority,
): Promise<Need> {
  const { data, error } = await supabase
    .from("needs")
    .insert({ point_id: pointId, item, priority })
    .select("id, item, priority")
    .single();

  if (error) throw error;
  return data;
}

export async function updateNeed(
  supabase: SupabaseClient,
  id: string,
  patch: Partial<{ item: string; priority: NeedPriority }>,
) {
  const { error } = await supabase.from("needs").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteNeed(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("needs").delete().eq("id", id);
  if (error) throw error;
}

export type AdminPoint = Point & { coordinatorEmail: string | null };

const ADMIN_POINTS_SELECT =
  "id, name, address, city, status, maps_url, donation_info, schedule, updated_at, needs(id, item, priority), coordinator_profiles(email)";

export async function fetchAdminPoints(
  supabase: SupabaseClient,
): Promise<AdminPoint[]> {
  const { data, error } = await supabase
    .from("points")
    .select(ADMIN_POINTS_SELECT)
    .order("name", { ascending: true });

  if (error) throw error;

  return (
    data as unknown as (PointRow & {
      coordinator_profiles: { email: string | null }[];
    })[]
  ).map((row) => ({
    ...mapPointRow(row),
    coordinatorEmail: row.coordinator_profiles[0]?.email ?? null,
  }));
}

export async function createPoint(
  supabase: SupabaseClient,
  input: { name: string; address: string; city: City; mapsUrl: string | null },
): Promise<AdminPoint> {
  const { data, error } = await supabase
    .from("points")
    .insert({
      name: input.name,
      address: input.address,
      city: input.city,
      maps_url: input.mapsUrl,
    })
    .select(ADMIN_POINTS_SELECT)
    .single();

  if (error) throw error;

  const row = data as unknown as PointRow & {
    coordinator_profiles: { email: string | null }[];
  };
  return { ...mapPointRow(row), coordinatorEmail: null };
}

export async function deletePoint(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("points").delete().eq("id", id);
  if (error) throw error;
}
