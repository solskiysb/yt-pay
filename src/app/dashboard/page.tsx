import Link from "next/link";
import { Metadata } from "next";
import {
  Car,
  Eye,
  MessageSquare,
  Heart,
  Plus,
  BarChart3,
  ArrowRight,
  Clock,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { requireSeller } from "@/lib/auth";

export const metadata: Metadata = {
  title: `Dashboard — ${siteConfig.name}`,
};

const stats = [
  { label: "Active Listings", value: "3", icon: Car, change: "+1 this month" },
  { label: "Total Views", value: "1,247", icon: Eye, change: "+89 this week" },
  {
    label: "Inquiries",
    value: "12",
    icon: MessageSquare,
    change: "4 unread",
  },
  { label: "Favorites", value: "28", icon: Heart, change: "+5 this week" },
];

const recentInquiries = [
  {
    id: "1",
    buyerName: "Thomas Mueller",
    listing: "1973 Porsche 911 Carrera RS",
    message: "Is this car still available? I would love to schedule a viewing...",
    date: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    buyerName: "Sophie Laurent",
    listing: "1987 Porsche 911 Turbo",
    message: "Can you provide more details about the service history?",
    date: "5 hours ago",
    unread: true,
  },
  {
    id: "3",
    buyerName: "Marco Rossi",
    listing: "1967 Mercedes-Benz 280 SL",
    message: "Very interested. What is your best price for a quick sale?",
    date: "1 day ago",
    unread: false,
  },
  {
    id: "4",
    buyerName: "Anna Bergström",
    listing: "1994 Porsche 911 Carrera (993)",
    message: "Would you consider shipping to Sweden?",
    date: "2 days ago",
    unread: false,
  },
  {
    id: "5",
    buyerName: "Pierre Dupont",
    listing: "1973 Porsche 911 Carrera RS",
    message: "Does the Certificate of Authenticity include matching numbers...",
    date: "3 days ago",
    unread: false,
  },
];

export default async function DashboardPage() {
  let displayName = "Seller";
  try {
    const { user } = await requireSeller();
    displayName = user.email?.split("@")[0] ?? "Seller";
  } catch {
    // Layout handles redirect
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-stone-900">
          Welcome back, {displayName}
        </h2>
        <p className="mt-1 text-stone-500">
          Here is what is happening with your listings today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-5 ring-1 ring-stone-200"
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
            <p className="mt-1 text-xs text-stone-400">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick actions + Recent inquiries */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-semibold text-stone-900">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/listings/new"
              className="flex items-center gap-3 rounded-xl bg-amber-500 p-4 font-medium text-stone-900 transition-colors hover:bg-amber-400"
            >
              <Plus className="size-5" />
              Create New Listing
            </Link>
            <Link
              href="/dashboard/listings"
              className="flex items-center gap-3 rounded-xl bg-white p-4 font-medium text-stone-700 ring-1 ring-stone-200 transition-colors hover:bg-stone-50"
            >
              <BarChart3 className="size-5 text-stone-400" />
              View My Listings
            </Link>
          </div>
        </div>

        {/* Recent inquiries */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-stone-900">
              Recent Inquiries
            </h3>
            <Link
              href="/dashboard/inquiries"
              className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-stone-100 rounded-xl bg-white ring-1 ring-stone-200">
            {recentInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-start gap-3 p-4"
              >
                <div
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    inquiry.unread ? "bg-amber-500" : "bg-transparent"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-stone-900 truncate">
                      {inquiry.buyerName}
                    </p>
                    <span className="flex items-center gap-1 shrink-0 text-xs text-stone-400">
                      <Clock className="size-3" />
                      {inquiry.date}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-amber-600">
                    {inquiry.listing}
                  </p>
                  <p className="mt-1 text-sm text-stone-500 truncate">
                    {inquiry.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
