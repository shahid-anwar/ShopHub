"use client";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface Props {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
    stock: number;
  };
}

export default function AddToCartButton({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i._id === product._id);
  const isOutOfStock = product.stock === 0;

  function handleAdd() {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      slug: product.slug,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (isOutOfStock) {
    return (
      <button
        disabled
        className="w-full bg-gray-100 text-gray-400 rounded-xl py-3 text-sm font-medium cursor-not-allowed"
      >
        Out of stock
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleAdd}
        className={`w-full rounded-xl py-3 text-sm font-medium transition-all ${
          added
            ? "bg-green-600 text-white"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {added ? "Added to cart!" : inCart ? "Add one more" : "Add to cart"}
      </button>

      {inCart && (
        <p className="text-xs text-center text-gray-500">
          {inCart.quantity} already in cart
        </p>
      )}
    </div>
  );
}
