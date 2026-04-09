import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  avgRating: number;
  reviewCount: number;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    images: [{ type: String }],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // enables .populate('category')
      required: true,
    },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Auto-generate slug from name before saving
// productSchema.pre("save", function (next) {
//   if (!this.isModified("name")) return next();
//   this.slug = this.name
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9 -]/g, "")
//     .replace(/\s+/g, "-");
//   next();
// });

productSchema.pre("save", function () {
  console.log("🔥 SLUG GENERATING FOR:", this.name);
  if (!this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
