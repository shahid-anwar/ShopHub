import { connectDB } from "@/lib/db";
import { Product, Category } from "@/models";
import ProductsClient from "./ProductsClient";
import mongoose from "mongoose";
import { Suspense } from "react";
interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
  }>;
}

async function getData({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  await connectDB();

  const filter: any = {};

  if (resolvedParams.q) {
    filter.name = { $regex: resolvedParams.q, $options: "i" };
  }
  if (resolvedParams.category) {
    try {
      filter.category = new mongoose.Types.ObjectId(resolvedParams.category);
    } catch {
      // invalid id format — ignore
      console.log("Invalid category ID:", resolvedParams.category);
    }
  }
  if (resolvedParams.minPrice || resolvedParams.maxPrice) {
    filter.price = {};
    if (resolvedParams.minPrice)
      filter.price.$gte = Number(resolvedParams.minPrice);
    if (resolvedParams.maxPrice)
      filter.price.$lte = Number(resolvedParams.maxPrice);
  }
  if (resolvedParams.rating) {
    filter.avgRating = { $gte: Number(resolvedParams.rating) };
  }

  const sort = resolvedParams.sort || "createdAt";
  const page = parseInt(resolvedParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const sortMap: Record<string, any> = {
    createdAt: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { avgRating: -1 },
  };

  const [products, total, categories, activeCategory] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
    Category.find({}).lean(),
    resolvedParams.category
      ? Category.findById(resolvedParams.category).lean()
      : null,
  ]);

  console.log("category filter:", resolvedParams.category);
  console.log("products found:", products.length);
  return {
    products: JSON.parse(JSON.stringify(products)),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    categories: JSON.parse(JSON.stringify(categories)),
    activeCategory: activeCategory
      ? JSON.parse(JSON.stringify(activeCategory))
      : null,
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const data = await getData({ searchParams });

  return (
    <Suspense fallback={<div className="p-8 text-gray-400">Loading...</div>}>
      <ProductsClient {...data} />
    </Suspense>
  );
}
