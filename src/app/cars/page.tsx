import { Suspense } from "react";
import { filterCars } from "@/lib/data";
import { CarCard } from "@/components/car-card";
import { SearchFilters } from "@/components/search-filters";

export const metadata = {
  title: "Browse Collection | YT Pay",
  description:
    "Browse our curated collection of retro, classic and beautiful automobiles across Europe.",
};

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const make = typeof params.make === "string" ? params.make : undefined;
  const minPrice =
    typeof params.minPrice === "string" ? Number(params.minPrice) : undefined;
  const maxPrice =
    typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;
  const minYear =
    typeof params.minYear === "string" ? Number(params.minYear) : undefined;
  const maxYear =
    typeof params.maxYear === "string" ? Number(params.maxYear) : undefined;
  const search =
    typeof params.search === "string" ? params.search : undefined;
  const hideSold = params.hideSold === "1";

  const filteredCars = filterCars({
    make,
    minPrice: minPrice && !isNaN(minPrice) ? minPrice : undefined,
    maxPrice: maxPrice && !isNaN(maxPrice) ? maxPrice : undefined,
    minYear: minYear && !isNaN(minYear) ? minYear : undefined,
    maxYear: maxYear && !isNaN(maxYear) ? maxYear : undefined,
    search,
    hideSold,
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Browse Collection
        </h1>
        <p className="mt-2 text-stone-500">
          Showing {filteredCars.length}{" "}
          {filteredCars.length === 1 ? "car" : "cars"}
        </p>
      </div>

      <div className="mb-8">
        <Suspense fallback={<div className="h-10" />}>
          <SearchFilters />
        </Suspense>
      </div>

      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-stone-700">No cars found</p>
          <p className="mt-1 text-sm text-stone-500">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </main>
  );
}
