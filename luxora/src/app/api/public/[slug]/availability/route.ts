import { createClient } from "@/lib/supabase/server";
import { getBookableBusinessBySlug, SLOT_INCREMENT_MINUTES } from "@/lib/luxora/public-booking";
import { zonedTimeToUtc } from "@/lib/luxora/timezone";

/**
 * Real availability: business hours for the requested day, minus whatever
 * conflicts already exist for each candidate staff member — not a fake
 * stub. There's no staff-specific working-hours override yet (that table
 * exists but has no editor UI), so every active staff qualified for the
 * selected services is treated as available during business hours. The
 * database's EXCLUDE constraint is still the final word if two people book
 * the same slot at the same instant.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = new URL(request.url);
  const serviceIds = (url.searchParams.get("serviceIds") ?? "").split(",").filter(Boolean);
  const staffParam = url.searchParams.get("staffId"); // omitted or "any"
  const date = url.searchParams.get("date");

  if (serviceIds.length === 0 || !date) {
    return Response.json({ error: "Missing service or date." }, { status: 400 });
  }

  const business = await getBookableBusinessBySlug(slug);
  if (!business) {
    return Response.json({ error: "This business is not accepting bookings." }, { status: 404 });
  }
  if (!business.online_booking_enabled) {
    return Response.json({ slots: [] });
  }

  const supabase = await createClient();
  const tz = business.timezone;

  const { data: services } = await supabase
    .from("services")
    .select("id, duration_minutes")
    .eq("business_id", business.id)
    .eq("active", true)
    .in("id", serviceIds);

  if (!services || services.length !== serviceIds.length) {
    return Response.json({ error: "Invalid service selection." }, { status: 400 });
  }
  const totalMinutes = services.reduce((sum, s) => sum + s.duration_minutes, 0);

  const { data: location } = await supabase
    .from("locations")
    .select("id")
    .eq("business_id", business.id)
    .eq("is_primary", true)
    .maybeSingle();
  if (!location) {
    return Response.json({ error: "No location available." }, { status: 404 });
  }

  const dayOfWeek = new Date(`${date}T00:00:00Z`).getUTCDay();
  const { data: hours } = await supabase
    .from("business_hours")
    .select("open_time, close_time, closed")
    .eq("location_id", location.id)
    .eq("day_of_week", dayOfWeek)
    .maybeSingle();

  if (!hours || hours.closed || !hours.open_time || !hours.close_time) {
    return Response.json({ slots: [] });
  }

  // Candidate staff: active, at this location, qualified for every selected service.
  const { data: staffAtLocation } = await supabase
    .from("staff_locations")
    .select("staff_id")
    .eq("location_id", location.id);
  const staffIdsAtLocation = new Set((staffAtLocation ?? []).map((r) => r.staff_id));

  const { data: staffServiceRows } = await supabase
    .from("staff_services")
    .select("staff_id, service_id")
    .in("service_id", serviceIds);

  const qualifiedCounts = new Map<string, number>();
  for (const row of staffServiceRows ?? []) {
    qualifiedCounts.set(row.staff_id, (qualifiedCounts.get(row.staff_id) ?? 0) + 1);
  }
  let candidateStaffIds = [...qualifiedCounts.entries()]
    .filter(([, count]) => count === serviceIds.length)
    .map(([staffId]) => staffId)
    .filter((id) => staffIdsAtLocation.size === 0 || staffIdsAtLocation.has(id));

  if (staffParam && staffParam !== "any") {
    candidateStaffIds = candidateStaffIds.filter((id) => id === staffParam);
  }

  if (candidateStaffIds.length === 0) {
    return Response.json({ slots: [] });
  }

  const { data: activeStaff } = await supabase
    .from("staff")
    .select("id")
    .eq("business_id", business.id)
    .eq("active", true)
    .in("id", candidateStaffIds);
  candidateStaffIds = (activeStaff ?? []).map((s) => s.id);

  const dayStart = zonedTimeToUtc(date, "00:00", tz);
  const dayEnd = zonedTimeToUtc(date, "23:59", tz);

  const windowEndMs = Date.now() + business.booking_window_days * 24 * 60 * 60 * 1000;
  if (dayStart.getTime() > windowEndMs) {
    return Response.json({ slots: [] });
  }

  const { data: existingAppointments } = await supabase
    .from("appointments")
    .select("staff_id, start_at, end_at")
    .eq("business_id", business.id)
    .in("staff_id", candidateStaffIds)
    .neq("status", "cancelled")
    .gte("start_at", dayStart.toISOString())
    .lte("end_at", dayEnd.toISOString());

  const busyByStaff = new Map<string, { start: number; end: number }[]>();
  for (const appt of existingAppointments ?? []) {
    const list = busyByStaff.get(appt.staff_id) ?? [];
    list.push({ start: new Date(appt.start_at).getTime(), end: new Date(appt.end_at).getTime() });
    busyByStaff.set(appt.staff_id, list);
  }

  const [openH, openM] = hours.open_time.slice(0, 5).split(":").map(Number);
  const [closeH, closeM] = hours.close_time.slice(0, 5).split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const slots: { time: string; staffId: string }[] = [];
  const now = Date.now();
  const earliestBookableMs = now + business.min_notice_hours * 60 * 60 * 1000;
  const bufferMs = business.buffer_minutes * 60 * 1000;

  for (let m = openMinutes; m + totalMinutes <= closeMinutes; m += SLOT_INCREMENT_MINUTES) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    const slotStart = zonedTimeToUtc(date, `${hh}:${mm}`, tz);
    const slotStartMs = slotStart.getTime();
    const slotEndMs = slotStartMs + totalMinutes * 60_000;

    if (slotStartMs < earliestBookableMs) continue;

    const freeStaff = candidateStaffIds.find((staffId) => {
      const busy = busyByStaff.get(staffId) ?? [];
      return !busy.some((b) => slotStartMs < b.end + bufferMs && slotEndMs > b.start - bufferMs);
    });

    if (freeStaff) {
      slots.push({ time: `${hh}:${mm}`, staffId: freeStaff });
    }
  }

  return Response.json({ slots, locationId: location.id, timezone: tz });
}
