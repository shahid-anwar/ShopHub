"use client";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
        <Link href="/products" className="text-sm underline text-gray-600">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Cart ({items.length})</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Clear cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 p-4 border border-gray-100 rounded-2xl"
          >
            {/* Image */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.slug}`}
                className="text-sm font-medium hover:underline truncate block"
              >
                {item.name}
              </Link>
              <p className="text-sm text-gray-500 mt-0.5">
                ₹{item.price.toLocaleString("en-IN")}
              </p>

              {/* Quantity controls */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="w-7 h-7 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-sm w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="w-7 h-7 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 flex items-center justify-center disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* Item total + remove */}
            <div className="flex flex-col items-end justify-between shrink-0">
              <p className="text-sm font-semibold">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
              <button
                onClick={() => removeItem(item._id)}
                className="text-xs text-gray-400 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div className="mt-8 border-t border-gray-100 pt-6 space-y-3">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span>₹{totalPrice().toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-100">
          <span>Total</span>
          <span>₹{totalPrice().toLocaleString("en-IN")}</span>
        </div>

        <Link
          href="/checkout"
          className="block w-full bg-black text-white text-center rounded-xl py-3 text-sm font-medium mt-4 hover:bg-gray-800 transition-colors"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
