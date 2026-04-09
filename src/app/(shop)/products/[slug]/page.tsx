import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/shared/AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  await connectDB();

  const product = await Product.findOne({ slug: params.slug })
    .populate("category", "name")
    .lean();

  if (!product) notFound();

  const p = JSON.parse(JSON.stringify(product));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={p.images[0] || "/placeholder.png"}
            alt={p.name}
            height={100}
            width={100}
            className="object-cover"
            loading="eager"
          />
        </div>

        {/* Info */}
        <div className="space-y-4">
          <p className="text-sm text-gray-400">{p.category?.name}</p>
          <h1 className="text-2xl font-semibold">{p.name}</h1>

          <div className="flex items-center gap-2">
            <span className="text-amber-500">★</span>
            <span className="text-sm text-gray-500">
              {p.avgRating > 0
                ? `${p.avgRating} · ${p.reviewCount} reviews`
                : "No reviews yet"}
            </span>
          </div>

          <p className="text-2xl font-bold">
            ₹{p.price.toLocaleString("en-IN")}
          </p>

          <p className="text-gray-600 text-sm leading-relaxed">
            {p.description}
          </p>

          <p
            className={`text-sm ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}
          >
            {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
          </p>

          {/* Add to cart — client component */}
          <AddToCartButton product={p} />
        </div>
      </div>
    </div>
  );
}
