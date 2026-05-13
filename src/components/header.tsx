"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, Shield, UserCircle, User, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const localeLabels: Record<string, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
};

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
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string>("buyer");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as string) || routing.defaultLocale;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: t("browseCars"), href: "/cars" as const },
    { name: t("sellYourCar"), href: "/sell" as const },
    { name: t("about"), href: "/about" as const },
    { name: t("contact"), href: "/contact" as const },
  ];

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

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
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

  function switchLocale(locale: string) {
    setLangOpen(false);
    router.replace(pathname, { locale: locale as "en" | "fr" | "de" });
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
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
            >
              {item.name}
            </Link>
          ))}

          <div className="ml-4 flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-stone-200 px-2 text-sm text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
                aria-label="Switch language"
              >
                <Globe className="size-3.5" />
                <span className="text-xs font-medium">{localeLabels[currentLocale] || "EN"}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-28 rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
                  {routing.locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => switchLocale(locale)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-stone-50 ${
                        currentLocale === locale
                          ? "font-semibold text-amber-600"
                          : "text-stone-700"
                      }`}
                    >
                      {localeLabels[locale]}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                      <UserCircle className="size-4" /> {t("myAccount")}
                    </Link>
                    {(userRole === "seller" || userRole === "admin") && (
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <LayoutDashboard className="size-4" /> {t("sellerDashboard")}
                      </Link>
                    )}
                    {userRole === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <Shield className="size-4" /> {t("adminPanel")}
                      </Link>
                    )}
                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="size-4" /> {t("signOut")}
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
                {t("signIn")}
              </Link>
            )}

            <Link
              href="/sell"
              className="inline-flex h-8 items-center rounded-lg bg-amber-500 px-3 text-sm font-medium text-white transition-colors hover:bg-amber-400"
            >
              {t("listYourCar")}
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
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-50"
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <div className="my-2 h-px bg-stone-200" />
            <div className="flex items-center gap-2 px-4 py-2">
              <Globe className="size-4 text-stone-400" />
              {routing.locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => {
                    switchLocale(locale);
                    setMobileOpen(false);
                  }}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    currentLocale === locale
                      ? "bg-amber-100 text-amber-700"
                      : "text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  {localeLabels[locale]}
                </button>
              ))}
            </div>

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
                  <UserCircle className="size-4" /> {t("myAccount")}
                </Link>
                {(userRole === "seller" || userRole === "admin") && (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-50">
                    <LayoutDashboard className="size-4" /> {t("sellerDashboard")}
                  </Link>
                )}
                {userRole === "admin" && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-50">
                    <Shield className="size-4" /> {t("adminPanel")}
                  </Link>
                )}
                <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50">
                  <LogOut className="size-4" /> {t("signOut")}
                </button>
              </>
            )}

            {!loading && !user && (
              <>
                <div className="my-2 h-px bg-stone-200" />
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-stone-600 hover:bg-stone-50">
                  <User className="size-4" /> {t("signIn")}
                </Link>
              </>
            )}

            <div className="pt-2">
              <Link href="/sell" onClick={() => setMobileOpen(false)} className="flex h-11 items-center justify-center rounded-lg bg-amber-500 text-sm font-medium text-white hover:bg-amber-400">
                {t("listYourCar")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
