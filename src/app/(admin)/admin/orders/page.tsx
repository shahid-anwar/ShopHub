import { connectDB } from "@/lib/db";
import { Order } from "@/models";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

async function getOrders() {
  await connectDB();
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(orders));
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border border-purple-200",
  delivered: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">
          {orders.length} total orders
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {[
                "Customer",
                "Items",
                "Total",
                "Status",
                "Date",
                "Update Status",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any, i: number) => (
              <tr
                key={order._id}
                className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${
                  i === orders.length - 1 ? "border-0" : ""
                }`}
              >
                {/* Customer */}
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">
                    {order.user?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.user?.email}
                  </p>
                </td>

                {/* Items */}
                <td className="px-6 py-4">
                  <span className="text-gray-700 font-medium">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </span>
                </td>

                {/* Total */}
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-900">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>
                </td>

                {/* Status badge */}
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold ${statusColors[order.status]}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  <span className="text-gray-600 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </td>

                {/* Update */}
                <td className="px-6 py-4">
                  <OrderStatusUpdater
                    orderId={order._id}
                    currentStatus={order.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
