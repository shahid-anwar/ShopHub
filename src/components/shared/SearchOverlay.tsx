"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface SearchResult {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  avgRating: number;
  category: { name: string };
}

export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // open on keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?q=${encodeURIComponent(query)}&limit=6`,
        );
        const data = await res.json();
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  function handleResultClick() {
    setOpen(false);
  }

  function handleSearchAll() {
    router.push(`/products?q=${encodeURIComponent(query)}`);
    setOpen(false);
  }

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-gray-400 border border-gray-200 rounded-full pl-3 pr-4 py-2 hover:border-gray-300 hover:text-gray-600 transition-all bg-white"
        style={{ minWidth: "200px" }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="flex-1 text-left text-sm">Search products...</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-gray-300 border border-gray-200 rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        >
          {/* Search bar */}
          <div className="bg-white border-b border-gray-100 px-6 py-4">
            <div className="max-w-3xl mx-auto flex items-center gap-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && query && handleSearchAll()
                }
                placeholder="Search for products..."
                className="flex-1 text-lg outline-none text-gray-900 placeholder-gray-300 bg-transparent"
              />
              {loading && (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors shrink-0"
              >
                Esc
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto py-6 px-6">
            <div className="max-w-3xl mx-auto">
              {/* No query state */}
              {!query && (
                <div className="text-center py-16">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <p className="text-white/60 text-sm">
                    Start typing to search products
                  </p>
                </div>
              )}

              {/* Results list */}
              {results.length > 0 && (
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  {results.map((product, i) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      onClick={handleResultClick}
                      className={`flex items-center gap-4 p-4 hover:bg-blue-50 transition-colors ${
                        i !== results.length - 1
                          ? "border-b border-gray-50"
                          : ""
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {product.category?.name}
                        </p>
                      </div>

                      {/* Price */}
                      <p className="text-blue-500 font-black text-sm shrink-0">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>

                      {/* Arrow */}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                        className="shrink-0"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}

                  {/* See all results */}
                  <button
                    onClick={handleSearchAll}
                    className="w-full py-3.5 text-sm text-blue-500 font-semibold hover:bg-blue-50 transition-colors border-t border-gray-100 flex items-center justify-center gap-2"
                  >
                    See all results for &quot;{query}&quot;
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* No results */}
              {query && !loading && results.length === 0 && (
                <div className="bg-white rounded-2xl p-10 text-center shadow-2xl">
                  <p className="text-gray-900 font-semibold mb-1">
                    No results for &quot;{query}&quot;
                  </p>
                  <p className="text-gray-400 text-sm">
                    Try a different search term
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
