import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import ProductCard from "@/components/shared/ProductCard";
import ProductFilters from "@/components/shared/ProductFilters";

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

async function getProducts(params: {
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
}) {
  await connectDB();

  const filter: any = {};

  if (params.q) {
    filter.name = { $regex: params.q, $options: "i" };
  }

  if (params.category) {
    filter.category = params.category;
  }

  let sortOption: any = { createdAt: -1 };

  if (params.sort === "price") {
    sortOption = { price: 1 };
  } else if (params.sort === "-price") {
    sortOption = { price: -1 };
  }

  const page = parseInt(params.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const [products, total, categories] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
    Category.find({}).lean(),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    total,
    totalPages: Math.ceil(total / limit),
    categories: JSON.parse(JSON.stringify(categories)),
    currentPage: page,
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const { products, total, totalPages, categories, currentPage } =
    await getProducts(params);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="w-56 shrink-0">
          <ProductFilters categories={categories} />
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{total} products</p>

            <select
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
              defaultValue={params.sort || "createdAt"}
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>

          {products.length === 0 ? (
            <p className="text-gray-500 text-sm">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p: any) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-2 mt-8 justify-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <a
                  key={n}
                  href={`/products?page=${n}`}
                  className={`px-3 py-1 rounded-lg text-sm border ${
                    n === currentPage
                      ? "bg-black text-white border-black"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {n}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
