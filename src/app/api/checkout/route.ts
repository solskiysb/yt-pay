import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import {
  pricingTiers,
  siteConfig,
  type TierSlug,
  type BillingInterval,
} from "@/lib/config";

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const tierSlug = body.tier as TierSlug;
    const interval = (body.interval as BillingInterval) || "month";

    const tier = pricingTiers.find((t) => t.slug === tierSlug);
    if (!tier) {
      return NextResponse.json(
        { error: "Invalid pricing tier" },
        { status: 400 }
      );
    }

    // Free tier — no Stripe session needed
    if (tier.slug === "free") {
      return NextResponse.json({ url: "/dashboard" });
    }

    if (interval !== "month" && interval !== "year") {
      return NextResponse.json(
        { error: "Invalid billing interval" },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id as string | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const unitAmount =
      interval === "month"
        ? tier.monthlyPrice * 100
        : tier.yearlyPrice * 100;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: unitAmount,
            recurring: { interval },
            product_data: {
              name: `${siteConfig.name} — ${tier.name} Plan`,
              description: `Up to ${tier.listings} active listings`,
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          userId: user.id,
          tier: tier.slug,
        },
      },
      metadata: {
        userId: user.id,
        tier: tier.slug,
      },
      success_url: `${siteConfig.url}/dashboard?subscription=success`,
      cancel_url: `${siteConfig.url}/sell`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
