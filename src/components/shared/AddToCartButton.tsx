"use client";

interface Props {
  product: any;
}

export default function AddToCartButton({ product }: Props) {
  return (
    <button
      className="w-full bg-black text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
      onClick={() => console.log("Add to cart:", product.name)}
    >
      Add to cart
    </button>
  );
}
