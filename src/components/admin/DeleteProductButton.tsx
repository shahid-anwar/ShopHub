"use client";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this product?")) return;

    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh(); // refresh server component data
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:underline"
    >
      Delete
    </button>
  );
}
