"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, StarOff, Eye } from "lucide-react";

type ListingStatus = "active" | "sold" | "draft" | "pending_review" | "rejected";

interface AdminListing {
  id: string;
  title: string;
  image: string;
  seller: string;
  price: number;
  status: ListingStatus;
  featured: boolean;
  views: number;
  createdAt: string;
}

const mockListings: AdminListing[] = [
  {
    id: "porsche-911-carrera-rs-1973",
    title: "1973 Porsche 911 Carrera RS 2.7",
    image: "https://images.unsplash.com/photo-1671981151707-7aa791793275?w=200&q=60",
    seller: "Klassik Automobil Stuttgart",
    price: 178000,
    status: "active",
    featured: true,
    views: 1842,
    createdAt: "2026-04-15",
  },
  {
    id: "porsche-911-turbo-1987",
    title: "1987 Porsche 911 Turbo (930)",
    image: "https://images.unsplash.com/photo-1759773826076-0d1ec3a3049e?w=200&q=60",
    seller: "Prestige Motors AG",
    price: 125000,
    status: "active",
    featured: true,
    views: 1203,
    createdAt: "2026-04-15",
  },
  {
    id: "alfa-romeo-spider-1967",
    title: "1967 Alfa Romeo Spider 1600 Duetto",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "Rosso Corsa Classics",
    price: 68000,
    status: "active",
    featured: false,
    views: 567,
    createdAt: "2026-04-18",
  },
  {
    id: "jaguar-etype-1961",
    title: "1961 Jaguar E-Type Series 1 Roadster",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200&q=60",
    seller: "British Heritage Motors",
    price: 245000,
    status: "active",
    featured: true,
    views: 2104,
    createdAt: "2026-04-20",
  },
  {
    id: "mercedes-300sl-1989",
    title: "1989 Mercedes-Benz 300 SL",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&q=60",
    seller: "Hamburg Classics GmbH",
    price: 89500,
    status: "active",
    featured: false,
    views: 423,
    createdAt: "2026-04-22",
  },
  {
    id: "mercedes-300sl-gullwing-1955",
    title: "1955 Mercedes-Benz 300 SL Gullwing",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&q=60",
    seller: "Concours Collection",
    price: 1350000,
    status: "active",
    featured: true,
    views: 5890,
    createdAt: "2026-04-25",
  },
  {
    id: "bmw-m3-2019",
    title: "2019 BMW M3 Competition",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&q=60",
    seller: "Quick Flip Motors",
    price: 52000,
    status: "rejected",
    featured: false,
    views: 12,
    createdAt: "2026-04-28",
  },
  {
    id: "datsun-240z-1970",
    title: "1970 Datsun 240Z",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "JDM Legends EU",
    price: 48000,
    status: "pending_review",
    featured: false,
    views: 0,
    createdAt: "2026-05-01",
  },
  {
    id: "toyota-ae86-1985",
    title: "1985 Toyota AE86 Sprinter Trueno",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "Drift Heritage",
    price: 34000,
    status: "pending_review",
    featured: false,
    views: 0,
    createdAt: "2026-05-02",
  },
  {
    id: "bmw-2002tii-1972",
    title: "1972 BMW 2002 tii",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&q=60",
    seller: "Classic Garage Wien",
    price: 42000,
    status: "active",
    featured: false,
    views: 318,
    createdAt: "2026-05-03",
  },
  {
    id: "volvo-p1800s-1967",
    title: "1967 Volvo P1800S",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "Scandinavian Classics AB",
    price: 54000,
    status: "active",
    featured: false,
    views: 289,
    createdAt: "2026-05-03",
  },
  {
    id: "seat-600-1969",
    title: "1969 SEAT 600",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "Retroautos Madrid",
    price: 12000,
    status: "sold",
    featured: false,
    views: 445,
    createdAt: "2026-05-04",
  },
  {
    id: "porsche-356sc-1965",
    title: "1965 Porsche 356 SC",
    image: "https://images.unsplash.com/photo-1671981151707-7aa791793275?w=200&q=60",
    seller: "Anna Schneider",
    price: 135000,
    status: "active",
    featured: false,
    views: 672,
    createdAt: "2026-05-04",
  },
  {
    id: "fiat-500-1970",
    title: "1970 Fiat 500 L",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "Marco Bianchi",
    price: 18000,
    status: "draft",
    featured: false,
    views: 0,
    createdAt: "2026-05-05",
  },
  {
    id: "citroen-ds-1974",
    title: "1974 Citroen DS 23 Pallas",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "Atelier Citroen Paris",
    price: 62000,
    status: "active",
    featured: false,
    views: 401,
    createdAt: "2026-05-06",
  },
  {
    id: "lancia-fulvia-1972",
    title: "1972 Lancia Fulvia 1.6 HF",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "Rosso Corsa Classics",
    price: 45000,
    status: "active",
    featured: false,
    views: 198,
    createdAt: "2026-05-07",
  },
  {
    id: "aston-martin-db5-1964",
    title: "1964 Aston Martin DB5",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200&q=60",
    seller: "British Heritage Motors",
    price: 890000,
    status: "active",
    featured: true,
    views: 4231,
    createdAt: "2026-05-08",
  },
  {
    id: "ferrari-308-1978",
    title: "1978 Ferrari 308 GTS",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "Concours Collection",
    price: 78000,
    status: "pending_review",
    featured: false,
    views: 0,
    createdAt: "2026-05-09",
  },
  {
    id: "vw-beetle-1967",
    title: "1967 Volkswagen Beetle 1500",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "Classic Garage Wien",
    price: 22000,
    status: "active",
    featured: false,
    views: 156,
    createdAt: "2026-05-10",
  },
  {
    id: "bmw-e30-m3-1990",
    title: "1990 BMW E30 M3 Sport Evolution",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&q=60",
    seller: "Munich Motorsport",
    price: 185000,
    status: "pending_review",
    featured: false,
    views: 0,
    createdAt: "2026-05-11",
  },
];

