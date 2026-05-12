"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const stats = [
  { value: "500+", label: "Cars Listed" },
  { value: "12", label: "Countries" },
  { value: "100%", label: "Verified Sellers" },
];

export function Hero() {
  const [query, setQuery] = useState("");

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80"
        alt="Classic car on a scenic road"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="bg-hero-overlay absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-medium tracking-wider text-white/90 uppercase">
              Europe&apos;s Premier Car Marketplace
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find Your Dream
            <span className="block text-gradient-gold">Classic</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
            Europe&apos;s curated marketplace for retro, classic and beautiful
            automobiles
          </p>

          {/* Search Bar */}
          <div className="mt-10 flex max-w-lg items-center gap-2 rounded-xl border border-white/15 bg-white/10 p-1.5 backdrop-blur-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
              <Input
                type="text"
                placeholder="Search make, model, or year..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 border-0 bg-transparent pl-10 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-transparent"
              />
            </div>
            <Link
              href="/cars"
              className={cn(
                buttonVariants({ size: "default" }),
                "h-10 bg-accent-gold px-5 text-white hover:bg-accent-gold-dark"
              )}
            >
              Search
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/cars"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 bg-white px-8 text-sm font-semibold text-foreground hover:bg-white/90"
              )}
            >
              Browse Collection
            </Link>
            <Link
              href="/sell"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 border-white/25 bg-transparent px-8 text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
              )}
            >
              Sell Your Car
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center px-4 py-5"
            >
              <span className="font-heading text-2xl font-bold text-white sm:text-3xl">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-medium tracking-wider text-white/60 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
