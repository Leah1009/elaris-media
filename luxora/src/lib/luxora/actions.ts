"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { completeBusinessRegistrationIfNeeded, type PendingBusiness } from "@/lib/luxora/registration";
import { BUSINESS_TYPES, slugify, randomSlugSuffix } from "@/lib/luxora/business-types";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

const businessTypeValues = BUSINESS_TYPES.map((t) => t.value) as [string, ...string[]];

const RegisterSchema = z
  .object({
    businessName: z.string().min(2, "Business name is required."),
    ownerFullName: z.string().min(2, "Owner name is required."),
    businessPhone: z.string().min(7, "A valid phone number is required."),
    businessEmail: z.email("Enter a valid email."),
    addressLine1: z.string().min(3, "Address is required."),
    city: z.string().min(1, "City is required."),
    state: z.string().min(2, "State is required."),
    zip: z.string().min(3, "ZIP is required."),
    businessType: z.enum(businessTypeValues),
    businessTypeOther: z.string().optional(),
    description: z.string().optional(),
    preferredLanguage: z.enum(["en", "es"]).default("en"),
    email: z.email("Enter a valid login email."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => data.businessType !== "other" || !!data.businessTypeOther?.trim(),
    { error: "Please describe your business type.", path: ["businessTypeOther"] },
  );

export async function registerBusiness(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = RegisterSchema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const pendingBusiness: PendingBusiness = {
    name: data.businessName,
    business_type: data.businessType as PendingBusiness["business_type"],
    business_type_other: data.businessType === "other" ? data.businessTypeOther ?? null : null,
    phone: data.businessPhone,
    email: data.businessEmail,
    address_line1: data.addressLine1,
    city: data.city,
    state: data.state,
    zip: data.zip,
    description: data.description || null,
    slug: `${slugify(data.businessName)}-${randomSlugSuffix()}`,
    preferred_language: data.preferredLanguage,
  };

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.ownerFullName,
        pending_business: pendingBusiness,
      },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (signUpData.session && signUpData.user) {
    await completeBusinessRegistrationIfNeeded(supabase, signUpData.user);
    redirect("/dashboard");
  }

  redirect("/check-email");
}

const LoginSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export async function login(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = LoginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
