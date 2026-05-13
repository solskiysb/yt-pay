import Link from "next/link";
import { Heart, MessageSquare, Bell, ArrowRight } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CarCard } from "@/components/car-card";
import { dbListingToCar } from "@/lib/db";
import type { DbListing } from "@/lib/db";

export default async function BuyerOverviewPage() {
  const user = await requireAuth();
  const supabase = await createClient();
  const displayName = user.email?.split("@")[0] ?? "User";

  // Fetch stats in parallel
  const [favoritesRes, inquiriesRes, alertsRes, recentFavoritesRes] =
    await Promise.all([
      supabase
        .from("favorites")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("buyer_email", user.email ?? ""),
      supabase
        .from("saved_searches")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_active", true),
      supabase
        .from("favorites")
        .select("listing_id, listings(*, listing_images(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

  const savedCount = favoritesRes.count ?? 0;
  const inquiriesCount = inquiriesRes.count ?? 0;
  const alertsCount = alertsRes.count ?? 0;

  // Extract recent favorite listings
  const recentCars = (recentFavoritesRes.data ?? [])
    .map((fav: { listings: unknown }) => fav.listings as DbListing | null)
    .filter((l): l is DbListing => l !== null)
    .map(dbListingToCar);

  const stats = [
    { label: "Saved Cars", value: savedCount, icon: Heart, href: "/buyer/favorites" },
    { label: "Inquiries Sent", value: inquiriesCount, icon: MessageSquare, href: "/buyer/inquiries" },
    { label: "Active Alerts", value: alertsCount, icon: Bell, href: "/buyer/saved-searches" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-stone-900">
          Welcome back, {displayName}
        </h2>
        <p className="mt-1 text-stone-500">
          Your personal dashboard for browsing, saving and tracking classic cars.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl bg-white p-5 ring-1 ring-stone-200 transition-colors hover:ring-stone-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">
                {stat.label}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <stat.icon className="size-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-stone-900">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent saved cars */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-stone-900">
            Recently Saved Cars
          </h3>
          {recentCars.length > 0 && (
            <Link
              href="/buyer/favorites"
              className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>

        {recentCars.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white px-6 py-16 ring-1 ring-stone-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
              <Heart className="size-6 text-stone-400" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold text-stone-900">
              No saved cars yet
            </h3>
            <p className="mt-2 max-w-sm text-center text-sm text-stone-500">
              Browse our collection to find your dream classic. Save cars you
              love and they will appear here.
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
    </div>
  );
}
