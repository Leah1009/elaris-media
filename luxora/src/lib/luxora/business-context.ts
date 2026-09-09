import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { completeBusinessRegistrationIfNeeded } from "@/lib/luxora/registration";

export type BusinessContext = {
  userId: string;
  role: string;
  business: {
    id: string;
    name: string;
    slug: string;
    business_type: string;
  };
  access: {
    subscriptionStatus: string;
    trialEndsAt: string | null;
    isLocked: boolean;
  };
};

/**
 * Single source of truth for "who is signed in, which business are they in,
 * and is that business locked" — used by the dashboard layout and by any
 * page that needs to render differently while trial/subscription is locked.
 * Wrapped in React's cache() so layout + page both calling it in the same
 * request only hit the database once.
 */
export const getBusinessContext = cache(async (): Promise<BusinessContext> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await completeBusinessRegistrationIfNeeded(supabase, user);

  const { data: membership } = await supabase
    .from("business_members")
    .select("role, business_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    redirect("/register");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug, business_type")
    .eq("id", membership.business_id)
    .maybeSingle();

  if (!business) {
    redirect("/register");
  }

  const { data: access } = await supabase
    .from("business_access_status")
    .select("subscription_status, trial_ends_at, is_locked")
    .eq("business_id", business.id)
    .maybeSingle();

  return {
    userId: user.id,
    role: membership.role,
    business,
    access: {
      subscriptionStatus: access?.subscription_status ?? "trialing",
      trialEndsAt: access?.trial_ends_at ?? null,
      isLocked: access?.is_locked ?? false,
    },
  };
});

export function daysRemaining(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0;
  const ms = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
