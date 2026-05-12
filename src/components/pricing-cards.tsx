"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { pricingTiers, type TierSlug } from "@/lib/config";

interface PricingCardsProps {
  isLoggedIn: boolean;
}

export function PricingCards({ isLoggedIn }: PricingCardsProps) {
  const [loadingTier, setLoadingTier] = useState<TierSlug | null>(null);

  const handleCheckout = async (tierSlug: TierSlug) => {
    if (!isLoggedIn) {
      window.location.href = "/register";
      return;
    }

    setLoadingTier(tierSlug);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierSlug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to start checkout"
      );
      setLoadingTier(null);
    }
  };

  return (
    <div className="mt-14 grid gap-6 lg:grid-cols-3">
      {pricingTiers.map((tier) => {
        const isLoading = loadingTier === tier.slug;

        return (
          <div
            key={tier.name}
            className={`relative rounded-2xl p-8 ${
              tier.popular
                ? "bg-amber-500 text-stone-900 ring-2 ring-amber-400"
                : "bg-stone-800 text-stone-100"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-1 text-xs font-bold text-amber-400 uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <h3 className="text-lg font-bold">{tier.name}</h3>
            <p
              className={`mt-1 text-sm ${tier.popular ? "text-stone-700" : "text-stone-400"}`}
            >
              Up to {tier.listings}{" "}
              {tier.listings === 1 ? "listing" : "listings"}
            </p>

            <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  &euro;{tier.earlyAdopterPrice}
                </span>
                <span
                  className={`text-lg line-through ${tier.popular ? "text-stone-600" : "text-stone-500"}`}
                >
                  &euro;{tier.price}
                </span>
              </div>
              <p
                className={`mt-1 text-sm font-medium ${tier.popular ? "text-stone-700" : "text-amber-400"}`}
              >
                Early adopter price
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check
                    className={`mt-0.5 size-4 shrink-0 ${tier.popular ? "text-stone-900" : "text-amber-400"}`}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(tier.slug)}
              disabled={loadingTier !== null}
              className={`mt-8 flex h-11 w-full items-center justify-center rounded-full font-medium transition disabled:opacity-70 ${
                tier.popular
                  ? "bg-stone-900 text-white hover:bg-stone-800"
                  : "bg-amber-500 text-stone-900 hover:bg-amber-400"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "Get Started"
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
