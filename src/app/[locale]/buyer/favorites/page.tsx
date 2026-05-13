import Link from "next/link";
import { Metadata } from "next";
import { Heart } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CarCard } from "@/components/car-card";
import { dbListingToCar } from "@/lib/db";
import type { DbListing } from "@/lib/db";

export const metadata: Metadata = {
  title: `Saved Cars — ${siteConfig.name}`,
};

export default async function BuyerFavoritesPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data } = await supabase
    .from("favorites")
    .select("listing_id, listings(*, listing_images(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const cars = (data ?? [])
    .map((fav: { listings: unknown }) => fav.listings as DbListing | null)
    .filter((l): l is DbListing => l !== null)
    .map(dbListingToCar);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-stone-900">
          Saved Cars
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Cars you have saved for later
        </p>
      </div>

      {/* Grid */}
      {cars.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white px-6 py-20 ring-1 ring-stone-200">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <Heart className="size-6 text-stone-400" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-stone-900">
            No saved cars yet
          </h3>
          <p className="mt-2 max-w-sm text-center text-sm text-stone-500">
            Browse our collection to find your dream classic. They will appear
            here so you can easily find them later.
          </p>
          <Link
            href="/cars"
            className="mt-6 inline-flex h-10 items-center rounded-full bg-amber-500 px-6 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400"
          >
            Browse Cars
          </Link>
        </div>
      )}
    </div>
  );
}
