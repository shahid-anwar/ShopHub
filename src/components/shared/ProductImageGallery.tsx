"use client";
// src/components/shared/ProductImageGallery.tsx

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  name: string;
}

export default function ProductImageGallery({ images, name }: Props) {
  const [selected, setSelected] = useState(0);
  const allImages = images?.length
    ? images
    : [
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
      ];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        className="relative w-full rounded-3xl overflow-hidden bg-gray-50"
        style={{ height: "480px" }}
      >
        <Image
          src={allImages[selected]}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                i === selected
                  ? "border-blue-500 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
