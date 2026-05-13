import Link from "next/link";
import type { Metadata } from "next";
import {
  Search,
  MessageSquare,
  Car,
  CheckCircle,
  Camera,
  Inbox,
  Handshake,
  Shield,
  AlertTriangle,
  MapPin,
  CreditCard,
  FileText,
  Users,
  ArrowRight,
  BadgeCheck,
  Eye,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `How It Works | ${siteConfig.name}`,
  description:
    "Learn how to buy and sell cars on EraMarque. Safety tips, buyer and seller guides, and frequently asked questions.",
};

const buyerSteps = [
  {
    icon: Search,
    step: "01",
    title: "Browse",
    description:
      "Explore our curated collection of classic and beautiful cars from across Europe. Use filters to narrow down by make, price, year, and location.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Contact the Seller",
    description:
      "Found something you like? Send the seller a message directly through our inquiry form. Ask questions, request more photos, or schedule a viewing.",
  },
  {
    icon: Car,
    step: "03",
    title: "Meet & Inspect",
    description:
      "Arrange to see the car in person. Take it for a test drive, have it inspected by a mechanic, and make sure it's everything you're looking for.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Buy",
    description:
      "Agree on a price, handle the paperwork, and complete the purchase directly with the seller. Congratulations on your new car!",
  },
];

const sellerSteps = [
  {
    icon: Camera,
    step: "01",
    title: "List Your Car",
    description:
      "Create a listing with high-quality photos, detailed specs, and an honest description. Better listings get more inquiries.",
  },
  {
    icon: Inbox,
    step: "02",
    title: "Get Inquiries",
    description:
      "Interested buyers will reach out through our platform. You'll receive their messages via email so you never miss a lead.",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Sell",
    description:
      "Meet with buyers, negotiate a fair price, and complete the sale. We never charge commissions -- what you agree on is what you keep.",
  },
];

const buyerTips = [
  {
    icon: Eye,
    title: "Always See the Car in Person",
    description:
      "Never purchase a car sight-unseen. Arrange to inspect the vehicle in person, ideally in daylight, and take it for a thorough test drive.",
  },
  {
    icon: FileText,
    title: "Verify Documentation",
    description:
      "Check the registration papers, service history, and MOT/TUV records. Make sure the VIN matches the documents and the car.",
  },
  {
    icon: CreditCard,
    title: "Use Secure Payment Methods",
    description:
      "Prefer bank transfers or escrow services over cash for large amounts. Never wire money to someone you haven't met.",
  },
  {
    icon: MapPin,
    title: "Meet in a Safe Location",
    description:
      "Arrange meetings in public, well-lit areas. Bring someone with you if possible. Trust your instincts -- if something feels off, walk away.",
  },
];

const sellerTips = [
  {
    icon: Camera,
    title: "Use High-Quality Photos",
    description:
      "Take clear, well-lit photos from every angle. Include the interior, engine bay, and any imperfections. Honesty builds trust and saves time.",
  },
  {
    icon: AlertTriangle,
    title: "Be Honest About Condition",
    description:
      "Disclose known issues upfront. Buyers appreciate transparency, and it protects you from disputes after the sale.",
  },
  {
    icon: Users,
    title: "Vet Your Buyers",
    description:
      "Be cautious of buyers who want to pay via unusual methods, won't meet in person, or pressure you to rush. Legitimate buyers understand due diligence.",
  },
  {
    icon: FileText,
    title: "Prepare the Paperwork",
    description:
      "Have all documents ready: registration, service records, and a bill of sale. A smooth paperwork process builds confidence.",
  },
];

