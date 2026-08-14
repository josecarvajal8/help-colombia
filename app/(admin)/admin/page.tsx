import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveRole } from "@/lib/supabase/role";
import { SignOutButton } from "@/components/SignOutButton";
import { CoordinatorDashboard } from "@/components/admin/CoordinatorDashboard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminView() {
  const supabase = await createClient();
  const role = await resolveRole(supabase);

  if (role.kind === "signed_out") {
    redirect("/login");
  }

  if (role.kind === "unauthorized") {
    return (
      <main className="mx-auto w-full max-w-[640px] flex-1 px-7 py-16 text-center">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-2xl font-medium">
          Sin acceso todavía
        </h2>
        <p className="mt-2 text-[14.5px] text-ink-soft">
          Tu cuenta ({role.user.email}) inició sesión correctamente, pero no
          está asignada a ningún punto ni tiene rol de administrador.
          Contacta al administrador para que te asigne un punto.
        </p>
        <div className="mt-6 flex justify-center">
          <SignOutButton />
        </div>
      </main>
    );
  }

  if (role.kind === "admin") {
    return <AdminDashboard email={role.user.email ?? ""} />;
  }

  return <CoordinatorDashboard pointId={role.pointId} email={role.user.email ?? ""} />;
}
