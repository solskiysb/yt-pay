"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Gavel } from "lucide-react";

import type { LucideIcon } from "lucide-react";

const tabs: { value: string; label: string; icon?: LucideIcon }[] = [
  { value: "", label: "All" },
  { value: "classified", label: "Classifieds" },
  { value: "auction", label: "Auctions", icon: Gavel },
];

export function ListingTypeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get("listingType") ?? "";

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("listingType", value);
      } else {
        params.delete("listingType");
      }
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, router, pathname]
  );

  return (
    <div className="flex gap-1 rounded-lg bg-stone-100 p-1">
      {tabs.map((tab) => {
        const isActive = current === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => handleChange(tab.value)}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab.icon && <tab.icon className="size-3.5" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
