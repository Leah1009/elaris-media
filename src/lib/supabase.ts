import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export type LeadInsert = {
  business_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  services_needed: string[];
  notes: string | null;
  lang: string;
};
