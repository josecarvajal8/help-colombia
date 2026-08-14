import { createClient } from "@/lib/supabase/server";
import { fetchPoints } from "@/lib/supabase/points";
import { PublicPointsView } from "@/components/PublicPointsView";

export default async function PublicView() {
  const supabase = await createClient();
  const points = await fetchPoints(supabase);

  return <PublicPointsView initialPoints={points} />;
}
