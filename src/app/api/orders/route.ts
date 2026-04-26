import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order, Product } from "@/models";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Login to place order" },
        { status: 401 },
      );
    }

    await connectDB();

    const { items, shippingAddress } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (
      !shippingAddress?.street ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
      return NextResponse.json(
        { error: "Complete shipping address required" },
        { status: 400 },
      );
    }

    // verify each product still exists and has enough stock
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.name}" is no longer available` },
          { status: 400 },
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Only ${product.stock} units of "${item.name}" left in stock`,
          },
          { status: 400 },
        );
      }
    }

    // deduct stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // snapshot price at time of purchase — never rely on product.price later
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
      status: "pending",
      paymentStatus: "paid", // treating as paid since no payment gateway
    });

    return NextResponse.json({ orderId: order._id }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(JSON.parse(JSON.stringify(orders)));
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
