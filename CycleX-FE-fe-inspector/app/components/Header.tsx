"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

// Sub-components
import { NavLinks } from "./Header/NavLinks";
import { SearchBar } from "./Header/SearchBar";
import { UserMenu } from "./Header/UserMenu";
import { MobileMenu } from "./Header/MobileMenu";

const AUTH_ROUTES = ["/login", "/register", "/verify-email"];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, logout, user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isRestrictedRole =
    !!user && ["ADMIN", "SHIPPER"].includes(user.role);
  const isBuyer = user?.role === "BUYER";

  const handleSellClick = useCallback(() => {
    if (!isLoggedIn) {
      router.push("/login?returnUrl=/seller/create-listing");
    } else if (!isRestrictedRole && !isBuyer) {
      router.push("/seller/create-listing");
    }
  }, [isLoggedIn, isRestrictedRole, isBuyer, router]);

  if (AUTH_ROUTES.includes(pathname)) {
    return null;
  }

  const sellerMenus = [
    { label: "Dashboard", href: "/seller/dashboard" },
    { label: " My Listings", href: "/seller/my-listings" },
    { label: " Create Listing", href: "/seller/create-listing" },
    { label: " Listing Status", href: "/seller/listing-status" },
    { label: " Draft Listings", href: "/seller/draft-listings" },
    { label: " Transactions", href: "/seller/transactions" },
  ];

  return (
    <>
      <header className="w-full shrink-0 bg-brand-bg text-white sticky top-0 z-50 shadow-lg">
        <div className="w-full max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-4">

              {/* Sidebar Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-brand-primary/20 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-2xl font-bold">CycleX</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <NavLinks
              isRestrictedRole={isRestrictedRole}
              userRole={user?.role}
              onSellClick={handleSellClick}
              isLoading={isLoading}
            />

            {/* RIGHT */}
            <div className="flex items-center gap-4">

              {!isRestrictedRole && <SearchBar />}

              {isLoading ? (
                <div className="w-32 h-10 animate-pulse rounded-lg bg-gray-600" />
              ) : isLoggedIn ? (
                <>
                  <UserMenu
                    isRestrictedRole={isRestrictedRole}
                    userRole={user?.role}
                    onLogout={logout}
                  />

                  {!isRestrictedRole && !isBuyer && (
                    <Link
                      href="/seller/create-listing"
                      className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Đăng Tin
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden md:block text-white hover:text-brand-primary transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <MobileMenu
            isOpen={mobileMenuOpen}
            isLoggedIn={isLoggedIn}
            isRestrictedRole={isRestrictedRole}
            userRole={user?.role}
            onClose={() => setMobileMenuOpen(false)}
            onSellClick={handleSellClick}
            isLoading={isLoading}
          />
        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-brand-bg shadow-xl z-50 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
          <span className="text-lg font-semibold">Seller Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="flex flex-col mt-6 space-y-2 px-4">
          {sellerMenus.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-brand-primary text-white"
                    : "hover:bg-brand-primary/20 hover:text-brand-primary text-white/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}