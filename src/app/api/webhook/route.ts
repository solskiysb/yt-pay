import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { pricingTiers } from "@/lib/config";
import type Stripe from "stripe";

export const runtime = "nodejs";

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getListingLimit(tier: string): number {
  const found = pricingTiers.find((t) => t.slug === tier);
  return found?.listings ?? 1;
}

async function isEventProcessed(
  supabase: ReturnType<typeof createServiceClient>,
  eventId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("billing_events")
    .select("id")
    .eq("stripe_event_id", eventId)
    .single();
  return !!data;
}

async function markEventProcessed(
  supabase: ReturnType<typeof createServiceClient>,
  eventId: string,
  eventType: string
) {
  await supabase.from("billing_events").insert({
    stripe_event_id: eventId,
    event_type: eventType,
  });
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Idempotency check
  if (await isEventProcessed(supabase, event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) break;

        await supabase
          .from("profiles")
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", userId);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        const tier = subscription.metadata?.tier ?? "free";
        const status = subscription.status;
        const billingStatus =
          status === "active" || status === "trialing"
            ? "active"
            : status === "past_due"
              ? "past_due"
              : status === "canceled"
                ? "canceled"
                : status;

        // In Stripe v22+, current_period_end lives on subscription items
        const firstItem = subscription.items?.data?.[0];
        const periodEnd = firstItem?.current_period_end;

        await supabase
          .from("profiles")
          .update({
            billing_plan: tier,
            billing_status: billingStatus,
            listing_limit: getListingLimit(tier),
            stripe_subscription_id: subscription.id,
            current_period_end: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
            trial_end: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
          })
          .eq("id", userId);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        // Downgrade to free
        await supabase
          .from("profiles")
          .update({
            billing_plan: "free",
            billing_status: "canceled",
            listing_limit: 1,
            stripe_subscription_id: null,
            current_period_end: null,
            trial_end: null,
          })
          .eq("id", userId);

        // Archive excess listings (keep only the most recent one)
        const { data: listings } = await supabase
          .from("listings")
          .select("id")
          .eq("user_id", userId)
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (listings && listings.length > 1) {
          const idsToArchive = listings.slice(1).map((l) => l.id);
          await supabase
            .from("listings")
            .update({ status: "archived" })
            .in("id", idsToArchive);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(
          `Invoice paid: ${invoice.id}, customer: ${invoice.customer}, amount: ${invoice.amount_paid}`
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ billing_status: "past_due" })
            .eq("id", profile.id);
        }
        break;
      }
    }

    await markEventProcessed(supabase, event.id, event.type);
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
