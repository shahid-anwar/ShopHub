import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

// One user can only review a product once
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// After a review is saved — recalculate product's avgRating
reviewSchema.post("save", async function () {
  const Review = this.constructor as mongoose.Model<IReview>;

  const stats = await Review.aggregate([
    { $match: { product: this.product } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  await mongoose.model("Product").findByIdAndUpdate(this.product, {
    avgRating: stats[0]?.avgRating.toFixed(1) ?? 0,
    reviewCount: stats[0]?.reviewCount ?? 0,
  });
});

export const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);
