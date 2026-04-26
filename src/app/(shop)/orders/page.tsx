import { connectDB } from "@/lib/db";
import { Order } from "@/models";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border border-purple-200",
  delivered: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const statusIcons: Record<string, string> = {
  pending: "🕐",
  processing: "⚙️",
  shipped: "🚚",
  delivered: "✅",
  cancelled: "❌",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();

  const orders = await Order.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const o = JSON.parse(JSON.stringify(orders));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Your Orders</h1>
          <p className="text-gray-400 text-sm mt-1">
            {o.length} order{o.length !== 1 ? "s" : ""} placed
          </p>
        </div>

        {o.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.5"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold mb-1">No orders yet</p>
            <p className="text-gray-400 text-sm mb-6">
              Start shopping to see your orders here
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Start Shopping
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {o.map((order: any) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left — order info */}
                  <div className="flex-1 min-w-0">
                    {/* Order ID */}
                    <p className="font-mono text-xs text-gray-400 mb-2 truncate">
                      #{order._id}
                    </p>

                    {/* Summary row */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-bold text-gray-900 text-sm">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </p>
                      <span className="text-gray-300">·</span>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                      <span className="text-gray-300">·</span>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Shipping address preview */}
                    <p className="text-xs text-gray-400 mt-2 truncate">
                      📍 {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}
                    </p>
                  </div>

                  {/* Right — status + arrow */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold ${statusColors[order.status]}`}
                    >
                      {statusIcons[order.status]}{" "}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      className="group-hover:stroke-blue-500 group-hover:translate-x-0.5 transition-all"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
