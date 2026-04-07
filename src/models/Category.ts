import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  image: String,
});

export const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);
