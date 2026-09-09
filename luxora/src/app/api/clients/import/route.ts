import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessIdForCurrentUser } from "@/lib/luxora/business-context";
import { normalizePhone, normalizeEmail } from "@/lib/luxora/dedupe";

const RowSchema = z.object({
  full_name: z.string().min(1),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  birthday: z.string().optional().nullable(),
});

const BodySchema = z.object({
  rows: z.array(RowSchema).min(1).max(1000),
});

export async function POST(request: Request) {
  const businessId = await getBusinessIdForCurrentUser();
  if (!businessId) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid import payload." }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: existingClients } = await supabase
    .from("clients")
    .select("id, full_name, phone, email")
    .eq("business_id", businessId);

  const existingByPhone = new Map<string, { id: string; full_name: string }>();
  const existingByEmail = new Map<string, { id: string; full_name: string }>();
  for (const c of existingClients ?? []) {
    const p = normalizePhone(c.phone);
    const e = normalizeEmail(c.email);
    if (p) existingByPhone.set(p, { id: c.id, full_name: c.full_name });
    if (e) existingByEmail.set(e, { id: c.id, full_name: c.full_name });
  }

  const toInsert: { full_name: string; phone: string | null; email: string | null; birthday: string | null }[] = [];
  const duplicates: { row: { full_name: string }; existing: { id: string; full_name: string } }[] = [];
  const seenPhones = new Set<string>();
  const seenEmails = new Set<string>();

  for (const row of parsed.data.rows) {
    const phone = normalizePhone(row.phone);
    const email = normalizeEmail(row.email);

    const existingMatch =
      (phone && existingByPhone.get(phone)) || (email && existingByEmail.get(email));

    const withinBatchDuplicate = (phone && seenPhones.has(phone)) || (email && seenEmails.has(email));

    if (existingMatch) {
      duplicates.push({ row: { full_name: row.full_name }, existing: existingMatch });
      continue;
    }
    if (withinBatchDuplicate) {
      continue;
    }

    if (phone) seenPhones.add(phone);
    if (email) seenEmails.add(email);

    toInsert.push({
      full_name: row.full_name,
      phone: row.phone || null,
      email: row.email || null,
      birthday: row.birthday || null,
    });
  }

  if (toInsert.length > 0) {
    const { error } = await supabase
      .from("clients")
      .insert(toInsert.map((r) => ({ ...r, business_id: businessId })));

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  return Response.json({ imported: toInsert.length, duplicates });
}
