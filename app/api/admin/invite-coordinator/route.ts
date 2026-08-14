import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveRole } from "@/lib/supabase/role";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const role = await resolveRole(supabase);

  if (role.kind !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { email, pointId } = await request.json();
  if (!email || !pointId) {
    return NextResponse.json({ error: "Falta el correo o el punto" }, { status: 400 });
  }

  const admin = createAdminClient();
  const origin = new URL(request.url).origin;

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${origin}/auth/callback`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { error: profileError } = await admin
    .from("coordinator_profiles")
    .upsert({ id: data.user.id, point_id: pointId, email });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
