import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Plus, Eye, Pencil, Archive, Tag } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { getSellerListings, type DbListing } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `My Listings — ${siteConfig.name}`,
};

const statusConfig = {
  draft: { label: "Draft", className: "bg-stone-100 text-stone-600" },
  pending_payment: {
    label: "Pending Payment",
    className: "bg-yellow-100 text-yellow-700",
  },
  pending_review: {
    label: "Pending Review",
    className: "bg-blue-100 text-blue-700",
  },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  sold: { label: "Sold", className: "bg-purple-100 text-purple-700" },
  archived: { label: "Archived", className: "bg-stone-100 text-stone-500" },
} as const;

type ListingStatus = keyof typeof statusConfig;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function getListingImage(listing: DbListing): string {
  const primary = listing.listing_images?.find((img) => img.is_primary);
  if (primary) return primary.url;
  const sorted = [...(listing.listing_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  return sorted[0]?.url ?? "https://placehold.co/800x600?text=No+Photo";
}

export default async function ListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const listings = await getSellerListings(user.id);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-stone-900">
            My Listings
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Manage your car listings
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400"
        >
          <Plus className="size-4" />
          Create Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white px-6 py-20 ring-1 ring-stone-200">
          <h3 className="font-heading text-lg font-semibold text-stone-900">
            No listings yet
          </h3>
          <p className="mt-2 max-w-sm text-center text-sm text-stone-500">
            Create your first listing to start selling your car on {siteConfig.name}.
          </p>
          <Link
            href="/dashboard/listings/new"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-amber-500 px-6 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400"
          >
            <Plus className="size-4" />
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-stone-200">
          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-400">
                  <th className="px-5 py-3">Car</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Views</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {listings.map((listing) => {
                  const status =
                    statusConfig[listing.status as ListingStatus] ??
                    statusConfig.draft;
                  return (
                    <tr
                      key={listing.id}
                      className="transition-colors hover:bg-stone-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                            <Image
                              src={getListingImage(listing)}
                              alt={`${listing.year} ${listing.make} ${listing.model}`}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-stone-900">
                              {listing.year} {listing.make} {listing.model}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-stone-900">
                        {formatPrice(listing.price)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-sm text-stone-500">
                          <Eye className="size-3.5" />
                          {listing.views_count.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-stone-500">
                        {formatDate(listing.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/dashboard/listings/${listing.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
                            title="Edit"
                          >
                            <Pencil className="size-3.5" />
                          </Link>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
                            title="Archive"
                          >
                            <Archive className="size-3.5" />
                          </button>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
                            title="Mark as Sold"
                          >
                            <Tag className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-stone-100 md:hidden">
            {listings.map((listing) => {
              const status =
                statusConfig[listing.status as ListingStatus] ??
                statusConfig.draft;
              return (
                <Link
                  key={listing.id}
                  href={`/dashboard/listings/${listing.id}/edit`}
                  className="flex gap-3 p-4"
                >
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    <Image
                      src={getListingImage(listing)}
                      alt={`${listing.year} ${listing.make} ${listing.model}`}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-stone-900">
                      {listing.year} {listing.make} {listing.model}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-stone-700">
                      {formatPrice(listing.price)}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <Eye className="size-3" />
                        {listing.views_count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
