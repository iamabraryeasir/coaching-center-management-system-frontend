"use client";

import { LayoutDashboard, LogIn, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AppLogo from "@/assets/svg/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { PUBLIC_NAV_ITEMS } from "@/constants";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout, isLoggingOut } = useAuth();

  // Close mobile menu on route changes
  useEffect(() => {
    if (pathname) {
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/70 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity & Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
            aria-label={`${siteConfig.name} Home`}
          >
            <AppLogo size={0.65} priority />

            <div className="flex flex-col">
              <span className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg">
                {siteConfig.name}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main Navigation"
        >
          {PUBLIC_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href) && item.href !== "/";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  item.disabled && "pointer-events-none opacity-50",
                )}
                aria-disabled={item.disabled}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                {item.title}
                {item.badge && (
                  <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Authentication State Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {isLoading ? (
              <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
            ) : isAuthenticated && user ? (
              <>
                {/* Dashboard Button */}
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "items-center gap-1.5 shadow-sm font-medium",
                  )}
                >
                  <LayoutDashboard className="size-4" />
                  <span>Dashboard</span>
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "items-center gap-1.5 shadow-sm font-medium",
                )}
              >
                <LogIn className="size-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger Toggle Button */}
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background p-2 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setMobileMenuOpen(false);
            }
          }}
          tabIndex={-1}
          aria-hidden="true"
        >
          <div
            className="flex flex-col border-b border-border bg-background px-6 py-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Authenticated User Banner on Mobile */}
            {isAuthenticated && user && (
              <div className="mb-4 flex items-center justify-between rounded-xl border border-border/80 bg-muted/40 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {user.role}
                </span>
              </div>
            )}

            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-1">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href) && item.href !== "/";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                      item.disabled && "pointer-events-none opacity-50",
                    )}
                  >
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Action Area */}
            <div className="mt-6 border-t border-border pt-6 flex flex-col gap-2.5">
              {isLoading ? (
                <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
              ) : isAuthenticated && user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "w-full justify-center gap-2 shadow-sm font-semibold",
                    )}
                  >
                    <LayoutDashboard className="size-4" />
                    <span>Go to Dashboard</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    disabled={isLoggingOut}
                    className="w-full justify-center gap-2 text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                  </Button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "w-full justify-center gap-2 shadow-sm font-semibold",
                  )}
                >
                  <LogIn className="size-4" />
                  <span>Login to Portal</span>
                </Link>
              )}
            </div>

            {/* Mobile Footer Info */}
            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>{siteConfig.name}</p>
              <p className="mt-1">{siteConfig.supportEmail}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
