import { createClient } from "@/lib/supabase/server";
import { getBusinessIdForCurrentUser } from "@/lib/luxora/business-context";

const PERIOD_DAYS: Record<string, number> = { "7": 7, "30": 30, "90": 90, "365": 365 };

function isValidDateStr(s: string | null): s is string {
  return Boolean(s) && /^\d{4}-\d{2}-\d{2}$/.test(s!);
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * A business's own payment ledger for the period, as a downloadable CSV —
 * the same auth and RLS every other dashboard page uses (no anon access),
 * scoped to the caller's business only.
 */
export async function GET(request: Request) {
  const businessId = await getBusinessIdForCurrentUser();
  if (!businessId) {
    return new Response("Not authenticated.", { status: 401 });
  }
  const supabase = await createClient();

  const url = new URL(request.url);
  const period = url.searchParams.get("period");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const isCustomRange = isValidDateStr(from) && isValidDateStr(to);

  const periodStart = isCustomRange
    ? new Date(`${from}T00:00:00.000Z`).toISOString()
    : period && PERIOD_DAYS[period]
      ? new Date(Date.now() - PERIOD_DAYS[period] * 86_400_000).toISOString()
      : null;
  const periodEnd = isCustomRange ? new Date(`${to}T23:59:59.999Z`).toISOString() : null;

  let query = supabase
    .from("payments")
    .select("created_at, method, status, total_cents, deposit_applied_cents, notes, client:client_id(full_name)")
    .eq("business_id", businessId)
    .order("created_at", { ascending: true });
  if (periodStart) query = query.gte("created_at", periodStart);
  if (periodEnd) query = query.lte("created_at", periodEnd);

  const { data: payments, error } = await query;
  if (error) {
    return new Response("Could not generate export.", { status: 500 });
  }

  const header = ["Date", "Client", "Method", "Status", "Amount", "Deposit Applied", "Notes"];
  const rows = (payments ?? []).map((p) => [
    new Date(p.created_at).toISOString().slice(0, 10),
    (p.client as unknown as { full_name: string } | null)?.full_name ?? "",
    p.method,
    p.status,
    (p.total_cents / 100).toFixed(2),
    (p.deposit_applied_cents / 100).toFixed(2),
    p.notes ?? "",
  ]);

  const csv = [header, ...rows].map((row) => row.map((cell) => csvEscape(String(cell))).join(",")).join("\n");
  const filename = `luxore-report-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
