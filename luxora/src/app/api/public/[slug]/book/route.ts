import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBookableBusinessBySlug } from "@/lib/luxora/public-booking";
import { zonedTimeToUtc } from "@/lib/luxora/timezone";

const EXCLUSION_VIOLATION = "23P01";

const BodySchema = z.object({
  serviceIds: z.array(z.uuid()).min(1),
  staffId: z.uuid(),
  locationId: z.uuid(),
  date: z.string().min(1),
  time: z.string().min(1),
  clientId: z.uuid().optional().nullable(),
  newClient: z
    .object({
      fullName: z.string().min(1),
      phone: z.string().optional(),
      email: z.union([z.email(), z.literal("")]).optional(),
    })
    .optional(),
  notes: z.string().optional(),
  formSubmissions: z.array(z.object({ form_id: z.uuid(), answers: z.record(z.string(), z.any()) })).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBookableBusinessBySlug(slug);
  if (!business) {
    return Response.json({ error: "This business is not accepting bookings." }, { status: 404 });
  }

  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid booking request." }, { status: 400 });
  }
  const data = parsed.data;

  if (!data.clientId && !data.newClient) {
    return Response.json({ error: "Client information is required." }, { status: 400 });
  }

  const startAt = zonedTimeToUtc(data.date, data.time, business.timezone);
  const supabase = await createClient();

  const { data: appointmentId, error } = await supabase.rpc("create_online_booking", {
    p_business_id: business.id,
    p_service_ids: data.serviceIds,
    p_staff_id: data.staffId,
    p_location_id: data.locationId,
    p_start_at: startAt.toISOString(),
    p_client_id: data.clientId ?? null,
    p_new_client_full_name: data.newClient?.fullName ?? null,
    p_new_client_phone: data.newClient?.phone ?? null,
    p_new_client_email: data.newClient?.email ?? null,
    p_notes: data.notes ?? null,
    p_form_submissions: data.formSubmissions ?? [],
  });

  if (error) {
    if (error.code === EXCLUSION_VIOLATION) {
      return Response.json(
        { error: "That time was just booked by someone else. Please choose another." },
        { status: 409 },
      );
    }
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ appointmentId });
}
