import { Metadata } from "next";
import { Heart } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { CarCard } from "@/components/car-card";
import { getFeaturedCars } from "@/lib/data";

export const metadata: Metadata = {
  title: `Favorites — ${siteConfig.name}`,
};

export default function FavoritesPage() {
  const favorites = getFeaturedCars();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-stone-900">
          Favorites
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Cars you have saved for later
        </p>
      </div>

      {/* Grid */}
      {favorites.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white px-6 py-20 ring-1 ring-stone-200">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <Heart className="size-6 text-stone-400" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-stone-900">
            No favorites yet
          </h3>
          <p className="mt-2 max-w-sm text-center text-sm text-stone-500">
            Browse our collection and save cars you love. They will appear here
            so you can easily find them later.
          </p>
          <a
            href="/cars"
            className="mt-6 inline-flex h-10 items-center rounded-full bg-amber-500 px-6 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400"
          >
            Browse Cars
          </a>
        </div>
      )}
    </div>
  );
}
