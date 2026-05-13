"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, Shield, UserCircle, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navigation = [
  { name: "Browse Cars", href: "/cars" },
  { name: "Sell Your Car", href: "/sell" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function getInitials(user: SupabaseUser): string {
  const name = user.user_metadata?.full_name || user.email || "";
  if (!name) return "U";
  const parts = name.split(/[\s@]+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name[0].toUpperCase();
}

function getDisplayName(user: SupabaseUser): string {
  return user.user_metadata?.full_name || user.email || "User";
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string>("buyer");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user: u } }) => {
      setUser(u);
      if (u) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", u.id)
          .single();
        if (profile?.role) setUserRole(profile.role);
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-stone-200/50 bg-white/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold tracking-tight text-stone-900">
            Era<span className="text-amber-500">Marque</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
            >
              {item.name}
            </Link>
          ))}

          <div className="ml-4 flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-stone-200" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-200"
                >
                  {getInitials(user)}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="text-sm font-medium text-stone-900 truncate">
                        {getDisplayName(user)}
                      </p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/buyer"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <UserCircle className="size-4" /> My Account
                    </Link>
                    {(userRole === "seller" || userRole === "admin") && (
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <LayoutDashboard className="size-4" /> Seller Dashboard
                      </Link>
                    )}
                    {userRole === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <Shield className="size-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="size-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-8 items-center rounded-lg border border-amber-200 px-3 text-sm font-medium text-stone-700 transition-colors hover:bg-amber-50"
              >
                Sign in
              </Link>
            )}

            <Link
              href="/sell"
              className="inline-flex h-8 items-center rounded-lg bg-amber-500 px-3 text-sm font-medium text-white transition-colors hover:bg-amber-400"
            >
              List Your Car
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-50"
              >
                {item.name}
              </Link>
            ))}

            {!loading && user && (
              <>
                <div className="my-2 h-px bg-stone-200" />
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">
                    {getInitials(user)}
                  </div>
                  <p className="text-sm font-medium text-stone-900 truncate">
                    {getDisplayName(user)}
                  </p>
                </div>
                <Link href="/buyer" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-50">
                  <UserCircle className="size-4" /> My Account
                </Link>
                {(userRole === "seller" || userRole === "admin") && (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-50">
                    <LayoutDashboard className="size-4" /> Seller Dashboard
                  </Link>
                )}
                {userRole === "admin" && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-50">
                    <Shield className="size-4" /> Admin Panel
                  </Link>
                )}
                <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50">
                  <LogOut className="size-4" /> Sign out
                </button>
              </>
            )}

            {!loading && !user && (
              <>
                <div className="my-2 h-px bg-stone-200" />
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-50">
                  <User className="size-4" /> Sign in
                </Link>
              </>
            )}

            <div className="pt-2">
              <Link href="/sell" onClick={() => setMobileOpen(false)} className="flex h-11 items-center justify-center rounded-lg bg-amber-500 text-sm font-medium text-white hover:bg-amber-400">
                List Your Car
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
