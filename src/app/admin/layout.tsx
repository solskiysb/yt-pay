import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Car,
  CreditCard,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/moderation", label: "Moderation", icon: ShieldCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/listings", label: "Listings", icon: Car },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col bg-stone-900 text-stone-300">
        <div className="flex h-14 items-center gap-2 border-b border-stone-800 px-4">
          <ShieldCheck className="h-5 w-5 text-red-500" />
          <span className="text-sm font-semibold tracking-wide text-white">
            Admin Panel
          </span>
        </div>

        <nav className="mt-2 flex flex-1 flex-col gap-0.5 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-stone-800 hover:text-white"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-stone-800 px-4 py-3">
          <p className="truncate text-xs text-stone-500">{admin.email}</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-56 flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-stone-200 bg-white px-6">
          <h1 className="text-sm font-medium text-stone-900">Administration</h1>
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
            Admin
          </span>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
