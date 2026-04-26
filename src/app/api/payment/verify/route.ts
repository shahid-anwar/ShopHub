import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { Order, Product } from "@/models";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
    } = await req.json();

    // ── VERIFY SIGNATURE ─────────────────────────────────────
    // Razorpay signs the payment with your secret — verify it's genuine
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 },
      );
    }

    // ── PAYMENT VERIFIED — create order in DB ─────────────────
    await connectDB();

    // deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity },
      });
    }

    const orderItems = items.map((item: any) => ({
      product: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );

    const order = await Order.create({
      user: session.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: "processing", // paid — move to processing immediately
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    return NextResponse.json({ orderId: order._id }, { status: 201 });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
