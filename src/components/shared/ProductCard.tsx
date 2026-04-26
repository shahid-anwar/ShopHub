// src/components/shared/ProductCard.tsx
// Replace your existing ProductCard with this

"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import Image from "next/image";

interface Props {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    avgRating: number;
    reviewCount: number;
    stock: number;
  };
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const stars = Math.round(product.avgRating) || 4;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault(); // prevent Link navigation
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      slug: product.slug,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 block"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Top-left badge */}
        {product.stock === 0 ? (
          <div className="absolute top-3 left-3 z-10 bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
            Sold out
          </div>
        ) : product.stock < 20 ? (
          <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2.5 py-1 rounded-full">
            Only {product.stock} left
          </div>
        ) : (
          <div className="absolute top-3 left-3 z-10 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
            New
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Product image */}
        <Image
          src={
            product.images?.[0] ||
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80"
          }
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Add to cart — slides up on hover */}
        {product.stock > 0 && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className={`w-full text-white text-xs font-semibold py-3 flex items-center justify-center gap-2 transition-colors ${
                added ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {added ? "Added!" : "Add to Cart"}
            </button>
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="p-4">
        <p className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </p>

        {/* Star rating */}
        <div className="flex items-center gap-0.5 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={i <= stars ? "#f59e0b" : "none"}
              stroke={i <= stars ? "#f59e0b" : "#d1d5db"}
              strokeWidth="1.5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
          <span className="text-[11px] text-gray-400 ml-1">
            ({product.reviewCount > 0 ? product.reviewCount : 0})
          </span>
        </div>

        {/* Price */}
        <p className="text-blue-500 font-black text-lg">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
}
