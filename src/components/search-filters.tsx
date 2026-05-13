"use client";

import { useCallback, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const selectClassName =
  "flex h-8 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const CONDITIONS = ["Excellent", "Good", "Fair"] as const;

const BODY_TYPES = [
  "Coupe",
  "Sedan",
  "Convertible",
  "SUV",
  "Wagon",
  "Hatchback",
] as const;

const SORT_OPTIONS = [
  { value: "", label: "Newest" },
  { value: "price_asc", label: "Price Low\u2192High" },
  { value: "price_desc", label: "Price High\u2192Low" },
  { value: "year_desc", label: "Year New\u2192Old" },
  { value: "year_asc", label: "Year Old\u2192New" },
  { value: "views", label: "Most Viewed" },
] as const;

export function SearchFilters({
  makes,
  bodyTypes,
}: {
  makes: string[];
  bodyTypes: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentSearch = searchParams.get("search") ?? "";
  const currentMake = searchParams.get("make") ?? "";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const currentMinYear = searchParams.get("minYear") ?? "";
  const currentMaxYear = searchParams.get("maxYear") ?? "";
  const currentCondition = searchParams.get("condition") ?? "";
  const currentBodyType = searchParams.get("bodyType") ?? "";
  const currentSortBy = searchParams.get("sortBy") ?? "";
  const hideSold = searchParams.get("hideSold") === "1";

  const hasFilters =
    currentSearch ||
    currentMake ||
    currentMinPrice ||
    currentMaxPrice ||
    currentMinYear ||
    currentMaxYear ||
    currentCondition ||
    currentBodyType ||
    currentSortBy ||
    hideSold;

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 when filters change
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, router, pathname]
  );

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  // Merge static body types with DB body types (unique, sorted)
  const allBodyTypes = [
    ...new Set([
      ...BODY_TYPES,
      ...bodyTypes,
    ]),
  ].sort();

  return (
    <div className="space-y-4">
      {/* Top row: search + sort + mobile toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search cars..."
            defaultValue={currentSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              updateParam("search", val);
            }}
            className="pl-8"
          />
        </div>

        {/* Sort - always visible */}
        <div className="hidden sm:block sm:w-48">
          <select
            value={currentSortBy}
            onChange={(e) => updateParam("sortBy", e.target.value)}
            className={selectClassName}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile filters toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="lg:hidden flex items-center gap-1.5"
        >
          <SlidersHorizontal className="size-4" />
          Filters
          <ChevronDown
            className={`size-3.5 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      {/* Mobile sort (visible only on small screens) */}
      <div className="sm:hidden">
        <select
          value={currentSortBy}
          onChange={(e) => updateParam("sortBy", e.target.value)}
          className={selectClassName}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Collapsible filter section: always visible on lg+, toggle on mobile */}
      <div
        className={`space-y-3 ${filtersOpen ? "block" : "hidden"} lg:block`}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Make */}
          <div>
            <select
              value={currentMake}
              onChange={(e) => updateParam("make", e.target.value)}
              className={selectClassName}
            >
              <option value="">All Makes</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <select
              value={currentCondition}
              onChange={(e) => updateParam("condition", e.target.value)}
              className={selectClassName}
            >
              <option value="">All Conditions</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Body Type */}
          <div>
            <select
              value={currentBodyType}
              onChange={(e) => updateParam("bodyType", e.target.value)}
              className={selectClassName}
            >
              <option value="">All Body Types</option>
              {allBodyTypes.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min price"
              defaultValue={currentMinPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateParam("minPrice", e.target.value)
              }
            />
            <span className="text-stone-400">&ndash;</span>
            <Input
              type="number"
              placeholder="Max price"
              defaultValue={currentMaxPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateParam("maxPrice", e.target.value)
              }
            />
          </div>
        </div>

        {/* Year range row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="From year"
              defaultValue={currentMinYear}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateParam("minYear", e.target.value)
              }
            />
            <span className="text-stone-400">&ndash;</span>
            <Input
              type="number"
              placeholder="To year"
              defaultValue={currentMaxYear}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateParam("maxYear", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Bottom row: hide sold + clear */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hideSold}
            onChange={(e) =>
              updateParam("hideSold", e.target.checked ? "1" : "")
            }
            className="size-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          Hide sold cars
        </label>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X className="size-3.5" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
