import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { CheckoutForm } from "@/components/checkout-form";

export default async function CheckoutPage({ params }: { params: Promise<{ appointmentId: string }> }) {
  const { appointmentId } = await params;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, client:client_id(full_name)")
    .eq("id", appointmentId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!appointment) notFound();

  const { data: lineItemRows } = await supabase
    .from("appointment_services")
    .select("price_cents, service:service_id(name)")
    .eq("appointment_id", appointmentId);

  const { data: connectedAccount } = await supabase
    .from("stripe_connected_accounts")
    .select("charges_enabled")
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  const serviceLines = (lineItemRows ?? []).map((row) => ({
    name: (row.service as unknown as { name: string } | null)?.name ?? "Service",
    price_cents: row.price_cents,
  }));

  return (
    <div className="max-w-md">
      <h1 className="font-display text-2xl text-charcoal">Checkout</h1>
      <div className="mt-6">
        <CheckoutForm
          appointmentId={appointment.id}
          clientName={(appointment.client as unknown as { full_name: string } | null)?.full_name ?? "Client"}
          serviceLines={serviceLines}
          taxRatePercent={Number(ctx.business.tax_rate_percent ?? 0)}
          cardEnabled={connectedAccount?.charges_enabled ?? false}
        />
      </div>
    </div>
  );
}
