import Link from "next/link";
import { Metadata } from "next";
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  Bell,
  UserCircle,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { requireAuth } from "@/lib/auth";
import { BuyerMobileNav } from "./mobile-nav";

export const metadata: Metadata = {
  title: `My Account — ${siteConfig.name}`,
};

const navItems = [
  { href: "/buyer", label: "Overview", icon: LayoutDashboard },
  { href: "/buyer/favorites", label: "Saved Cars", icon: Heart },
  { href: "/buyer/inquiries", label: "My Inquiries", icon: MessageSquare },
  { href: "/buyer/saved-searches", label: "Saved Searches", icon: Bell },
  { href: "/buyer/profile", label: "Profile", icon: UserCircle },
];

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  const displayName = user.email?.split("@")[0] ?? "User";

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <BuyerMobileNav />
          <h1 className="font-heading text-lg font-semibold text-stone-900">
            My Account
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
