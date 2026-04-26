"use client";
import { useState } from "react";

interface Props {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: 14, md: 18, lg: 24 };

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: Props) {
  const [hovered, setHovered] = useState(0);
  const px = sizes[size];

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer"}`}
          >
            <svg
              width={px}
              height={px}
              viewBox="0 0 24 24"
              fill={filled ? "#F59E0B" : "none"}
              stroke={filled ? "#F59E0B" : "#D1D5DB"}
              strokeWidth="1.5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
