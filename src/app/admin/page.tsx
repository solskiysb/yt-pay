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

const stats = [
  {
    label: "Total Listings",
    value: "247",
    change: "+12 this week",
    icon: Car,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Pending Review",
    value: "18",
    change: "3 urgent",
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Total Users",
    value: "1,834",
    change: "+89 this month",
    icon: Users,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Revenue",
    value: "\u20AC14,720",
    change: "+22% vs last month",
    icon: DollarSign,
    color: "bg-purple-50 text-purple-600",
  },
];

const recentActivity = [
  {
    id: "act-1",
    action: "approved",
    listing: "1973 Porsche 911 Carrera RS",
    admin: "admin@yt-pay.io",
    time: "12 min ago",
  },
  {
    id: "act-2",
    action: "rejected",
    listing: "2019 BMW M3 (not classic)",
    admin: "admin@yt-pay.io",
    time: "45 min ago",
  },
  {
    id: "act-3",
    action: "approved",
    listing: "1967 Alfa Romeo Spider",
    admin: "admin@yt-pay.io",
    time: "1 hour ago",
  },
  {
    id: "act-4",
    action: "featured",
    listing: "1961 Jaguar E-Type",
    admin: "admin@yt-pay.io",
    time: "2 hours ago",
  },
  {
    id: "act-5",
    action: "approved",
    listing: "1989 Mercedes 300SL",
    admin: "admin@yt-pay.io",
    time: "3 hours ago",
  },
  {
    id: "act-6",
    action: "user_banned",
    listing: "spam-seller-42",
    admin: "admin@yt-pay.io",
    time: "5 hours ago",
  },
];

const quickLinks = [
  {
    label: "Review pending listings",
    href: "/admin/moderation",
    count: 18,
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
    count: 7,
  },
];

export default function AdminDashboardPage() {
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
            <p className="mt-1 text-xs text-stone-500">{stat.change}</p>
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
            {recentActivity.map((item) => (
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
                {item.action === "featured" && (
                  <Eye className="h-4 w-4 shrink-0 text-amber-500" />
                )}
                {item.action === "user_banned" && (
                  <XCircle className="h-4 w-4 shrink-0 text-red-700" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-stone-700">
                    <span className="font-medium capitalize">
                      {item.action.replace("_", " ")}
                    </span>{" "}
                    &mdash; {item.listing}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-stone-400">
                  {item.time}
                </span>
              </div>
            ))}
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
