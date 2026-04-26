import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product, Order, User } from "@/models";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const [totalProducts, totalOrders, totalUsers, revenueData] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments({ role: "customer" }),
        Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
      ]);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: revenueData[0]?.total ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
