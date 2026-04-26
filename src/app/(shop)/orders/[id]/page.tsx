import { connectDB } from "@/lib/db";
import { Order } from "@/models";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const statusConfig: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  pending: {
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    label: "Pending",
  },
  processing: {
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    label: "Processing",
  },
  shipped: {
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    label: "Shipped",
  },
  delivered: {
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    label: "Delivered",
  },
  cancelled: {
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    label: "Cancelled",
  },
};

const statusSteps = ["pending", "processing", "shipped", "delivered"];

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;
  const isSuccess = success === "true";
  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();

  const order = await Order.findById(id).populate("user", "name email").lean();
  if (!order) notFound();

  const o = JSON.parse(JSON.stringify(order));
  const currentStep = statusSteps.indexOf(o.status);
  const status = statusConfig[o.status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* ── SUCCESS BANNER ─────────────────────────────────── */}
        {isSuccess && (
          <div className="bg-white border border-green-100 rounded-3xl p-8 mb-8 text-center shadow-sm">
            {/* Animated checkmark */}
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Thank you for shopping with ShopHub. Your order has been confirmed
              and will be processed shortly.
            </p>
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 mt-4">
              <span className="text-xs text-gray-400">Order ID</span>
              <span className="font-mono text-xs font-semibold text-gray-700">
                {o._id}
              </span>
            </div>
          </div>
        )}

        {/* ── ORDER HEADER (non-success) ──────────────────────── */}
        {!isSuccess && (
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/orders"
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
                All orders
              </Link>
              <h1 className="text-2xl font-black text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-400 text-sm mt-1 font-mono">{o._id}</p>
            </div>
            <span
              className={`text-sm px-4 py-2 rounded-full border font-semibold ${status.bg} ${status.color}`}
            >
              {status.label}
            </span>
          </div>
        )}

        {/* ── PROGRESS TRACKER ────────────────────────────────── */}
        {o.status !== "cancelled" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-6">
              Order Progress
            </h2>
            <div className="relative flex items-start justify-between">
              {/* Background line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100" />
              {/* Progress line */}
              <div
                className="absolute top-5 left-0 h-0.5 bg-blue-500 transition-all duration-700"
                style={{
                  width: `${(currentStep / (statusSteps.length - 1)) * 100}%`,
                }}
              />

              {statusSteps.map((step, i) => {
                const done = i <= currentStep;
                const current = i === currentStep;
                const icons = [
                  // pending
                  <svg
                    key="p"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>,
                  // processing
                  <svg
                    key="pr"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>,
                  // shipped
                  <svg
                    key="s"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path d="M16 8h4l3 3v5h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="1.5" />
                    <circle cx="18.5" cy="18.5" r="1.5" />
                  </svg>,
                  // delivered
                  <svg
                    key="d"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>,
                ];
                return (
                  <div
                    key={step}
                    className="flex flex-col items-center z-10 flex-1"
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        done
                          ? current
                            ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200"
                            : "bg-blue-500 border-blue-500 text-white"
                          : "bg-white border-gray-200 text-gray-300"
                      }`}
                    >
                      {icons[i]}
                    </div>
                    <p
                      className={`text-xs mt-2 font-medium capitalize ${
                        current
                          ? "text-blue-500"
                          : done
                            ? "text-gray-700"
                            : "text-gray-300"
                      }`}
                    >
                      {step}
                    </p>
                    {current && (
                      <span className="text-[10px] text-blue-400 mt-0.5">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ── ORDER ITEMS ─────────────────────────────────────  */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 text-sm">
                Items Ordered ({o.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {o.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
            {/* Total */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">
                Order Total
              </span>
              <span className="text-blue-500 font-black text-lg">
                ₹{o.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Shipping address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Shipping Address
                </h3>
              </div>
              <div className="text-sm text-gray-500 space-y-0.5 leading-relaxed">
                <p>{o.shippingAddress.street}</p>
                <p>
                  {o.shippingAddress.city}, {o.shippingAddress.state}
                </p>
                <p>{o.shippingAddress.pincode}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Payment</h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Cash on delivery</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    o.paymentStatus === "paid"
                      ? "bg-green-50 text-green-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {o.paymentStatus}
                </span>
              </div>
            </div>

            {/* Order date */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Order Date
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(o.createdAt).toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTONS ───────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href="/products"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
