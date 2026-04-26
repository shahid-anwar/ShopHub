"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";

interface Category {
  _id: string;
  name: string;
  slug: string;
}
interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  avgRating: number;
  reviewCount: number;
  stock: number;
}

interface Props {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
  categories: Category[];
  activeCategory: Category | null;
  searchParams: {
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
  };
}

const sortOptions = [
  { value: "createdAt", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function ProductsClient({
  products,
  total,
  totalPages,
  currentPage,
  categories,
  activeCategory,
}: Omit<Props, "searchParams">) {
  const router = useRouter();
  const params = useSearchParams();
  const [maxPrice, setMaxPrice] = useState(
    Number(params.get("maxPrice")) || 50000,
  );

  function updateParam(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete("page");
    router.push(`/products?${p.toString()}`);
  }

  function applyPriceRange() {
    const p = new URLSearchParams(params.toString());
    p.set("maxPrice", String(maxPrice));
    p.delete("page");
    router.push(`/products?${p.toString()}`);
  }

  const pageTitle = activeCategory
    ? `${activeCategory.name} Products`
    : params.get("q")
      ? `Results for "${params.get("q")}"`
      : "All Products";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900">{pageTitle}</h1>
          <p className="text-gray-400 text-sm mt-1">
            Showing {total} result{total !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-8">
          {/* ── SIDEBAR ─────────────────────────────────────── */}
          <aside className="w-64 shrink-0 space-y-8">
            {/* Price Range */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
              <input
                type="range"
                min={0}
                max={50000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                onMouseUp={applyPriceRange}
                onTouchEnd={applyPriceRange}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>₹0</span>
                <span>₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Category</h3>
              <div className="space-y-3">
                {/* All */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={!params.get("category")}
                    onChange={() => updateParam("category", "")}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span
                    className={`text-sm ${!params.get("category") ? "text-blue-500 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}
                  >
                    All Categories
                  </span>
                </label>

                {categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={params.get("category") === cat._id}
                      onChange={() => updateParam("category", cat._id)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span
                      className={`text-sm ${params.get("category") === cat._id ? "text-blue-500 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}
                    >
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Minimum Rating</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={
                        r === 1
                          ? !params.get("rating")
                          : params.get("rating") === String(r)
                      }
                      onChange={() =>
                        updateParam("rating", r === 1 ? "" : String(r))
                      }
                      className="w-4 h-4 accent-blue-500"
                    />
                    <div className="flex items-center gap-1">
                      {r === 1 ? (
                        <span className="text-sm text-gray-600">
                          All Ratings
                        </span>
                      ) : (
                        <>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <svg
                              key={i}
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill={i <= r ? "#f59e0b" : "none"}
                              stroke={i <= r ? "#f59e0b" : "#d1d5db"}
                              strokeWidth="1.5"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            & Up
                          </span>
                        </>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {(params.get("category") ||
              params.get("rating") ||
              params.get("maxPrice") ||
              params.get("q")) && (
              <button
                onClick={() => router.push("/products")}
                className="w-full text-sm text-red-500 border border-red-200 rounded-xl py-2.5 hover:bg-red-50 transition-colors font-medium"
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* ── MAIN CONTENT ────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-end mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={params.get("sort") || "createdAt"}
                  onChange={(e) => updateParam("sort", e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 bg-white font-medium"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product grid */}
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <p className="text-gray-900 font-semibold mb-1">
                  No products found
                </p>
                <p className="text-gray-400 text-sm mb-5">
                  Try adjusting your filters
                </p>
                <button
                  onClick={() => router.push("/products")}
                  className="bg-blue-500 text-white text-sm px-5 py-2.5 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => updateParam("page", String(n))}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                        n === currentPage
                          ? "bg-blue-500 text-white"
                          : "border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-500"
                      }`}
                    >
                      {n}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
