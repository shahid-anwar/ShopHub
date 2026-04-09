import Link from "next/link";
import Image from "next/image";

interface Props {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    avgRating: number;
    reviewCount: number;
    priority?: boolean;
  };
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          height={100}
          width={100}
          priority={product.priority}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </p>
        <div className="flex items-center gap-1">
          <span className="text-xs text-amber-500">★</span>
          <span className="text-xs text-gray-500">
            {product.avgRating > 0
              ? `${product.avgRating} (${product.reviewCount})`
              : "No reviews yet"}
          </span>
        </div>
        <p className="text-sm font-semibold">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
}
