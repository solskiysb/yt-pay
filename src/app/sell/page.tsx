import { Metadata } from "next";
import Link from "next/link";
import { Camera, FileText, CreditCard, Rocket } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Sell Your Car — ${siteConfig.name}`,
  description: "List your classic, retro or beautiful car on YT Pay. Reach thousands of enthusiasts across Europe for just €49.",
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
    title: "Pay & Publish",
    description: `A one-time fee of €${siteConfig.listingPrice} gets your car featured on our platform for 60 days. No commissions, no hidden fees.`,
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
    q: "How much does it cost to list?",
    a: `A flat fee of €${siteConfig.listingPrice} per listing. No commissions on the sale, no recurring charges.`,
  },
  {
    q: "How long does my listing stay active?",
    a: "Listings are active for 60 days. You can renew at a discounted rate if your car hasn't sold.",
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
    a: "Yes. You can update photos, description, and price at any time from your account.",
  },
];

export default function SellPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-stone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-stone-900 lg:text-5xl">
            Sell Your Car
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            Reach thousands of passionate car enthusiasts across Europe.
            List your classic for just &euro;{siteConfig.listingPrice} — no
            commissions, no surprises.
          </p>
          <Link
            href="#"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-amber-500 px-8 font-medium text-stone-900 transition hover:bg-amber-400"
          >
            Create Listing
          </Link>
          <p className="mt-3 text-sm text-stone-500">
            Account required. Sign up takes 30 seconds.
          </p>
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

      {/* Pricing */}
      <section className="bg-stone-900 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">
            Simple, Transparent Pricing
          </h2>
          <div className="mt-10 rounded-2xl bg-stone-800 p-8">
            <div className="text-5xl font-bold text-amber-400">
              &euro;{siteConfig.listingPrice}
            </div>
            <div className="mt-2 text-stone-400">per listing</div>
            <ul className="mt-6 space-y-3 text-left text-stone-300">
              <li className="flex items-center gap-3">
                <span className="text-amber-400">&#10003;</span> 60 days active listing
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400">&#10003;</span> Up to 20 high-quality photos
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400">&#10003;</span> Direct buyer inquiries to your email
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400">&#10003;</span> No commission on sale
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400">&#10003;</span> Edit listing anytime
              </li>
            </ul>
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
