import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Globe,
  Sparkles,
  Search,
  MessageSquare,
  Car,
  CheckCircle,
  BadgeCheck,
  Users,
  Lock,
} from "lucide-react";
import { Hero } from "@/components/hero";
import { CarCard } from "@/components/car-card";
import { getFeaturedListings, getAuctionListings } from "@/lib/db";
import { siteConfig } from "@/lib/config";
import { Gavel } from "lucide-react";

const valueProps = [
  {
    icon: Sparkles,
    title: "Curated Selection",
    description:
      "Every listing is hand-picked for quality and authenticity. No junk, no fakes -- only cars worth your time.",
  },
  {
    icon: Shield,
    title: "Verified Sellers",
    description:
      "All sellers are vetted and verified. Buy with confidence knowing every listing comes from a trusted source.",
  },
  {
    icon: Globe,
    title: "Pan-European",
    description:
      "Find your dream car anywhere in Europe. From London to Milan, Munich to Paris -- one marketplace for the continent.",
  },
];

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse",
    description: "Explore our curated collection of classic and beautiful cars.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Contact",
    description: "Reach out directly to the seller to ask questions and negotiate.",
  },
  {
    icon: Car,
    step: "03",
    title: "Meet & Drive",
    description:
      "Arrange to see the car in person. Test drive it, inspect it, fall in love.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Done",
    description: "Complete the purchase and drive away in your dream car.",
  },
];

export default async function HomePage() {
  const [featuredCars, auctionCars] = await Promise.all([
    getFeaturedListings(),
    getAuctionListings(6),
  ]);

  return (
    <main>
      {/* Hero */}
      <Hero />

      {/* Live Auctions */}
      {auctionCars.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Gavel className="size-4" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-stone-900">
                  Live Auctions
                </h2>
              </div>
              <p className="mt-2 text-stone-500">
                Bid on curated classics ending soon
              </p>
            </div>
            <Link
              href="/cars?listingType=auction"
              className="hidden items-center gap-1 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 sm:flex"
            >
              View All Auctions
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {auctionCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              href="/cars?listingType=auction"
              className="inline-flex items-center gap-1 text-sm font-medium text-stone-600"
            >
              View All Auctions
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Featured Collection */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              Featured Collection
            </h2>
            <p className="mt-2 text-stone-500">
              Hand-picked automobiles from across Europe
            </p>
          </div>
          <Link
            href="/cars"
            className="hidden items-center gap-1 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 sm:flex"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/cars"
            className="inline-flex items-center gap-1 text-sm font-medium text-stone-600"
          >
            View all cars
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Why EraMarque */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              Why {siteConfig.name}?
            </h2>
            <p className="mt-2 text-stone-500">
              The trusted way to buy and sell classic cars in Europe
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {valueProps.map((prop) => (
              <div key={prop.title} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <prop.icon className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">
                  {prop.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              How It Works
            </h2>
            <p className="mt-2 text-stone-500">
              From first look to first drive in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div key={item.step} className="relative text-center">
                <span className="text-5xl font-bold text-stone-100">
                  {item.step}
                </span>
                <div className="mt-2 flex justify-center text-stone-600">
                  <item.icon className="size-6" />
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

      {/* Trust & Safety */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              Trust & Safety
            </h2>
            <p className="mt-2 text-stone-500">
              Built for peace of mind at every step
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <BadgeCheck className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-stone-900">
                Curated Listings
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                Every listing is reviewed for quality and authenticity before it
                goes live. We keep the standard high so you don&apos;t waste
                your time.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Users className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-stone-900">
                Direct Contact
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                No middlemen, no hidden layers. You communicate and transact
                directly with the seller -- transparent and straightforward.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Globe className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-stone-900">
                Pan-European
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                One marketplace across 12+ countries. Find cars in Germany,
                France, Italy, Spain, and beyond -- all in one place.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
            >
              Learn more about how it works
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* From the Journal */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900">
                From the Journal
              </h2>
              <p className="mt-2 text-stone-500">
                Buying guides, model histories, and market insights
              </p>
            </div>
            <Link
              href="/guides"
              className="hidden items-center gap-1 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 sm:flex"
            >
              All guides
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Link
              href="/guides/buying-your-first-classic"
              className="group rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:border-stone-300 hover:shadow-md"
            >
              <span className="text-xs font-medium text-amber-600">
                Buying Guide
              </span>
              <h3 className="mt-2 font-heading text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                Buying Your First Classic Car
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                Everything you need to know -- budgets, inspections,
                negotiation tips, and common mistakes to avoid.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-600">
                Read guide
                <ArrowRight className="size-3.5" />
              </span>
            </Link>

            <Link
              href="/guides/porsche-911-buyers-guide"
              className="group rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:border-stone-300 hover:shadow-md"
            >
              <span className="text-xs font-medium text-amber-600">
                Model Guide
              </span>
              <h3 className="mt-2 font-heading text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                The Porsche 911 Buyer&apos;s Guide
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                Every generation explained -- from the original 901 to the 997.
                Price ranges, common issues, and best buys.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-600">
                Read guide
                <ArrowRight className="size-3.5" />
              </span>
            </Link>

            <Link
              href="/guides/market-trends-2026"
              className="group rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:border-stone-300 hover:shadow-md"
            >
              <span className="text-xs font-medium text-amber-600">
                Market Insights
              </span>
              <h3 className="mt-2 font-heading text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                Classic Car Market Trends 2026
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                Rising stars, best value segments, and youngtimers poised for
                significant appreciation this year.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-600">
                Read guide
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          </div>

          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1 text-sm font-medium text-stone-600"
            >
              All guides
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 py-20">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            List Your Classic
          </h2>
          <p className="mt-4 text-lg text-stone-400 leading-relaxed">
            Reach thousands of passionate car enthusiasts across Europe.
            Listings start at just{" "}
            <span className="font-semibold text-amber-400">
              &euro;19
            </span>
            {" "}for early adopters.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/sell"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-amber-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-amber-400"
            >
              Start Listing
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/cars"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-stone-700 px-6 text-sm font-medium text-stone-300 transition-colors hover:border-stone-600 hover:text-white"
            >
              Browse Cars First
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
