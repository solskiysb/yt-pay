import Link from "next/link";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  BarChart3,
  Heart,
  CreditCard,
  UserCircle,
  Menu,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { requireSeller } from "@/lib/auth";
import { DashboardMobileNav } from "./mobile-nav";

export const metadata: Metadata = {
  title: `Dashboard — ${siteConfig.name}`,
};

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "My Listings", icon: Car },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await requireSeller();

  const displayName =
    result.user.email?.split("@")[0] ?? "Seller";

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <DashboardMobileNav />
          <h1 className="font-heading text-lg font-semibold text-stone-900">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-semibold text-xs">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline">{displayName}</span>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-stone-200 lg:bg-white">
          <nav className="flex flex-1 flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
