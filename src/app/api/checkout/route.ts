import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { pricingTiers, siteConfig, type TierSlug } from "@/lib/config";

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

    const tier = pricingTiers.find((t) => t.slug === tierSlug);
    if (!tier) {
      return NextResponse.json(
        { error: "Invalid pricing tier" },
        { status: 400 }
      );
    }

    const amountInCents = tier.earlyAdopterPrice * 100;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: amountInCents,
            product_data: {
              name: `${siteConfig.name} — ${tier.name} Plan`,
              description: `${tier.listings} ${tier.listings === 1 ? "listing" : "listings"}, ${tier.durationDays} days active`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        tier: tier.slug,
        listingsCount: String(tier.listings),
        durationDays: String(tier.durationDays),
      },
      success_url: `${siteConfig.url}/dashboard/listings?payment=success`,
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
