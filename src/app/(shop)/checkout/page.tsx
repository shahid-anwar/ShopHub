"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// load Razorpay script dynamically
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = totalPrice();
  const total = subtotal;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const isFormValid =
    address.street && address.city && address.state && address.pincode;

  async function handlePlaceOrder() {
    setLoading(true);
    setError("");

    // 1. Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Failed to load payment gateway. Check your connection.");
      setLoading(false);
      return;
    }

    // 2. Create Razorpay order on server
    const orderRes = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      setError(orderData.error);
      setLoading(false);
      return;
    }

    // 3. Open Razorpay checkout popup
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "ShopHub",
      description: "Order Payment",
      order_id: orderData.orderId,

      // pre-fill user details
      prefill: {
        name: session?.user?.name,
        email: session?.user?.email,
      },

      theme: { color: "#3b82f6" },

      // 4. On successful payment — verify on server
      handler: async (response: any) => {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            items,
            shippingAddress: address,
          }),
        });

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          setError(verifyData.error);
          setLoading(false);
          return;
        }

        clearCart();
        router.push(`/orders/${verifyData.orderId}?success=true`);
      },

      // user closed the popup
      modal: {
        ondismiss: () => {
          setError("Payment cancelled. Try again.");
          setLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);

    // handle payment failure inside popup
    rzp.on("payment.failed", (response: any) => {
      setError(`Payment failed: ${response.error.description}`);
      setLoading(false);
    });

    rzp.open();
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-400 mb-4">Your cart is empty</p>
        <Link href="/products" className="text-blue-500 underline text-sm">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-3 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to cart
          </Link>
          <h1 className="text-3xl font-black text-gray-900">Checkout</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-10">
          {["Cart", "Shipping", "Payment", "Confirm"].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 1
                      ? "bg-green-500 text-white"
                      : i === 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i < 1 ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    i === 1
                      ? "text-blue-500"
                      : i < 1
                        ? "text-green-500"
                        : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
              {i < 3 && (
                <div
                  className={`w-8 h-0.5 ${i < 1 ? "bg-green-200" : "bg-gray-100"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping address */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h2 className="font-bold text-gray-900">Shipping Address</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                    Street Address
                  </label>
                  <input
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    placeholder="123 MG Road"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-gray-50 text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                      City
                    </label>
                    <input
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                      State
                    </label>
                    <input
                      name="state"
                      value={address.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
                <div className="max-w-xs">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                    Pincode
                  </label>
                  <input
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    placeholder="400001"
                    maxLength={6}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <h2 className="font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 p-4 border-2 border-blue-500 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <Image
                      src="https://razorpay.com/favicon.ico"
                      alt="Razorpay"
                      className="w-5 h-5"
                      // fill
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Razorpay
                    </p>
                    <p className="text-xs text-gray-500">
                      UPI, Cards, Net Banking, Wallets
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2.5 py-1 rounded-full">
                    Selected
                  </span>
                </div>

                {/* Test mode note */}
                <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <span className="text-amber-500 text-sm shrink-0">⚠️</span>
                  <div>
                    <p className="text-xs font-semibold text-amber-700">
                      Test Mode Active
                    </p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Use card{" "}
                      <span className="font-mono font-bold">
                        4111 1111 1111 1111
                      </span>
                      , any future expiry, CVV{" "}
                      <span className="font-mono font-bold">123</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Right — order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="font-bold text-gray-900">Order Summary</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 space-y-2.5 border-t border-gray-50">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-blue-500">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !isFormValid}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Opening payment...
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <rect x="1" y="4" width="22" height="16" rx="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      Pay ₹{total.toLocaleString("en-IN")}
                    </>
                  )}
                </button>
                {!isFormValid && (
                  <p className="text-[11px] text-gray-400 text-center mt-2">
                    Fill in all address fields to continue
                  </p>
                )}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <p className="text-[11px] text-gray-400">
                    Secured by Razorpay
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
