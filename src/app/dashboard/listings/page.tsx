import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Plus, Eye, MoreHorizontal, Pencil, Archive, Tag } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Badge } from "@/components/ui/badge";

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

interface SellerListing {
  id: string;
  title: string;
  year: number;
  make: string;
  model: string;
  price: number;
  status: ListingStatus;
  views: number;
  image: string;
  createdAt: string;
}

const mockListings: SellerListing[] = [
  {
    id: "porsche-911-carrera-rs-1973",
    title: "Porsche 911 Carrera RS 2.7",
    year: 1973,
    make: "Porsche",
    model: "911 Carrera RS 2.7",
    price: 178000,
    status: "approved",
    views: 842,
    image:
      "https://images.unsplash.com/photo-1671981151707-7aa791793275?w=800&q=80",
    createdAt: "2026-04-15",
  },
  {
    id: "porsche-911-turbo-1987",
    title: "Porsche 911 Turbo (930)",
    year: 1987,
    make: "Porsche",
    model: "911 Turbo (930)",
    price: 125000,
    status: "approved",
    views: 523,
    image:
      "https://images.unsplash.com/photo-1759773826076-0d1ec3a3049e?w=800&q=80",
    createdAt: "2026-04-20",
  },
  {
    id: "mercedes-280sl-1967",
    title: "Mercedes-Benz 280 SL Pagoda",
    year: 1967,
    make: "Mercedes-Benz",
    model: "280 SL Pagoda",
    price: 145000,
    status: "pending_review",
    views: 0,
    image:
      "https://images.unsplash.com/photo-1671981151707-7aa791793275?w=800&q=80",
    createdAt: "2026-05-08",
  },
  {
    id: "bmw-2002-turbo-1974",
    title: "BMW 2002 Turbo",
    year: 1974,
    make: "BMW",
    model: "2002 Turbo",
    price: 92000,
    status: "draft",
    views: 0,
    image:
      "https://images.unsplash.com/photo-1759773826076-0d1ec3a3049e?w=800&q=80",
    createdAt: "2026-05-10",
  },
  {
    id: "jaguar-e-type-1963",
    title: "Jaguar E-Type Series 1",
    year: 1963,
    make: "Jaguar",
    model: "E-Type Series 1",
    price: 210000,
    status: "sold",
    views: 1204,
    image:
      "https://images.unsplash.com/photo-1671981151707-7aa791793275?w=800&q=80",
    createdAt: "2026-03-01",
  },
];

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

export default function ListingsPage() {
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

      {/* Listings table */}
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
              {mockListings.map((listing) => {
                const status = statusConfig[listing.status];
                return (
                  <tr
                    key={listing.id}
                    className="transition-colors hover:bg-stone-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                          <Image
                            src={listing.image}
                            alt={listing.title}
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
                        {listing.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-stone-500">
                      {formatDate(listing.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
                          title="Edit"
                        >
                          <Pencil className="size-3.5" />
                        </button>
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
          {mockListings.map((listing) => {
            const status = statusConfig[listing.status];
            return (
              <div key={listing.id} className="flex gap-3 p-4">
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  <Image
                    src={listing.image}
                    alt={listing.title}
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
                      {listing.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
