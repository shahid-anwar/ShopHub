import { connectDB } from "@/lib/db";
import { Product } from "@/models";
import Link from "next/link";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

async function getProducts() {
  await connectDB();
  const products = await Product.find({})
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Products</h1>
          <p className="text-gray-400 text-sm mt-1">
            {products.length} total products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {[
                "Product",
                "Category",
                "Price",
                "Stock",
                "Rating",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p: any) => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {p.name}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                    {p.category?.name}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  ₹{p.price.toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      p.stock === 0
                        ? "bg-red-50 text-red-600"
                        : p.stock < 10
                          ? "bg-amber-50 text-amber-600"
                          : "bg-green-50 text-green-600"
                    }`}
                  >
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {p.avgRating > 0 ? (
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400">★</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {p.avgRating}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-300 text-xs">No reviews</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/products/${p._id}/edit`}
                      className="text-xs text-blue-500 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={p._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
