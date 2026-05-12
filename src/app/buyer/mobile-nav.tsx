"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  Heart,
  MessageSquare,
  Bell,
  UserCircle,
} from "lucide-react";

const navItems = [
  { href: "/buyer", label: "Overview", icon: LayoutDashboard },
  { href: "/buyer/favorites", label: "Saved Cars", icon: Heart },
  { href: "/buyer/inquiries", label: "My Inquiries", icon: MessageSquare },
  { href: "/buyer/saved-searches", label: "Saved Searches", icon: Bell },
  { href: "/buyer/profile", label: "Profile", icon: UserCircle },
];

export function BuyerMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100"
        aria-label="Toggle navigation"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setOpen(false)}
          />
          <nav
            className="fixed left-0 top-14 z-50 w-64 border-r border-stone-200 bg-white p-4 shadow-lg"
            style={{ height: "calc(100vh - 3.5rem)" }}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