const statusStyles: Record<ListingStatus, string> = {
  active: "bg-green-100 text-green-700",
  sold: "bg-blue-100 text-blue-700",
  draft: "bg-stone-100 text-stone-500",
  pending_review: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

const statusLabels: Record<ListingStatus, string> = {
  active: "Active",
  sold: "Sold",
  draft: "Draft",
  pending_review: "Pending",
  rejected: "Rejected",
};

const allStatuses: ListingStatus[] = [
  "active",
  "pending_review",
  "draft",
  "sold",
  "rejected",
];

export default function ListingsPage() {
  const [listings, setListings] = useState(mockListings);

  function toggleFeatured(id: string) {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, featured: !l.featured } : l))
    );
  }

  function changeStatus(id: string, status: ListingStatus) {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">All Listings</h2>
          <p className="text-sm text-stone-500">
            {listings.length} listings &middot;{" "}
            {listings.filter((l) => l.featured).length} featured
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-400">
          Bulk actions (coming soon)
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Featured</th>
              <th className="px-4 py-3 text-right">Views</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-stone-50">
                <td className="px-4 py-2">
                  <div className="relative h-10 w-14 overflow-hidden rounded bg-stone-200">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                </td>
                <td className="px-4 py-2">
                  <p className="font-medium text-stone-900">{listing.title}</p>
                  <p className="font-mono text-xs text-stone-400">
                    {listing.id}
                  </p>
                </td>
                <td className="px-4 py-2 text-stone-700">{listing.seller}</td>
                <td className="px-4 py-2 text-right font-medium text-stone-900">
                  &euro;{listing.price.toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <select
                    value={listing.status}
                    onChange={(e) =>
                      changeStatus(
                        listing.id,
                        e.target.value as ListingStatus
                      )
                    }
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold outline-none ${statusStyles[listing.status]}`}
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => toggleFeatured(listing.id)}
                    className={`inline-flex items-center justify-center rounded-md p-1.5 transition-colors ${
                      listing.featured
                        ? "text-amber-500 hover:bg-amber-50"
                        : "text-stone-300 hover:bg-stone-100 hover:text-stone-500"
                    }`}
                    title={listing.featured ? "Remove featured" : "Make featured"}
                  >
                    {listing.featured ? (
                      <Star className="h-4 w-4 fill-current" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-2 text-right">
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-stone-500">
                    <Eye className="h-3 w-3" />
                    {listing.views.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-2 text-stone-500">{listing.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
