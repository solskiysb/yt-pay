import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen, TrendingUp, Car } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Buying Guides & Market Insights | ${siteConfig.name}`,
  description:
    "Expert buying guides, model histories, and market insights for classic and collectible cars. Everything you need to make informed decisions.",
};

type GuideCategory = "Buying Guides" | "Model Guides" | "Market Insights";

interface Guide {
  title: string;
  excerpt: string;
  href: string;
  readTime: string;
  category: GuideCategory;
  image: string;
}

const guides: Guide[] = [
  {
    title: "Buying Your First Classic Car",
    excerpt:
      "Everything you need to know before purchasing your first classic -- from setting a budget to negotiating the deal and avoiding costly mistakes.",
    href: "/guides/buying-your-first-classic",
    readTime: "12 min read",
    category: "Buying Guides",
    image: "/images/guides/first-classic.jpg",
  },
  {
    title: "The Porsche 911 Buyer's Guide",
    excerpt:
      "Every generation explained, from the original 901 to the water-cooled 997. Price ranges, common issues, and which models offer the best value today.",
    href: "/guides/porsche-911-buyers-guide",
    readTime: "15 min read",
    category: "Model Guides",
    image: "/images/guides/porsche-911.jpg",
  },
  {
    title: "BMW E30 M3 Buyer's Guide",
    excerpt:
      "The homologation special that became a legend. Variants, what to look for, price trends, and maintenance tips for BMW's iconic sport sedan.",
    href: "/guides/bmw-e30-m3-guide",
    readTime: "10 min read",
    category: "Model Guides",
    image: "/images/guides/bmw-e30-m3.jpg",
  },
  {
    title: "Classic Car Market Trends 2026",
    excerpt:
      "Where the market is heading this year -- rising stars, best value segments, and the youngtimers poised for significant appreciation.",
    href: "/guides/market-trends-2026",
    readTime: "8 min read",
    category: "Market Insights",
    image: "/images/guides/market-trends.jpg",
  },
];

const categoryIcons: Record<GuideCategory, typeof BookOpen> = {
  "Buying Guides": BookOpen,
  "Model Guides": Car,
  "Market Insights": TrendingUp,
};

const categories: GuideCategory[] = [
  "Buying Guides",
  "Model Guides",
  "Market Insights",
];

export default function GuidesIndexPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Buying Guides & Market Insights
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-500">
            Expert knowledge to help you buy, sell, and understand classic
            cars. Written by enthusiasts, backed by market data.
          </p>
        </div>
      </section>

      {/* Category Nav */}
      <section className="border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto py-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              return (
                <button
                  key={cat}
                  className="flex shrink-0 items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
                >
                  <Icon className="size-4" />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {guides.map((guide) => {
              const Icon = categoryIcons[guide.category];
              return (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="group rounded-2xl border border-stone-200 bg-white transition-all hover:border-stone-300 hover:shadow-md"
                >
                  {/* Image placeholder */}
                  <div className="aspect-[16/9] rounded-t-2xl bg-stone-100 flex items-center justify-center">
                    <Car className="size-12 text-stone-300" />
                  </div>

                  <div className="p-6">
                    {/* Category + Read time */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
                        <Icon className="size-3" />
                        {guide.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-stone-400">
                        <Clock className="size-3" />
                        {guide.readTime}
                      </span>
                    </div>

                    <h2 className="mt-3 font-heading text-xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                      {guide.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-stone-500">
                      {guide.excerpt}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-600 group-hover:text-amber-700">
                      Read guide
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Ready to Find Your Classic?
          </h2>
          <p className="mt-4 text-stone-400">
            Put your knowledge to work. Browse our curated collection of classic
            and beautiful cars from across Europe.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/cars"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-amber-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-amber-400"
            >
              Browse Cars
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/sell"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-stone-700 px-6 text-sm font-medium text-stone-300 transition-colors hover:border-stone-600 hover:text-white"
            >
              Sell Your Car
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
