import type { SupabaseClient, User } from "@supabase/supabase-js";

export type Role =
  | { kind: "admin"; user: User }
  | { kind: "coordinator"; user: User; pointId: string }
  | { kind: "unauthorized"; user: User }
  | { kind: "signed_out" };

export async function resolveRole(supabase: SupabaseClient): Promise<Role> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { kind: "signed_out" };

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (admin) return { kind: "admin", user };

  const { data: profile } = await supabase
    .from("coordinator_profiles")
    .select("point_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.point_id) {
    return { kind: "coordinator", user, pointId: profile.point_id };
  }

  return { kind: "unauthorized", user };
}
