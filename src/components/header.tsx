"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, LayoutDashboard, Shield, User, UserCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navigation = [
  { name: "Browse Cars", href: "/cars" },
  { name: "Sell Your Car", href: "/sell" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function getInitials(user: SupabaseUser): string {
  const name =
    user.user_metadata?.full_name || user.email || "";
  if (!name) return "U";
  const parts = name.split(/[\s@]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
}

function getDisplayName(user: SupabaseUser): string {
  return user.user_metadata?.full_name || user.email || "User";
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string>("buyer");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();
        if (profile?.role) setUserRole(profile.role);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-background/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            Era
            <span className="text-accent-gold">Marque</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}

          <div className="ml-4 flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar>
                    <AvatarFallback className="bg-accent-gold/15 text-accent-gold-dark text-xs font-semibold">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-foreground">
                        {getDisplayName(user)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => router.push("/buyer")}
                  >
                    <UserCircle className="mr-2 size-4" />
                    My Account
                  </DropdownMenuItem>
                  {(userRole === "seller" || userRole === "admin") && (
                    <DropdownMenuItem
                      onSelect={() => router.push("/dashboard")}
                    >
                      <LayoutDashboard className="mr-2 size-4" />
                      Seller Dashboard
                    </DropdownMenuItem>
                  )}
                  {userRole === "admin" && (
                    <DropdownMenuItem
                      onSelect={() => router.push("/admin")}
                    >
                      <Shield className="mr-2 size-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={handleLogout}
                  >
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "border-accent-gold/30 text-foreground hover:bg-accent-gold/5"
                )}
              >
                Sign in
              </Link>
            )}

            <Link
              href="/sell"
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-accent-gold text-white hover:bg-accent-gold-dark"
              )}
            >
              List Your Car
            </Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="md:hidden"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="font-heading text-lg">
                Era<span className="text-accent-gold">Marque</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}

              {!loading && user && (
                <>
                  <div className="my-3 h-px bg-border" />
                  <div className="flex items-center gap-3 px-4 py-2">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-accent-gold/15 text-accent-gold-dark text-[10px] font-semibold">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {getDisplayName(user)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/buyer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <UserCircle className="size-4" />
                    My Account
                  </Link>
                  {(userRole === "seller" || userRole === "admin") && (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <LayoutDashboard className="size-4" />
                      Seller Dashboard
                    </Link>
                  )}
                  {userRole === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Shield className="size-4" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-destructive transition-colors hover:bg-destructive/5"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </>
              )}

              {!loading && !user && (
                <>
                  <div className="my-3 h-px bg-border" />
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <User className="size-4" />
                    Sign in
                  </Link>
                </>
              )}

              <div className="mt-4 px-4">
                <Link
                  href="/sell"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "w-full bg-accent-gold text-white hover:bg-accent-gold-dark"
                  )}
                >
                  List Your Car
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
