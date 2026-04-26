"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  categories: { _id: string; name: string }[];
  product?: any; // if passed = edit mode
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    category: product?.category || "",
    images: product?.images?.join(", ") || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const res = await fetch(
      isEdit ? `/api/products/${product._id}` : "/api/products",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  const fields = [
    { name: "name", label: "Product name", type: "text" },
    { name: "price", label: "Price (₹)", type: "number" },
    { name: "stock", label: "Stock", type: "number" },
    { name: "images", label: "Image URLs (comma separated)", type: "text" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => (
        <div key={f.name}>
          <label className="text-sm text-gray-600 block mb-1">{f.label}</label>
          <input
            name={f.name}
            type={f.type}
            required
            value={(form as any)[f.name]}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>
      ))}

      <div>
        <label className="text-sm text-gray-600 block mb-1">Description</label>
        <textarea
          name="description"
          required
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Category</label>
        <select
          name="category"
          required
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded-xl px-5 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-200 rounded-xl px-5 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
