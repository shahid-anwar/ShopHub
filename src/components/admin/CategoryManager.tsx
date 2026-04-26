"use client";
// src/components/admin/CategoryManager.tsx
// Replace your existing CategoryManager with this

import { useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setCategories((prev) => [...prev, data]);
    setName("");
    setSuccess(`"${data.name}" added successfully`);
    setLoading(false);
    setTimeout(() => setSuccess(""), 3000);
  }

  async function handleDelete(id: string, catName: string) {
    if (
      !confirm(
        `Delete "${catName}"? Products in this category will be affected.`,
      )
    )
      return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c._id !== id));
  }

  const categoryIcons: Record<number, string> = {
    0: "👟",
    1: "👕",
    2: "⌚",
    3: "👜",
    4: "🕶️",
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <h2 className="font-bold text-gray-900">Add New Category</h2>
        </div>

        <form onSubmit={handleAdd} className="p-6">
          <div className="flex gap-3">
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Electronics, Sports, Books..."
              required
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-gray-50 text-gray-900 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-6 py-3 rounded-xl disabled:opacity-40 transition-colors shrink-0"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {success}
            </p>
          )}
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">All Categories</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
            {categories.length} total
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">
              No categories yet. Add one above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.map((cat, i) => (
              <div
                key={cat._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* Number badge */}
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-blue-500">
                      {i + 1}
                    </span>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      slug:{" "}
                      <span className="font-mono text-gray-500">
                        {cat.slug}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all font-semibold opacity-0 group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
