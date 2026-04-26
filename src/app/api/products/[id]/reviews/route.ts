import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/models/Review";
import { Product } from "@/models/Product";
import { auth } from "@/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // await it first

  try {
    await connectDB();
    const reviews = await Review.find({ product: id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // await it first

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Login to review" }, { status: 401 });
    }

    await connectDB();

    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json(
        { error: "Rating and comment are required" },
        { status: 400 },
      );
    }

    const existing = await Review.findOne({
      user: session.user.id,
      product: id,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 },
      );
    }

    const review = await Review.create({
      user: session.user.id,
      product: id,
      rating,
      comment,
    });

    await review.populate("user", "name");
    return NextResponse.json(review, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // await it first

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const review = await Review.findOneAndDelete({
      product: id,
      user: session.user.id,
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(id, {
      avgRating: stats[0]?.avgRating.toFixed(1) ?? 0,
      reviewCount: stats[0]?.reviewCount ?? 0,
    });

    return NextResponse.json({ message: "Review deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
