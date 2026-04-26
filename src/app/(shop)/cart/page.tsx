"use client";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const subtotal = totalPrice();
  const shipping = 0;
  const tax = Math.round(subtotal * 0.08);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping + tax - discount;

  function applyCoupon() {
    if (coupon.toUpperCase() === "SAVE10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setCouponApplied(false);
    }
  }

  // ── EMPTY STATE ──────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1.25"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-400 text-sm mb-8 text-center max-w-xs">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
        >
          Start Shopping
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  // ── CART WITH ITEMS ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Shopping Cart</h1>
          <p className="text-gray-400 text-sm mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: Cart items ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-5 flex gap-5 border border-gray-100 hover:border-gray-200 transition-colors"
              >
                {/* Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold text-gray-900 hover:text-blue-500 transition-colors truncate text-sm leading-snug"
                    >
                      {item.name}
                    </Link>
                    {/* Delete */}
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-blue-500 font-black text-lg mt-1">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    {/* Item subtotal */}
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Subtotal</p>
                      <p className="font-bold text-gray-900 text-sm">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* ── RIGHT: Order summary ──────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-black text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-500 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (SAVE10)</span>
                    <span>−₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-blue-500 font-black text-xl">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Coupon */}
              <div className="mt-5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      setCouponError("");
                    }}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={applyCoupon}
                    className="border border-gray-200 rounded-xl px-3 hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth="2"
                    >
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-400 text-xs mt-1">{couponError}</p>
                )}
                {couponApplied && (
                  <p className="text-green-500 text-xs mt-1">
                    Coupon applied! 10% off
                  </p>
                )}
                {!couponError && !couponApplied && (
                  <p className="text-gray-400 text-xs mt-1">Try code: SAVE10</p>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-5 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  Proceed to Checkout
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/products"
                  className="w-full border border-gray-200 text-gray-700 font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-6">
                {[
                  { icon: "🔒", label: "Secure" },
                  { icon: "🚚", label: "Free Ship" },
                  { icon: "↩", label: "Returns" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-lg">{b.icon}</span>
                    <span className="text-[10px] text-gray-400">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
