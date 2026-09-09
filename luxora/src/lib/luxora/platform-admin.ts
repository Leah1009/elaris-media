import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Guards every /admin page. Platform-admin status lives on
 * profiles.is_platform_admin, a column only the service role can flip (see
 * the prevent_admin_self_promotion trigger) — never a JWT claim a client
 * could forge. Every admin_* RPC re-checks this server-side anyway; this
 * is just what keeps a non-admin from seeing the admin UI at all.
 */
export async function requirePlatformAdmin(): Promise<{ userId: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: isAdmin } = await supabase.rpc("is_platform_admin");
  if (!isAdmin) redirect("/dashboard");

  return { userId: user.id };
}
