"use client";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface Props {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
    stock: number;
  };
}

export default function AddToCartButton({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i._id === product._id);
  const isOutOfStock = product.stock === 0;

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        slug: product.slug,
        stock: product.stock,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (isOutOfStock) {
    return (
      <button
        disabled
        className="w-full bg-gray-100 text-gray-400 rounded-2xl py-4 text-sm font-semibold cursor-not-allowed"
      >
        Out of stock
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Quantity + Add to cart row */}
      <div className="flex items-center gap-3">
        {/* Quantity selector */}
        <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-11 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="w-11 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium"
          >
            +
          </button>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAdd}
          className={`flex-1 h-12 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            added
              ? "bg-green-500 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {added ? "Added to Cart!" : "Add to Cart"}
        </button>

        {/* Wishlist button */}
        <button className="w-12 h-12 border border-gray-200 rounded-2xl flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-colors shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1.75"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Share button */}
        <button className="w-12 h-12 border border-gray-200 rounded-2xl flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 transition-colors shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1.75"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {inCart && (
        <p className="text-xs text-center text-gray-400">
          {inCart.quantity} already in your cart
        </p>
      )}
    </div>
  );
}
