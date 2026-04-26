"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";

interface Review {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Props {
  productId: string;
  initialReviews: Review[];
  avgRating: number;
  reviewCount: number;
}

export default function ReviewList({
  productId,
  initialReviews,
  avgRating,
  reviewCount,
}: Props) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const hasReviewed = reviews.some((r) => r.user._id === session?.user?.id);

  function handleReviewAdded(review: Review) {
    setReviews((prev) => [review, ...prev]);
  }

  async function handleDelete(reviewId: string) {
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: "DELETE",
    });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    }
  }

  return (
    <div className="space-y-8">
      {/* Rating summary */}
      <div className="flex items-center gap-4">
        <span className="text-4xl font-bold">{avgRating || 0}</span>
        <div>
          <StarRating value={Math.round(avgRating)} readonly size="md" />
          <p className="text-sm text-gray-500 mt-1">{reviewCount} reviews</p>
        </div>
      </div>

      {/* Write a review */}
      {!hasReviewed && (
        <div className="border border-gray-100 rounded-2xl p-6">
          <h3 className="text-sm font-medium mb-4">Write a review</h3>
          <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} />
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-100 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{review.user.name}</p>
                  <StarRating value={review.rating} readonly size="sm" />
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {session?.user?.id === review.user._id && (
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
