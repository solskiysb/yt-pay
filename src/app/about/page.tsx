import { Metadata } from "next";
import Link from "next/link";
import { Car, Shield, Globe, Heart } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `About — ${siteConfig.name}`,
  description: "Learn about YT Pay — Europe's curated marketplace for retro, classic and beautiful automobiles.",
};

const values = [
  {
    icon: Car,
    title: "Curated Selection",
    description:
      "Every listing is reviewed to ensure quality. We focus on cars with character — from pristine restorations to well-loved daily classics.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "Detailed histories, honest descriptions, and real photos. We believe the best deals start with honest information.",
  },
  {
    icon: Globe,
    title: "Pan-European Reach",
    description:
      "Connect with sellers and buyers across Europe. From Stockholm to Barcelona, find your dream car wherever it may be.",
  },
  {
    icon: Heart,
    title: "For Enthusiasts, By Enthusiasts",
    description:
      "Built by car lovers who understand the joy of owning something special. This isn't just a marketplace — it's a community.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-stone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-stone-900 lg:text-5xl">
            The Home for Beautiful Cars
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            {siteConfig.name} was born from a simple idea: classic and beautiful cars
            deserve a marketplace that matches their elegance. No cluttered
            interfaces, no mass-market noise — just curated automotive excellence.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-3xl font-bold text-stone-900">
            What We Stand For
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <v.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">{v.title}</h3>
                  <p className="mt-2 text-stone-600 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">
            Ready to Find Your Next Classic?
          </h2>
          <p className="mt-4 text-stone-400">
            Browse our curated collection or list your own car for just
            &euro;{siteConfig.listingPrice}.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/cars"
              className="inline-flex h-12 items-center rounded-full bg-amber-500 px-8 font-medium text-stone-900 transition hover:bg-amber-400"
            >
              Browse Cars
            </Link>
            <Link
              href="/sell"
              className="inline-flex h-12 items-center rounded-full border border-stone-600 px-8 font-medium text-white transition hover:border-stone-400"
            >
              Sell Your Car
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
