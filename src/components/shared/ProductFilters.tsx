"use client";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  categories: { _id: string; name: string; slug: string }[];
}

export default function ProductFilters({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset to page 1 on filter change
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <p className="text-sm font-medium mb-2">Search</p>
        <input
          type="text"
          placeholder="Search products..."
          defaultValue={searchParams.get("q") || ""}
          onChange={(e) => updateFilter("q", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
      </div>

      {/* Categories */}
      <div>
        <p className="text-sm font-medium mb-2">Category</p>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter("category", "")}
            className={`w-full text-left text-sm px-2 py-1.5 rounded-lg ${
              !searchParams.get("category")
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilter("category", cat._id)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-lg ${
                searchParams.get("category") === cat._id
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
