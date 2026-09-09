import Stripe from "stripe";
import { getStripeClient, isStripeConfigured } from "@/lib/luxora/stripe";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Register this endpoint in the Stripe Dashboard as a CONNECT webhook (not
 * a regular account webhook) so it also receives events — like
 * payment_intent.succeeded — from businesses' connected accounts, not just
 * Luxora's own platform account.
 *
 * Authenticated entirely by Stripe's signature (no Supabase session exists
 * for a server-to-server callback), so this is the one place in the app
 * that uses the service-role client to write directly, bypassing RLS.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return Response.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!webhookSecret || !signature) {
    return Response.json({ error: "Missing webhook signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  switch (event.type) {
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      await supabase
        .from("stripe_connected_accounts")
        .update({
          charges_enabled: account.charges_enabled ?? false,
          payouts_enabled: account.payouts_enabled ?? false,
          details_submitted: account.details_submitted ?? false,
        })
        .eq("stripe_account_id", account.id);
      break;
    }

    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const { data: payment } = await supabase
        .from("payments")
        .select("id, status, appointment_id, client_id, total_cents")
        .eq("stripe_payment_intent_id", intent.id)
        .maybeSingle();

      if (payment && payment.status !== "succeeded") {
        await supabase.from("payments").update({ status: "succeeded" }).eq("id", payment.id);

        if (payment.appointment_id) {
          const { data: appointment } = await supabase
            .from("appointments")
            .select("id, status, start_at")
            .eq("id", payment.appointment_id)
            .maybeSingle();

          if (appointment && appointment.status !== "completed") {
            await supabase.from("appointments").update({ status: "completed" }).eq("id", appointment.id);

            if (payment.client_id) {
              const { data: client } = await supabase
                .from("clients")
                .select("id, total_visits, first_visit_at, lifetime_spend_cents")
                .eq("id", payment.client_id)
                .maybeSingle();

              if (client) {
                await supabase
                  .from("clients")
                  .update({
                    total_visits: client.total_visits + 1,
                    first_visit_at: client.first_visit_at ?? appointment.start_at,
                    last_visit_at: appointment.start_at,
                    lifetime_spend_cents: client.lifetime_spend_cents + payment.total_cents,
                  })
                  .eq("id", client.id);
              }
            }
          }
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await supabase.from("payments").update({ status: "failed" }).eq("stripe_payment_intent_id", intent.id);
      break;
    }

    default:
      break;
  }

  return Response.json({ received: true });
}
