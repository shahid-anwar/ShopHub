import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import { Product, Category } from "@/models";

async function getData() {
  await connectDB();
  const [products, categories] = await Promise.all([
    Product.find({})
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
    Category.find({}).lean(),
  ]);
  return {
    products: JSON.parse(JSON.stringify(products)),
    categories: JSON.parse(JSON.stringify(categories)),
  };
}

// Category background images from Unsplash
const categoryImages: Record<string, string> = {
  shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "t-shirts":
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
  accessories:
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
  bags: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  watches:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
};

export default async function HomePage() {
  const { products, categories } = await getData();
  const trending = products.slice(0, 4);
  const featured = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #a855f7 100%)",
          minHeight: "420px",
        }}
      >
        {/* subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          {/* badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/30">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            New arrivals this week
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-5 max-w-2xl">
            Discover Your
            <br />
            Perfect Products
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl">
            Premium quality products curated just for you. Shop with confidence.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="bg-white text-gray-900 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/products"
              className="border-2 border-white text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              View Trending
            </Link>
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ───────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-500 text-sm">
            Explore our wide range of product categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat: any) => (
            <Link
              key={cat._id}
              href={`/products?category=${cat._id}`}
              className="group relative overflow-hidden rounded-2xl block"
              style={{ height: "220px" }} // explicit height instead of aspect ratio
            >
              <Image
                src={
                  categoryImages[cat.slug] ||
                  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80"
                }
                alt={cat.name}
                fill
                priority
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold text-lg">{cat.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-white/70 text-xs">Browse collection</p>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRENDING NOW ───────────────────────────────────── */}
      <section className="py-12 px-6 max-w-7xl mx-auto bg-gray-50 rounded-3xl mb-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Trending Now</h2>
            <p className="text-gray-500 text-sm mt-1">
              Most popular products this week
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 px-4 py-2 rounded-xl hover:bg-white transition-colors"
          >
            View All
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ──────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Featured Products
          </h2>
          <p className="text-gray-500 text-sm">
            Hand-picked selection of our best products
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
          >
            Browse All Products
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white mt-8">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <p className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                ShopHub
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your one-stop shop for premium products. Quality guaranteed.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {["facebook", "twitter", "instagram", "youtube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    <span className="text-xs text-white/60 capitalize">
                      {s[0].toUpperCase()}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <p className="font-semibold text-sm mb-4">Shop</p>
              <div className="space-y-2.5">
                {["All Products", "Shoes", "T-Shirts", "Accessories"].map(
                  (l) => (
                    <Link
                      key={l}
                      href="/products"
                      className="block text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {l}
                    </Link>
                  ),
                )}
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <p className="font-semibold text-sm mb-4">Customer Service</p>
              <div className="space-y-2.5">
                {["Contact Us", "Shipping Info", "Returns", "FAQ"].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="font-semibold text-sm mb-4">Newsletter</p>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to get special offers and updates.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-400"
                />
                <button className="bg-blue-500 hover:bg-blue-600 transition-colors p-2.5 rounded-lg shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-6 text-center text-gray-500 text-xs">
            © 2026 ShopHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── PRODUCT CARD COMPONENT ──────────────────────────────────
function ProductCard({ product }: { product: any }) {
  const stars = Math.round(product.avgRating) || 4;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 block"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* badge */}
        {product.stock < 20 && product.stock > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 z-10 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Sold out
          </div>
        )}
        {product.stock >= 20 && (
          <div className="absolute top-3 left-3 z-10 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
            New
          </div>
        )}

        {/* wishlist */}
        <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <Image
          src={
            product.images?.[0] ||
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80"
          }
          fill
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Add to cart — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-3 flex items-center justify-center gap-2 transition-colors">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
          {product.name}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={i <= stars ? "#f59e0b" : "none"}
              stroke={i <= stars ? "#f59e0b" : "#d1d5db"}
              strokeWidth="1.5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
          <span className="text-[11px] text-gray-400 ml-1">
            ({product.reviewCount || 0})
          </span>
        </div>

        <p className="text-blue-500 font-black text-lg">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
}
