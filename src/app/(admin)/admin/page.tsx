import { connectDB } from "@/lib/db";
import { Product, Order, User } from "@/models";
import Link from "next/link";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

async function getStats() {
  await connectDB();
  const [totalProducts, totalOrders, totalUsers, revenueData, recentOrders] =
    await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.find({})
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);
  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: revenueData[0]?.total ?? 0,
    recentOrders: JSON.parse(JSON.stringify(recentOrders)),
  };
}

export default async function AdminOverviewPage() {
  const { totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders } =
    await getStats();

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      color: "bg-green-50 text-green-600",
      trend: "+12% this month",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
      color: "bg-blue-50 text-blue-600",
      trend: `${recentOrders.length} recent`,
    },
    {
      label: "Total Products",
      value: totalProducts,
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
      color: "bg-purple-50 text-purple-600",
      trend: "In 5 categories",
    },
    {
      label: "Total Customers",
      value: totalUsers,
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      color: "bg-orange-50 text-orange-600",
      trend: "Registered users",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Overview</h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome back — here's what's happening
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}
                dangerouslySetInnerHTML={{ __html: s.icon }}
              />
            </div>
            <p className="text-2xl font-black text-gray-900 mb-0.5">
              {s.value}
            </p>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-xs text-gray-400 mt-1">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs text-blue-500 hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Customer", "Amount", "Status", "Date"].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentOrders.map((order: any) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">
                    {order.user?.name}
                  </p>
                  <p className="text-xs text-gray-400">{order.user?.email}</p>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
