"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import {
  pricingTiers,
  type TierSlug,
  type BillingInterval,
} from "@/lib/config";

interface PricingCardsProps {
  isLoggedIn: boolean;
}

export function PricingCards({ isLoggedIn }: PricingCardsProps) {
  const [loadingTier, setLoadingTier] = useState<TierSlug | null>(null);
  const [interval, setInterval] = useState<BillingInterval>("month");

  const handleCheckout = async (tierSlug: TierSlug) => {
    if (tierSlug === "free") {
      window.location.href = isLoggedIn ? "/dashboard" : "/register";
      return;
    }

    if (!isLoggedIn) {
      window.location.href = "/register";
      return;
    }

    setLoadingTier(tierSlug);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierSlug, interval }),
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
    <div>
      {/* Monthly / Yearly toggle */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium ${interval === "month" ? "text-white" : "text-stone-400"}`}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={interval === "year"}
          onClick={() =>
            setInterval((prev) => (prev === "month" ? "year" : "month"))
          }
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            interval === "year" ? "bg-amber-500" : "bg-stone-600"
          }`}
        >
          <span
            className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow transition-transform ${
              interval === "year" ? "translate-x-5" : "translate-x-0.5"
            } mt-0.5`}
          />
        </button>
        <span
          className={`text-sm font-medium ${interval === "year" ? "text-white" : "text-stone-400"}`}
        >
          Yearly
        </span>
        {interval === "year" && (
          <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-400">
            Save ~17%
          </span>
        )}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {pricingTiers.map((tier) => {
          const isLoading = loadingTier === tier.slug;
          const isFree = tier.slug === "free";
          const displayPrice =
            interval === "month" ? tier.monthlyPrice : tier.yearlyPrice;

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
                {isFree
                  ? "Get started for free"
                  : `Up to ${tier.listings} listings`}
              </p>

              <div className="mt-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    {isFree ? "Free" : `\u20AC${displayPrice}`}
                  </span>
                  {!isFree && (
                    <span
                      className={`text-sm ${tier.popular ? "text-stone-700" : "text-stone-400"}`}
                    >
                      /{interval === "month" ? "mo" : "yr"}
                    </span>
                  )}
                </div>
                {!isFree && interval === "year" && (
                  <p
                    className={`mt-1 text-sm ${tier.popular ? "text-stone-700" : "text-stone-400"}`}
                  >
                    {`\u20AC${(tier.yearlyPrice / 12).toFixed(0)}/mo billed annually`}
                  </p>
                )}
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
                ) : isFree ? (
                  "Get Started"
                ) : (
                  "Start 14-day free trial"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
