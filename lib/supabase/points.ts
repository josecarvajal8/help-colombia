import type { SupabaseClient } from "@supabase/supabase-js";
import type { Need, NeedPriority, Point } from "@/lib/types";

const POINTS_SELECT =
  "id, name, address, city, status, maps_url, donation_info, updated_at, needs(id, item, priority)";

type PointRow = {
  id: string;
  name: string;
  address: string;
  city: Point["city"];
  status: Point["status"];
  maps_url: string | null;
  donation_info: string | null;
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
