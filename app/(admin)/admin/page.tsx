import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveRole } from "@/lib/supabase/role";
import { UnauthorizedNotice } from "@/components/UnauthorizedNotice";
import { CoordinatorDashboard } from "@/components/admin/CoordinatorDashboard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminView() {
  const supabase = await createClient();
  const role = await resolveRole(supabase);

  if (role.kind === "signed_out") {
    redirect("/login");
  }

  if (role.kind === "unauthorized") {
    return <UnauthorizedNotice email={role.user.email ?? ""} />;
  }

  if (role.kind === "admin") {
    return <AdminDashboard email={role.user.email ?? ""} />;
  }

  return <CoordinatorDashboard pointId={role.pointId} email={role.user.email ?? ""} />;
}
