import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order, User } from "@/models";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
