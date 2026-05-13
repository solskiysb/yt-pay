import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { dbListingToCar } from "@/lib/db";
import type { DbListing } from "@/lib/db";
import { CarCard } from "@/components/car-card";
import { BuyerAlertForm } from "@/components/buyer-alert-form";
import { siteConfig } from "@/lib/config";

interface ModelRow {
  id: string;
  make: string;
  model: string;
  generation: string | null;
  years: string | null;
  slug: string;
  priority: number;
}

interface PriceObservation {
  price: number;
  currency: string;
  year: number | null;
  country: string | null;
  observed_at: string;
}

async function getModel(slug: string): Promise<ModelRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("models")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as ModelRow;
}

async function getModelListings(make: string, model: string) {
  const supabase = await createClient();

  // Search by make and try to match model name in the listing model field
  const { data, error } = await supabase
    .from("listings")
    .select("*, listing_images(*)")
    .eq("make", make)
    .in("status", ["approved", "sold"])
    .order("created_at", { ascending: false })
    .limit(24);

  if (error || !data) return [];
  return (data as DbListing[]).map(dbListingToCar);
}

async function getPriceObservations(make: string, model: string): Promise<PriceObservation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("price_observations")
    .select("price, currency, year, country, observed_at")
    .eq("make", make)
    .eq("model", model)
    .order("observed_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data as PriceObservation[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const model = await getModel(slug);

  if (!model) {
    return { title: "Model Not Found | EraMarque" };
  }

  const title = `${model.make} ${model.model} for Sale | EraMarque`;
  const description = `Find ${model.make} ${model.model} (${model.years || "classic"}) for sale on EraMarque. Browse listings, get price guides, and set alerts for Europe's curated classic car marketplace.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/cars/models/${slug}`,
      siteName: siteConfig.name,
      type: "website",
    },
  };
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const model = await getModel(slug);

  if (!model) {
    notFound();
  }

  const [listings, priceObs] = await Promise.all([
    getModelListings(model.make, model.model),
    getPriceObservations(model.make, model.model),
  ]);

  // Compute price stats from observations
  const prices = priceObs.map((o) => o.price).filter((p) => p > 0);
  const hasMarketData = prices.length >= 3;
  const avgPrice = hasMarketData
    ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    : null;
  const minPrice = hasMarketData ? Math.min(...prices) : null;
  const maxPrice = hasMarketData ? Math.max(...prices) : null;

  // Check if there's a matching buyer guide
  const guideSlugMap: Record<string, string> = {
    "bmw-e30": "bmw-e30-m3-guide",
    "porsche-911-964": "porsche-911-buyers-guide",
    "porsche-911-993": "porsche-911-buyers-guide",
  };
  const guideSlug = guideSlugMap[slug];

  // JSON-LD CollectionPage schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${model.make} ${model.model} for Sale`,
    description: `Browse ${model.make} ${model.model} (${model.years || "classic"}) listings on EraMarque.`,
    url: `${siteConfig.url}/cars/models/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: listings.length,
      itemListElement: listings.slice(0, 10).map((car, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteConfig.url}/cars/${car.id}`,
        name: `${car.year} ${car.make} ${car.model}`,
      })),
    },
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-stone-400">
        <Link href="/cars" className="transition-colors hover:text-stone-700">
          Cars
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href={`/cars?make=${encodeURIComponent(model.make)}`}
          className="transition-colors hover:text-stone-700"
        >
          {model.make}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-stone-600">{model.model}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {model.make} {model.model} for Sale
        </h1>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-stone-500">
          {model.years && (
            <span className="rounded-full bg-stone-100 px-3 py-1 font-medium">
              {model.years}
            </span>
          )}
          {model.generation && (
            <span className="rounded-full bg-stone-100 px-3 py-1 font-medium">
              {model.generation}
            </span>
          )}
        </div>
        <p className="mt-4 max-w-2xl text-stone-600 leading-relaxed">
          Browse our curated selection of {model.make} {model.model} cars for sale
          across Europe.{" "}
          {model.years
            ? `Produced from ${model.years}, the ${model.model} is a sought-after classic.`
            : `The ${model.model} is a sought-after classic.`}
        </p>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left: Listings */}
        <div className="lg:col-span-2">
          {listings.length > 0 ? (
            <>
              <h2 className="mb-4 text-lg font-semibold text-stone-900">
                {listings.length} {listings.length === 1 ? "listing" : "listings"} available
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {listings.map((car, index) => (
                  <CarCard key={car.id} car={car} index={index} />
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href={`/cars?make=${encodeURIComponent(model.make)}`}
                  className="text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                  View all {model.make} listings
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
              <p className="text-lg font-medium text-stone-700">
                No {model.make} {model.model} listings yet
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Set an alert below and we will notify you when one becomes available.
              </p>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Buyer Alert */}
          <BuyerAlertForm make={model.make} model={model.model} />

          {/* Price Guide */}
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-stone-800">
              Price Guide
            </h3>
            {hasMarketData ? (
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Average</span>
                  <span className="font-semibold text-stone-900">
                    {formatPrice(avgPrice!)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Low</span>
                  <span className="font-medium text-stone-700">
                    {formatPrice(minPrice!)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">High</span>
                  <span className="font-medium text-stone-700">
                    {formatPrice(maxPrice!)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-stone-400">
                  Based on {prices.length} recent observations
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-stone-500">
                Market data coming soon. We are collecting price observations to
                provide accurate valuations.
              </p>
            )}
          </div>

          {/* Buyer Guide link */}
          {guideSlug && (
            <Link
              href={`/guides/${guideSlug}`}
              className="block rounded-xl border border-amber-200 bg-amber-50 p-6 transition-colors hover:bg-amber-100"
            >
              <h3 className="text-sm font-semibold text-amber-900">
                Buyer's Guide
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                Read our expert guide to buying a {model.make} {model.model}.
              </p>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