const faqs = [
  {
    question: "Is EraMarque a dealer? Do you own the cars?",
    answer:
      "No. EraMarque is a classified marketplace. All cars are listed by independent sellers -- private individuals and dealers. We connect buyers and sellers but are not involved in the transaction itself.",
  },
  {
    question: "Does EraMarque guarantee the condition of the cars?",
    answer:
      "We review every listing for quality and completeness, but we do not independently verify the mechanical condition of each vehicle. We strongly recommend having any car inspected by a qualified mechanic before purchasing.",
  },
  {
    question: "How do payments work?",
    answer:
      "All payments happen directly between the buyer and seller. We do not process or escrow any funds. We recommend using secure, traceable payment methods such as bank transfers.",
  },
  {
    question: "Are the sellers verified?",
    answer:
      "All sellers must create an account with a verified email address. We review listings before they go live. However, we recommend doing your own due diligence before any transaction.",
  },
  {
    question: "What should I do if I suspect a fraudulent listing?",
    answer:
      "Please contact us immediately at hello@yt-pay.io. We take fraud seriously and will investigate and remove any listing that violates our terms.",
  },
  {
    question: "Can I buy a car from another country?",
    answer:
      "Yes! Our marketplace spans across Europe. For cross-border purchases, be aware of import regulations, taxes, and registration requirements in your country. We recommend researching these before committing.",
  },
  {
    question: "What does it cost to list a car?",
    answer:
      "We offer a free tier with one listing. Our Collector plan starts at just \u20ac19/month for up to 5 listings. See our pricing page for details. We never charge commissions on sales.",
  },
];

export default function HowItWorksPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            How {siteConfig.name} Works
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-500">
            We&apos;re a classified marketplace -- all transactions happen
            directly between buyers and sellers. Here&apos;s how to make the
            most of it.
          </p>
        </div>
      </section>

      {/* Buyer Guide */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-600">
              For Buyers
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
              Find Your Dream Car
            </h2>
            <p className="mt-2 text-stone-500">
              From first look to first drive in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {buyerSteps.map((item) => (
              <div key={item.step} className="relative text-center">
                <span className="text-5xl font-bold text-stone-100">
                  {item.step}
                </span>
                <div className="mt-2 flex justify-center text-amber-600">
                  <item.icon className="size-7" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-stone-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Guide */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-600">
              For Sellers
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
              Sell Your Car
            </h2>
            <p className="mt-2 text-stone-500">
              List it, get inquiries, and sell -- no commissions ever
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
            {sellerSteps.map((item) => (
              <div key={item.step} className="relative text-center">
                <span className="text-5xl font-bold text-stone-200">
                  {item.step}
                </span>
                <div className="mt-2 flex justify-center text-amber-600">
                  <item.icon className="size-7" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-stone-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Shield className="size-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              Safety Tips
            </h2>
            <p className="mt-2 text-stone-500">
              Your safety matters. Follow these guidelines for a smooth
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Buyer tips */}
            <div>
              <h3 className="mb-6 text-xl font-semibold text-stone-900">
                For Buyers
              </h3>
              <div className="space-y-5">
                {buyerTips.map((tip) => (
                  <div key={tip.title} className="flex gap-4">
                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <tip.icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-800">
                        {tip.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-stone-500">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller tips */}
            <div>
              <h3 className="mb-6 text-xl font-semibold text-stone-900">
                For Sellers
              </h3>
              <div className="space-y-5">
                {sellerTips.map((tip) => (
                  <div key={tip.title} className="flex gap-4">
                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <tip.icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-800">
                        {tip.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-stone-500">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classified disclaimer */}
      <section className="bg-stone-900 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <BadgeCheck className="mx-auto size-10 text-amber-400" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            We&apos;re a Classified Marketplace
          </h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            {siteConfig.name} connects buyers and sellers, but all transactions
            happen directly between the parties involved. We do not own, inspect,
            or guarantee any vehicles. We review listings for quality, but
            recommend buyers always do their own due diligence.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-stone-500">
              Common questions about trust, safety, and how {siteConfig.name}{" "}
              works
            </p>
          </div>

          <div className="divide-y divide-stone-200">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <h3 className="text-base font-semibold text-stone-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">
            Ready to get started?
          </h2>
          <p className="mt-2 text-stone-500">
            Browse our collection or list your own car today.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/cars"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-stone-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
            >
              Browse Cars
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/sell"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-stone-300 px-6 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              Sell Your Car
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
