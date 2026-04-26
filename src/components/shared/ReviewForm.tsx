"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";

interface Props {
  productId: string;
  onReviewAdded: (review: any) => void;
}

export default function ReviewForm({ productId, onReviewAdded }: Props) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <p className="text-sm text-gray-500">
        <a href="/login" className="underline">
          Sign in
        </a>{" "}
        to leave a review
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    // pass new review up to parent to update UI instantly
    onReviewAdded(data);
    setRating(0);
    setComment("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Your rating</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">Your review</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={3}
          placeholder="What did you think of this product?"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white rounded-xl px-5 py-2 text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
