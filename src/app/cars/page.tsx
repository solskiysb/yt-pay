import { Suspense } from "react";
import Link from "next/link";
import { getListings, getListingMakes, getListingBodyTypes } from "@/lib/db";
import { CarCard } from "@/components/car-card";
import { SearchFilters } from "@/components/search-filters";

const ITEMS_PER_PAGE = 24;

export const metadata = {
  title: "Browse Collection | EraMarque",
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
  const condition =
    typeof params.condition === "string" ? params.condition : undefined;
  const bodyType =
    typeof params.bodyType === "string" ? params.bodyType : undefined;
  const sortBy =
    typeof params.sortBy === "string" ? params.sortBy : undefined;
  const hideSold = params.hideSold === "1";
  const currentPage = Math.max(
    1,
    typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1
  );

  const [{ cars: filteredCars, totalCount }, makes, bodyTypes] =
    await Promise.all([
      getListings({
        make,
        minPrice: minPrice && !isNaN(minPrice) ? minPrice : undefined,
        maxPrice: maxPrice && !isNaN(maxPrice) ? maxPrice : undefined,
        minYear: minYear && !isNaN(minYear) ? minYear : undefined,
        maxYear: maxYear && !isNaN(maxYear) ? maxYear : undefined,
        search,
        condition,
        bodyType,
        sortBy,
        hideSold,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
      getListingMakes(),
      getListingBodyTypes(),
    ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  // Build URL preserving current filters
  function buildPageUrl(page: number): string {
    const p = new URLSearchParams();
    if (make) p.set("make", make);
    if (condition) p.set("condition", condition);
    if (bodyType) p.set("bodyType", bodyType);
    if (sortBy) p.set("sortBy", sortBy);
    if (minPrice !== undefined && !isNaN(minPrice)) p.set("minPrice", String(minPrice));
    if (maxPrice !== undefined && !isNaN(maxPrice)) p.set("maxPrice", String(maxPrice));
    if (minYear !== undefined && !isNaN(minYear)) p.set("minYear", String(minYear));
    if (maxYear !== undefined && !isNaN(maxYear)) p.set("maxYear", String(maxYear));
    if (search) p.set("search", search);
    if (hideSold) p.set("hideSold", "1");
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    return `/cars${qs ? `?${qs}` : ""}`;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Browse Collection
        </h1>
        <p className="mt-2 text-stone-500">
          Showing {filteredCars.length} of {totalCount}{" "}
          {totalCount === 1 ? "car" : "cars"}
        </p>
      </div>

      <div className="mb-8">
        <Suspense fallback={<div className="h-10" />}>
          <SearchFilters makes={makes} bodyTypes={bodyTypes} />
        </Suspense>
      </div>

      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="mt-12 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          {currentPage > 1 ? (
            <Link
              href={buildPageUrl(currentPage - 1)}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-400 cursor-not-allowed">
              Previous
            </span>
          )}

          <span className="px-4 py-2 text-sm text-stone-600">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={buildPageUrl(currentPage + 1)}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-400 cursor-not-allowed">
              Next
            </span>
          )}
        </nav>
      )}
    </main>
  );
}
