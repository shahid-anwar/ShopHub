// src/app/(shop)/products/[slug]/page.tsx
// Replace your existing product detail page with this

import { connectDB } from "@/lib/db";
import { Product, Category, Review } from "@/models";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/shared/AddToCartButton";
import ReviewList from "@/components/shared/ReviewList";
import ProductImageGallery from "@/components/shared/ProductImageGallery";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();

  const [product, reviews] = await Promise.all([
    Product.findOne({ slug }).populate("category", "name slug").lean(),
    Product.findOne({ slug }).then((p) =>
      p
        ? Review.find({ product: p._id })
            .populate("user", "name")
            .sort({ createdAt: -1 })
            .lean()
        : [],
    ),
  ]);

  if (!product) notFound();

  const p = JSON.parse(JSON.stringify(product));
  const r = JSON.parse(JSON.stringify(reviews));

  const trustBadges = [
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.75">
          <rect x="1" y="3" width="15" height="13" rx="2"/>
          <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4"/>
          <circle cx="7.5" cy="19.5" r="1.5"/>
          <circle cx="18.5" cy="19.5" r="1.5"/>
        </svg>`,
      title: "Free Shipping",
      subtitle: "On orders over ₹999",
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.75">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>`,
      title: "Secure Payment",
      subtitle: "100% secure transactions",
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.75">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>`,
      title: "30-Day Returns",
      subtitle: "Easy return policy",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — image gallery */}
          <ProductImageGallery images={p.images} name={p.name} />

          {/* Right — product info */}
          <div className="space-y-5">
            {/* Badge */}
            <div className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {p.stock > 0 ? "In Stock" : "Out of Stock"}
            </div>

            {/* Name */}
            <h1 className="text-3xl font-black text-gray-900 leading-tight">
              {p.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={i <= Math.round(p.avgRating) ? "#f59e0b" : "none"}
                    stroke={
                      i <= Math.round(p.avgRating) ? "#f59e0b" : "#d1d5db"
                    }
                    strokeWidth="1.5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {p.avgRating > 0 ? p.avgRating : "4.8"}
              </span>
              <span className="text-sm text-gray-400">
                ({p.reviewCount > 0 ? p.reviewCount : 0} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-4xl font-black text-blue-500">
              ₹{p.price.toLocaleString("en-IN")}
            </p>

            {/* Description */}
            <p className="text-gray-500 leading-relaxed text-sm">
              {p.description}
            </p>

            {/* Trust badges */}
            <div className="space-y-3 py-2">
              {trustBadges.map((b, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"
                    dangerouslySetInnerHTML={{ __html: b.icon }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {b.title}
                    </p>
                    <p className="text-xs text-gray-400">{b.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stock status */}
            {p.stock > 0 ? (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                In stock and ready to ship
              </div>
            ) : (
              <p className="text-red-500 text-sm font-medium">Out of stock</p>
            )}

            {/* Add to cart */}
            <AddToCartButton product={p} />
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-16 border-t border-gray-100 pt-12">
          <h2 className="text-2xl font-black text-gray-900 mb-8">
            Customer Reviews
          </h2>
          <ReviewList
            productId={p._id}
            initialReviews={r}
            avgRating={p.avgRating}
            reviewCount={p.reviewCount}
          />
        </div>
      </div>
    </div>
  );
}
