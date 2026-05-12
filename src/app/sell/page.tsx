import { Metadata } from "next";
import Link from "next/link";
import { Camera, FileText, Users, Rocket, Check, Shield } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getUser } from "@/lib/auth";
// PricingCards and Stripe integration preserved — will re-enable post-beta
// import { PricingCards } from "@/components/pricing-cards";

export const metadata: Metadata = {
  title: `Sell Your Car — ${siteConfig.name}`,
  description:
    "List your classic, retro or beautiful car on YT Pay. Currently in private beta — list for free.",
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
    icon: Users,
    step: "03",
    title: "Get Approved",
    description:
      "Our team reviews your application to ensure quality. We'll get back to you within 48 hours.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Connect with Buyers",
    description:
      "Interested buyers contact you directly. Arrange viewings, test drives, and close the deal on your terms.",
  },
];

const betaFeatures = [
  "Up to 3 active listings",
  "Up to 20 photos per listing",
  "Direct buyer inquiries",
  "Zero commission on sales",
  "Priority support",
  "Seller profile page",
];

const faqs = [
  {
    q: "How do I get approved to sell?",
    a: "Click 'Apply to Sell' and fill out a brief application. We review each seller individually to maintain quality. You'll hear back within 48 hours.",
  },
  {
    q: "Is it really free during the beta?",
    a: "Yes. All beta sellers list for free with full features. When we launch paid plans, beta sellers will receive preferential pricing as a thank you.",
  },
  {
    q: "What kind of cars can I list?",
    a: "We focus on classic, retro, and visually distinctive cars. Think timeless design, not just age. Modern classics and youngtimers are welcome.",
  },
  {
    q: "How many cars can I list?",
    a: "During the beta, each seller can have up to 3 active listings with up to 20 photos each.",
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
            Private Beta — Free Listing
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-stone-900 lg:text-5xl">
            Sell Your Classic Car
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            Currently in private beta — list your car for free and reach
            thousands of passionate enthusiasts across Europe. No commissions,
            no fees, no surprises.
          </p>
          <Link
            href="#beta"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-amber-500 px-8 font-medium text-stone-900 transition hover:bg-amber-400"
          >
            Apply to Sell
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

      {/* Beta Seller Card */}
      <section id="beta" className="bg-stone-900 py-20 lg:py-28">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="text-center font-heading text-3xl font-bold text-white">
            Join the Beta
          </h2>
          <p className="mt-4 text-center text-stone-400">
            We&apos;re onboarding select sellers during our beta period.
          </p>

          <div className="mt-10 rounded-2xl border border-stone-700 bg-stone-800 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Beta Seller</h3>
                <p className="mt-1 text-sm text-stone-400">
                  Full access during launch
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-white">Free</span>
                <p className="text-xs text-amber-400 font-medium">
                  during beta
                </p>
              </div>
            </div>

            <div className="my-6 h-px bg-stone-700" />

            <ul className="space-y-3">
              {betaFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm text-stone-300"
                >
                  <Check className="h-4 w-4 flex-shrink-0 text-amber-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={user ? "/dashboard/listings/new" : "/register"}
              className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-amber-500 font-medium text-stone-900 transition hover:bg-amber-400"
            >
              Apply to Sell
            </Link>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
              <Shield className="h-3.5 w-3.5" />
              By invitation — applications reviewed within 48 hours
            </p>
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
