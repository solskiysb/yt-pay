"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCarMakes } from "@/lib/data";

export function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const makes = getCarMakes();

  const currentSearch = searchParams.get("search") ?? "";
  const currentMake = searchParams.get("make") ?? "";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const currentMinYear = searchParams.get("minYear") ?? "";
  const currentMaxYear = searchParams.get("maxYear") ?? "";

  const hasFilters =
    currentSearch ||
    currentMake ||
    currentMinPrice ||
    currentMaxPrice ||
    currentMinYear ||
    currentMaxYear;

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, router, pathname]
  );

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search cars..."
            defaultValue={currentSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              // Debounce-like: update on every keystroke for simplicity
              updateParam("search", val);
            }}
            className="pl-8"
          />
        </div>

        {/* Make */}
        <div>
          <select
            value={currentMake}
            onChange={(e) => updateParam("make", e.target.value)}
            className="flex h-8 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">All Makes</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
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

        {/* Year Range */}
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

      {hasFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X className="size-3.5" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
