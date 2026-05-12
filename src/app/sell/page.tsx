import { Metadata } from "next";
import Link from "next/link";
import { Camera, FileText, CreditCard, Rocket, Check } from "lucide-react";
import { siteConfig, pricingTiers } from "@/lib/config";

export const metadata: Metadata = {
  title: `Sell Your Car — ${siteConfig.name}`,
  description:
    "List your classic, retro or beautiful car on YT Pay. Reach thousands of enthusiasts across Europe.",
};

const steps = [
  {
    icon: Camera,
    step: "01",
    title: "Take Great Photos",
    description:
      "Capture your car from every angle. Natural light works best. Show the interior, engine bay, and any unique details.",
  },
  {
    icon: FileText,
    step: "02",
    title: "Write Your Story",
    description:
      "Tell buyers about your car's history, condition, and what makes it special. Honest, detailed descriptions sell faster.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Choose Your Plan",
    description:
      "Pick the tier that suits you — from a single listing to a full dealer package. Early adopter pricing available now.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Connect with Buyers",
    description:
      "Interested buyers contact you directly. Arrange viewings, test drives, and close the deal on your terms.",
  },
];

const faqs = [
  {
    q: "How long does my listing stay active?",
    a: "Depends on your plan: Starter gets 60 days, Collector 90 days, and Dealer 120 days. You can renew at a discounted rate.",
  },
  {
    q: "What kind of cars can I list?",
    a: "We focus on classic, retro, and visually distinctive cars. Think timeless design, not just age. Modern classics and youngtimers are welcome.",
  },
  {
    q: "Do you handle payment or delivery?",
    a: "No. YT Pay is a marketplace that connects buyers and sellers. All transactions happen directly between parties.",
  },
  {
    q: "Can I edit my listing after publishing?",
    a: "Yes. You can update photos, description, and price at any time. Key changes go through a quick re-review.",
  },
  {
    q: "What are early adopter prices?",
    a: "We're offering special launch pricing for our first sellers. These prices are locked in for your first purchase and won't increase for renewals.",
  },
];

export default function SellPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-stone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-4 inline-flex items-center rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800">
            Early Adopter Pricing — Limited Time
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-stone-900 lg:text-5xl">
            Sell Your Car
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            Reach thousands of passionate car enthusiasts across Europe. No
            commissions, no surprises — just transparent pricing.
          </p>
          <Link
            href="#pricing"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-amber-500 px-8 font-medium text-stone-900 transition hover:bg-amber-400"
          >
            See Plans & Pricing
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-heading text-3xl font-bold text-stone-900">
            How It Works
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <s.icon className="h-7 w-7" />
                </div>
                <div className="mt-2 text-xs font-bold uppercase tracking-widest text-amber-600">
                  Step {s.step}
                </div>
                <h3 className="mt-3 font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section id="pricing" className="bg-stone-900 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-3xl font-bold text-white">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-center text-stone-400">
            No commissions. No hidden fees. Just a one-time payment.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
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

                <Link
                  href="#"
                  className={`mt-8 flex h-11 items-center justify-center rounded-full font-medium transition ${
                    tier.popular
                      ? "bg-stone-900 text-white hover:bg-stone-800"
                      : "bg-amber-500 text-stone-900 hover:bg-amber-400"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-center font-heading text-3xl font-bold text-stone-900">
            Questions & Answers
          </h2>
          <div className="mt-12 space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-stone-900">{faq.q}</h3>
                <p className="mt-2 text-stone-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
