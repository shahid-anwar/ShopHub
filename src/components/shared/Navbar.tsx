"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchOverlay from "./SearchOverlay";

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems);
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim())
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="text-xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
            ShopHub
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Products
          </Link>
          <Link
            href="/products"
            className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/products"
            className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Trending
          </Link>
        </div>

        {/* Search — center, functional */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <SearchOverlay
              type="text"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-full outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Cart with badge */}
          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems()}
              </span>
            )}
          </Link>

          {/* User — dropdown on click */}
          {session ? (
            <div className="relative group">
              <button className="text-gray-700 transition-colors flex items-center gap-1 pb-2">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full  w-44 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-1 group-hover:translate-y-0 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {session.user.name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {session.user.email}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Orders
                  </Link>
                  {session.user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
