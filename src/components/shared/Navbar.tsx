"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems);
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          store.
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm text-gray-600 hover:text-black"
          >
            Products
          </Link>

          {session ? (
            <>
              <span className="text-sm text-gray-600">{session.user.name}</span>
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-black"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-black"
            >
              Sign in
            </Link>
          )}

          {/* Cart icon with count badge */}
          <Link href="/cart" className="relative">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
