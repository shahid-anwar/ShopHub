"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  processing: "text-blue-600 bg-blue-50 border-blue-200",
  shipped: "text-purple-600 bg-purple-50 border-purple-200",
  delivered: "text-green-600 bg-green-50 border-green-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
};

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    router.refresh();
    setLoading(false);
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`text-xs border rounded-lg px-2.5 py-1.5 outline-none font-semibold transition-all cursor-pointer disabled:opacity-50 ${statusColors[status]}`}
    >
      {statuses.map((s) => (
        <option key={s} value={s} className="bg-white text-gray-700">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}
