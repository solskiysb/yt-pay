import Link from "next/link";
import {
  Car,
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const supabase = await createClient();

  // Fetch stats in parallel
  const [
    listingsRes,
    pendingRes,
    usersRes,
    revenueRes,
    activityRes,
    inquiriesRes,
  ] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }),
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_review"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("payments")
      .select("amount")
      .eq("status", "paid"),
    supabase
      .from("moderation_events")
      .select("id, action, reason, created_at, listing_id, listings(make, model, year)")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  const totalListings = listingsRes.count ?? 0;
  const pendingCount = pendingRes.count ?? 0;
  const totalUsers = usersRes.count ?? 0;
  const totalRevenue = (revenueRes.data ?? []).reduce(
    (sum, p) => sum + (p.amount ?? 0),
    0
  );
  const newInquiries = inquiriesRes.count ?? 0;

  const stats = [
    {
      label: "Total Listings",
      value: totalListings.toLocaleString(),
      icon: Car,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending Review",
      value: pendingCount.toLocaleString(),
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Revenue",
      value: `\u20AC${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const rawActivity = (activityRes.data ?? []) as Array<{
    id: string;
    action: string;
    reason: string | null;
    created_at: string;
    listing_id: string | null;
    listings: unknown;
  }>;

  const recentActivity = rawActivity.map((item) => {
    const listingsRaw = item.listings;
    const listings = Array.isArray(listingsRaw)
      ? (listingsRaw[0] as { make: string; model: string; year: number } | undefined) ?? null
      : (listingsRaw as { make: string; model: string; year: number } | null);
    return { ...item, listings };
  });

  const quickLinks = [
    {
      label: "Review pending listings",
      href: "/admin/moderation",
      count: pendingCount || null,
    },
    {
      label: "Manage users",
      href: "/admin/users",
      count: null,
    },
    {
      label: "View all payments",
      href: "/admin/payments",
      count: null,
    },
    {
      label: "Check inquiries",
      href: "/admin/inquiries",
      count: newInquiries || null,
    },
  ];

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-stone-900">Dashboard</h2>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-stone-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-stone-500">{stat.label}</p>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-md ${stat.color}`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-stone-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <div className="lg:col-span-2 rounded-lg border border-stone-200 bg-white">
          <div className="border-b border-stone-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-stone-900">
              Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-stone-100">
            {recentActivity.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-stone-400">
                No activity yet.
              </div>
            ) : (
              recentActivity.map((item) => {
                const listingLabel = item.listings
                  ? `${item.listings.year} ${item.listings.make} ${item.listings.model}`
                  : item.reason ?? "Unknown";

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    {item.action === "approved" && (
                      <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                    )}
                    {item.action === "rejected" && (
                      <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                    )}
                    {(item.action === "featured" ||
                      item.action === "unfeatured") && (
                      <Eye className="h-4 w-4 shrink-0 text-amber-500" />
                    )}
                    {(item.action === "user_banned" ||
                      item.action === "user_unbanned") && (
                      <XCircle className="h-4 w-4 shrink-0 text-red-700" />
                    )}
                    {![
                      "approved",
                      "rejected",
                      "featured",
                      "unfeatured",
                      "user_banned",
                      "user_unbanned",
                    ].includes(item.action) && (
                      <CheckCircle className="h-4 w-4 shrink-0 text-stone-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-stone-700">
                        <span className="font-medium capitalize">
                          {item.action.replace(/_/g, " ")}
                        </span>{" "}
                        &mdash; {listingLabel}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-stone-400">
                      {timeAgo(item.created_at)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-lg border border-stone-200 bg-white">
          <div className="border-b border-stone-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-stone-900">
              Quick Actions
            </h3>
          </div>
          <div className="divide-y divide-stone-100">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-4 py-3 text-sm text-stone-700 transition-colors hover:bg-stone-50"
              >
                <span>{link.label}</span>
                <span className="flex items-center gap-1.5">
                  {link.count !== null && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-xs font-semibold text-red-700">
                      {link.count}
                    </span>
                  )}
                  <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
