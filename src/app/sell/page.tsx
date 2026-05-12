import { Metadata } from "next";
import Link from "next/link";
import { Camera, FileText, CreditCard, Rocket } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getUser } from "@/lib/auth";
import { PricingCards } from "@/components/pricing-cards";

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
      "Start free with one listing, or subscribe for more. All paid plans include a 14-day free trial.",
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
    q: "Is there really a free plan?",
    a: "Yes. The Free plan lets you list one car at no cost, with no time limit. Upgrade anytime if you need more listings.",
  },
  {
    q: "How does the 14-day free trial work?",
    a: "When you choose a paid plan (Collector or Dealer), you get 14 days free. You won't be charged until the trial ends, and you can cancel anytime before that.",
  },
  {
    q: "Can I switch plans or cancel?",
    a: "Absolutely. Upgrade, downgrade, or cancel anytime from your billing dashboard. Changes take effect at the next billing cycle.",
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
];

export default async function SellPage() {
  const user = await getUser();
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-stone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-4 inline-flex items-center rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800">
            Start Free — Upgrade Anytime
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-stone-900 lg:text-5xl">
            Sell Your Car
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            Reach thousands of passionate car enthusiasts across Europe. No
            commissions, no surprises — just transparent subscription pricing.
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
            No commissions. No hidden fees. Cancel anytime.
          </p>

          <PricingCards isLoggedIn={!!user} />
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
